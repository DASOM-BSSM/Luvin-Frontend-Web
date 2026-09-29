/** 백엔드 `ApiResponse<T>` 계열 공통 껍데기. */
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}
