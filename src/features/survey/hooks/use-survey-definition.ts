import { useQuery } from '@tanstack/react-query';

import { getSurveyDefinition } from '@/src/features/survey/api/survey';
import { surveyKeys } from '@/src/features/survey/api/query-keys';
import { useAuthStore } from '@/src/features/auth/store/auth-store';

/** 표시용 설문 정의. 화면이 시작할 때 한 번 받아 스토어에 snapshot으로 고정한다. */
export default function useSurveyDefinition() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: surveyKeys.definition,
    queryFn: getSurveyDefinition,
    enabled: isAuthenticated,
  });
}
