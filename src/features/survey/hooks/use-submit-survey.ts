import { useMutation } from '@tanstack/react-query';

import { submitSurvey, type SubmitSurveyInput } from '@/src/features/survey/api/survey';
import { surveyKeys } from '@/src/features/survey/api/query-keys';
import { mapSurveyResultToBreadProfile } from '@/src/features/survey/utils/map-bread-result';
import { useBreadStore } from '@/src/features/bread/store/bread-store';
import { userKeys } from '@/src/features/user/api/query-keys';
import queryClient from '@/src/lib/query-client';

/**
 * 마지막 문항 제출. 성공하면 결과를 캐시에 바로 반영하고(재조회 없이도 즉시 표시),
 * `useBreadStore`도 함께 채운다 — ep1~4가 이미 그 스토어에서 "나"를 읽고 있어서(§ 브릿지,
 * FRONTEND_CHANGES.md §8) 여기서 갱신해야 다른 화면도 바로 새 결과를 본다.
 */
export default function useSubmitSurvey() {
  const setProfile = useBreadStore((state) => state.setProfile);

  return useMutation({
    mutationFn: (input: SubmitSurveyInput) => submitSurvey(input),
    onSuccess: (result) => {
      queryClient.setQueryData(surveyKeys.myResult, result);
      queryClient.invalidateQueries({ queryKey: userKeys.me });

      const profile = mapSurveyResultToBreadProfile(result);
      if (profile) {
        setProfile(profile);
      }
    },
  });
}
