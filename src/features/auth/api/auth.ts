import httpClient from '@/src/lib/http-client';

import type { AuthUser } from '@/src/features/auth/types';

/** openapi `ApiResponse*` 계열 공통 껍데기. */
interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** openapi `AuthLoginResponse`. */
interface AuthLoginResponseBody {
  userId: number;
  nickname: string;
  isNewUser: boolean;
  accessToken: string;
}

interface GoogleLoginResult {
  user: AuthUser;
  accessToken: string;
}

/**
 * 구글 idToken 으로 서버 로그인/가입을 한 번에 처리한다(별도 가입 화면 없음, §12).
 * `POST /api/auth/google`.
 */
export async function googleLogin(idToken: string): Promise<GoogleLoginResult> {
  const { data } = await httpClient.post<ApiEnvelope<AuthLoginResponseBody>>('/api/auth/google', {
    idToken,
  });

  return {
    user: {
      userId: data.data.userId,
      nickname: data.data.nickname,
      isNewUser: data.data.isNewUser,
    },
    accessToken: data.data.accessToken,
  };
}

/** `POST /api/auth/logout`. */
export async function logout(): Promise<void> {
  await httpClient.post('/api/auth/logout');
}
