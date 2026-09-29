import { useEffect } from 'react';

import { useBreadStore } from '@/src/features/bread/store/bread-store';
import useMySurveyResult from '@/src/features/survey/hooks/use-my-survey-result';
import { mapSurveyResultToBreadProfile } from '@/src/features/survey/utils/map-bread-result';

/**
 * 서버 설문 결과를 `useBreadStore`(브릿지)에 동기화해서 돌려준다. 앱 재시작/재로그인 후
 * 결과를 복구하는 지점이 바로 여기다 — 화면은 이 훅 하나만 부르면 되고, `useBreadStore`를
 * 직접 구독하는 기존 소비자(ep1~4 등)도 이 훅이 어딘가에서 한 번 마운트되면 같이 갱신된다.
 *
 * 결과가 `mixed`/`poorFit`이어도 화면 문구는 서버가 이미 제한해서 내려준다(§6) — 여기서
 * 추가로 신뢰도를 계산하거나 문구를 바꾸지 않는다.
 */
export default function useBreadProfile() {
  const resultQuery = useMySurveyResult();
  const profile = useBreadStore((state) => state.profile);
  const setProfile = useBreadStore((state) => state.setProfile);

  useEffect(() => {
    if (!resultQuery.data) {
      return;
    }

    const mapped = mapSurveyResultToBreadProfile(resultQuery.data);
    if (mapped) {
      setProfile(mapped);
    }
  }, [resultQuery.data, setProfile]);

  return {
    profile,
    /** 서버에 결과가 아예 없음(설문 전) — 로딩/에러와 구분한다. */
    isSurveyMissing: resultQuery.isSuccess && resultQuery.data === null,
    isLoading: resultQuery.isLoading,
    isError: resultQuery.isError,
    refetch: resultQuery.refetch,
  };
}
