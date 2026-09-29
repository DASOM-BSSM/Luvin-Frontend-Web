import { GoogleSignin } from '@react-native-google-signin/google-signin';

/**
 * 구글 계정에서 idToken 을 받아오는 플랫폼 의존 부분만 모은 모듈(§12). 웹은 `google-auth.web.ts`.
 *
 * 서버 로그인(`googleLogin`)과 로그인 후 캐시 정리는 플랫폼과 무관해서 훅(`use-google-sign-in.ts`)
 * 에 한 벌만 둔다 — 여기엔 "idToken 을 어떻게 얻느냐"만 둔다.
 */

/**
 * 앱 시작 시 한 번만 부른다(`src/app/_layout.tsx` 모듈 스코프). 클라이언트 ID 는 비밀값이
 * 아니라 EXPO_PUBLIC_ 로 노출해도 된다(§4) — 실제 인가는 서버가 accessToken 발급으로 한다.
 */
export function configureGoogleAuth(): void {
  GoogleSignin.configure({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });
}

/**
 * 네이티브 구글 로그인 창을 띄워 idToken 을 받는다. 사용자가 취소하면 에러가 아니라 `null`.
 */
export async function requestGoogleIdToken(): Promise<string | null> {
  await GoogleSignin.hasPlayServices();
  const result = await GoogleSignin.signIn();

  if (result.type === 'cancelled') {
    return null;
  }

  const { idToken } = result.data;
  if (!idToken) {
    throw new Error('구글 로그인에서 idToken을 받지 못했습니다.');
  }

  return idToken;
}

/** 다음 로그인 때 계정 선택 창이 다시 뜨도록 구글 쪽 세션을 끊는다. */
export async function signOutGoogle(): Promise<void> {
  await GoogleSignin.signOut();
}
