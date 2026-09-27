import axios from 'axios';
import { router } from 'expo-router';

import { clearAccessToken, getAccessToken } from '@/src/features/auth/lib/token-storage';
import { useAuthStore } from '@/src/features/auth/store/auth-store';
import { useBreadStore } from '@/src/features/bread/store/bread-store';
import { useInfernoStore } from '@/src/features/inferno/store/inferno-store';
import { useSurveyStore } from '@/src/features/survey/store/survey-store';
import queryClient from '@/src/lib/query-client';

/**
 * 서버 통신 전용 axios 인스턴스. §11 — 컴포넌트는 이 모듈을 직접 부르지 않고
 * `src/features/<feature>/api/` 안의 함수를 거친다.
 *
 * accessToken 주입과 401 처리만 한다 — 백엔드 응답에 refreshToken 이 없어서(§12) 조용히
 * 갱신하는 흐름은 만들 수 없다. 401 이면 그냥 로그아웃 처리하고 온보딩으로 돌려보낸다.
 */
// EXPO_PUBLIC_API_URL 끝에 슬래시가 있어도(예: "https://host/") 각 API 함수가 앞에
// "/api/..."를 그대로 붙이므로 "//api/..."처럼 겹치지 않게 여기서 한 번 정리한다.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');

// 타임아웃이 없으면 백엔드가 응답을 안 줄 때(AI 연동 불안정 등) 요청이 조용히 영원히
// 매달려서 성공 로그도 실패 로그도 안 찍힌다 — "요청이 하나도 안 잡히는" 것처럼 보여서
// 쿼리가 아예 안 불렸다고 오판하게 만든다(실기기 로그로 확인된 증상). 15초 넘게 응답이
// 없으면 명확한 타임아웃 에러로 표면화한다.
const REQUEST_TIMEOUT_MS = 15000;

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
});

httpClient.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      await clearAccessToken();
      useAuthStore.getState().clearSession();
      useBreadStore.getState().clear();
      useSurveyStore.getState().resetSurvey();
      useInfernoStore.getState().resetProgress();
      queryClient.clear();
      router.replace('/onboarding');
    }
    return Promise.reject(error);
  },
);

export default httpClient;
