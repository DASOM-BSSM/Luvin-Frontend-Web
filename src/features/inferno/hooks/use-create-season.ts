import { useMutation } from '@tanstack/react-query';

import { createSeasonFromSurvey } from '@/src/features/inferno/api/ai-season';
import { aiSeasonKeys } from '@/src/features/inferno/api/query-keys';
import queryClient from '@/src/lib/query-client';

/**
 * 실제 "시즌 시작" action에 붙이는 훅. 설문 제출과는 별도 요청이라, AI 생성이 실패해도
 * 설문 결과 자체는 그대로 남는다(SHARED_API_CONTRACT.md §7) — 실패하면 이 action만
 * 다시 시도하면 된다.
 */
export default function useCreateSeason() {
  return useMutation({
    mutationFn: (surveyResultId: string) => createSeasonFromSurvey(surveyResultId),
    onSuccess: (status) => {
      queryClient.setQueryData(aiSeasonKeys.status, status);
    },
  });
}
