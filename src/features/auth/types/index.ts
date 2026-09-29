/**
 * 인증 도메인 타입. `POST /api/auth/google` 응답(`AuthLoginResponse`)의 인가 관련 부분만 담는다.
 * accessToken 은 SecureStore 로만 다루므로(§12) 스토어/화면에 넘기는 값에는 포함하지 않는다.
 */
export interface AuthUser {
  userId: number;
  nickname: string;
  /** 첫 로그인(=가입)인지. 별도 가입 화면이 없어 이 값으로만 구분한다. */
  isNewUser: boolean;
}
