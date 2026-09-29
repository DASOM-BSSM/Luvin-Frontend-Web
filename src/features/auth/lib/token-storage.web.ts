/**
 * `token-storage.ts` 의 웹 버전 — accessToken 을 다루는 유일한 모듈(§12). Metro 가 웹 번들에서는
 * 이 파일을 대신 고른다(AGENTS.md §1).
 *
 * expo-secure-store 는 웹 구현이 빈 객체라 호출하는 순간 에러가 난다. 웹에서는 팀 결정에 따라
 * 브라우저 `localStorage` 에 둔다(§12 — XSS 가 생기면 읽힐 수 있다는 걸 감수한 선택).
 * 네이티브 버전과 시그니처를 맞추려고 동기 API 지만 Promise 로 감싸 돌려준다.
 *
 * 비민감 값용 `src/lib/storage` 래퍼와는 일부러 섞지 않는다 — 토큰은 이 모듈 밖으로 새지 않게 한다.
 */
const ACCESS_TOKEN_KEY = 'luvin.auth.accessToken';

// 브라우저가 저장소 접근을 막은 환경(사파리 개인정보 보호 모드, 쿠키 차단 등)에서는 localStorage 가
// throw 한다. 그때 저장을 그냥 버리면 로그인 직후 첫 요청부터 토큰 없이 나가 401 → 온보딩으로
// 튕기므로, 적어도 지금 탭이 살아 있는 동안은 메모리에 들고 있는다(새로고침하면 재로그인).
let memoryToken: string | null = null;

/** 서버 렌더링 중이거나(`window` 없음) 저장소 접근이 막혔으면 undefined. */
function getLocalStorage(): Storage | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export async function getAccessToken(): Promise<string | null> {
  try {
    return getLocalStorage()?.getItem(ACCESS_TOKEN_KEY) ?? memoryToken;
  } catch {
    return memoryToken;
  }
}

export async function setAccessToken(accessToken: string): Promise<void> {
  memoryToken = accessToken;

  try {
    getLocalStorage()?.setItem(ACCESS_TOKEN_KEY, accessToken);
  } catch {
    // 용량 초과 등 — 위의 메모리 값으로 이번 탭 동안은 계속 동작한다.
  }
}

export async function clearAccessToken(): Promise<void> {
  memoryToken = null;

  try {
    getLocalStorage()?.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // 저장소 접근이 막힌 환경 — 지울 것도 없다.
  }
}
