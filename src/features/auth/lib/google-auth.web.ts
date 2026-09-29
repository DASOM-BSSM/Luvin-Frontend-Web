import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';

/**
 * `google-auth.ts` 의 웹 버전(AGENTS.md §1, §12).
 *
 * `@react-native-google-signin/google-signin` 은 웹 구현이 후원자 전용이라 쓸 수 없다. 구글 공식
 * 웹 버튼(Google Identity Services `renderButton`)은 버튼을 구글이 그려서 Figma 디자인 버튼을 못
 * 쓰므로, 디자인 버튼 클릭 → 팝업으로 구글 OAuth(OpenID Connect implicit, `response_type=id_token`)
 * 를 열어 idToken 을 받는다. 네이티브와 같은 Web Client ID 로 받으므로 서버가 검증하는 aud 도 같다.
 *
 * 흐름: 팝업이 구글 로그인 → `REDIRECT_PATH` 로 돌아옴(URL 해시에 id_token) → 그 팝업 안에서도
 * 앱이 로드되며 `configureGoogleAuth()` 가 `maybeCompleteAuthSession()` 으로 URL 을 부모 창에
 * 넘기고 → 부모 창의 `openAuthSessionAsync` 가 그 URL 을 받아 팝업을 닫는다.
 *
 * Google Cloud Console 의 Web Client 에 origin 마다 등록이 필요하다:
 *   - 승인된 JavaScript 원본: `https://<도메인>`, `http://localhost:8081`
 *   - 승인된 리디렉션 URI: `https://<도메인>/onboarding`, `http://localhost:8081/onboarding`
 */

// 로그인 버튼이 있는 화면으로 돌아오게 한다 — 새 라우트를 만들면 공개 URL 이 하나 늘어난다(§13).
const REDIRECT_PATH = '/onboarding';
const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';

function getRedirectUri(): string {
  return `${window.location.origin}${REDIRECT_PATH}`;
}

/**
 * 웹은 설정할 SDK 가 없다. 대신 이 창이 로그인 팝업의 리다이렉트 페이지라면 결과를 부모 창에
 * 넘긴다 — 앱 시작 시(`_layout.tsx` 모듈 스코프) 불리므로 리다이렉트 직후 가장 먼저 실행된다.
 * 진행 중인 로그인이 없거나 URL 이 리다이렉트 주소가 아니면 아무 일도 하지 않는다.
 */
export function configureGoogleAuth(): void {
  // 정적 빌드는 Node 에서 미리 렌더링하므로 window 가 없다(§1).
  if (typeof window === 'undefined') {
    return;
  }

  WebBrowser.maybeCompleteAuthSession();
}

/** JWT payload 의 `nonce` 만 읽는다 — 서명 검증은 서버가 한다. */
function readIdTokenNonce(idToken: string): string | undefined {
  const payload = idToken.split('.')[1];
  if (!payload) {
    return undefined;
  }

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded: { nonce?: unknown } = JSON.parse(atob(base64));
    return typeof decoded.nonce === 'string' ? decoded.nonce : undefined;
  } catch {
    return undefined;
  }
}

/**
 * 팝업으로 구글 로그인을 열어 idToken 을 받는다. 사용자가 팝업을 닫거나 동의를 거부하면 `null`.
 *
 * 반드시 클릭 핸들러에서 곧바로 불려야 한다 — 이 함수 안에서 팝업을 열기 전에 `await` 를 두면
 * 모바일 브라우저가 "사용자 입력과 무관한 팝업"으로 보고 차단한다.
 */
export async function requestGoogleIdToken(): Promise<string | null> {
  const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  if (!clientId) {
    throw new Error('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID 가 설정되지 않았습니다.');
  }

  // state: 돌아온 응답이 이번 요청의 것인지 확인(CSRF). nonce: idToken 재사용(replay) 방지.
  const state = Crypto.randomUUID();
  const nonce = Crypto.randomUUID();
  const redirectUri = getRedirectUri();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'id_token',
    scope: 'openid email profile',
    state,
    nonce,
    // 다른 계정으로 바꿔 로그인할 수 있게 매번 계정 선택 창을 띄운다(네이티브와 같은 동작).
    prompt: 'select_account',
  });

  const result = await WebBrowser.openAuthSessionAsync(
    `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`,
    redirectUri,
  );

  if (result.type !== 'success') {
    return null;
  }

  // implicit 흐름은 결과를 쿼리가 아니라 해시(#)에 담아 돌려준다.
  const response = new URLSearchParams(new URL(result.url).hash.slice(1));

  if (response.get('state') !== state) {
    throw new Error('구글 로그인 응답의 state 가 일치하지 않습니다.');
  }

  const error = response.get('error');
  if (error === 'access_denied') {
    return null;
  }
  if (error) {
    throw new Error(`구글 로그인 실패: ${error}`);
  }

  const idToken = response.get('id_token');
  if (!idToken) {
    throw new Error('구글 로그인에서 idToken을 받지 못했습니다.');
  }
  if (readIdTokenNonce(idToken) !== nonce) {
    throw new Error('구글 로그인 idToken 의 nonce 가 일치하지 않습니다.');
  }

  return idToken;
}

/**
 * 웹 implicit 흐름은 앱이 들고 있는 구글 세션이 없어서 끊을 것이 없다. 다음 로그인에서 계정 선택
 * 창이 뜨는 건 `prompt: 'select_account'` 가 보장한다.
 */
export async function signOutGoogle(): Promise<void> {}
