/** openapi `UserProfileResponse` — `GET /api/users/me`. */
export interface UserProfile {
  memberId: number;
  name: string;
  nickname: string;
  gender: string;
  age: number;
  job: string;
  bio: string;
  /**
   * 최신 완료 설문 결과의 canonical 유형 코드. 그 결과가 진짜 본인 것일 때만 채워진다 —
   * 미완료/구버전 답변만 있으면 null(SHARED_API_CONTRACT.md §6). "이름이 있다"는 이유로
   * 화면에서 신뢰하지 않는다.
   */
  personalityType: string | null;
  /** 설문 결과 화면(내 성향)에서 다시 조회할 때 쓴다. 없으면 null. */
  latestSurveyResultId: string | null;
  /** latestSurveyResultId가 본인의 유효한 완료 결과를 가리킬 때만 true. */
  surveyCompleted: boolean;
}

/**
 * openapi `UserProfileUpdateRequest` — `PUT /api/users/me`.
 *
 * `gender`는 openapi 스펙에 enum 없이 그냥 `string`이다 — 로컬 `Gender`('female'|'male')
 * 값을 그대로 보낸다고 가정했다. 실제로 다른 대소문자/포맷(예: 'MALE')을 기대하면 이
 * 값을 보내는 쪽(use-update-profile.ts 호출부)만 고치면 된다.
 */
export interface UpdateUserProfileInput {
  nickname?: string;
  gender?: string;
  job?: string;
  bio?: string;
}
