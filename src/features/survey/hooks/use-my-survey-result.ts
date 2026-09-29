import { useQuery } from '@tanstack/react-query';

import { getMySurveyResult } from '@/src/features/survey/api/survey';
import { surveyKeys } from '@/src/features/survey/api/query-keys';
import { useAuthStore } from '@/src/features/auth/store/auth-store';

/**
 * 로그인된 사용자의 최신 완료 결과. 미완료는 `data: null`(에러 아님) — 앱 재시작/재로그인
 * 후 결과 복구의 기준이다(FRONTEND_CHANGES.md §4).
 */
export default function useMySurveyResult() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: surveyKeys.myResult,
    queryFn: getMySurveyResult,
    enabled: isAuthenticated,
  });
}
