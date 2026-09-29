import * as SecureStore from 'expo-secure-store';

/**
 * accessToken 을 다루는 유일한 모듈(§12). 다른 곳에서 SecureStore 를 직접 부르지 않는다.
 *
 * 백엔드 응답(`AuthLoginResponse`)에는 refreshToken 이 없다 — accessToken 하나뿐이고
 * 갱신용 엔드포인트도 스펙에 없어서, 만료되면 재로그인해야 한다(§12 가 가정하는 리프레시
 * 플로우는 지금 API로는 만들 수 없다).
 */
const ACCESS_TOKEN_KEY = 'auth.accessToken';

export function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export function setAccessToken(accessToken: string): Promise<void> {
  return SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
}

export function clearAccessToken(): Promise<void> {
  return SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}
