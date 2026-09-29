import { useMutation } from '@tanstack/react-query';

import { googleLogin } from '@/src/features/auth/api/auth';
import { requestGoogleIdToken } from '@/src/features/auth/lib/google-auth';
import { setAccessToken } from '@/src/features/auth/lib/token-storage';
import { useAuthStore } from '@/src/features/auth/store/auth-store';
import { useBreadStore } from '@/src/features/bread/store/bread-store';
import { useInfernoStore } from '@/src/features/inferno/store/inferno-store';
import { useSurveyStore } from '@/src/features/survey/store/survey-store';
import queryClient from '@/src/lib/query-client';

/**
 * 온보딩의 "로그인 하기" 버튼이 쓰는 훅. 네이티브 구글 로그인 → 서버 로그인(§12)까지
 * 한 번에 처리한다. 사용자가 구글 로그인 창에서 취소한 경우는 에러가 아니라 그냥
 * `null` 을 돌려준다 — 화면이 에러 문구를 띄우지 않게 하기 위함.
 *
 * idToken 을 얻는 방법만 플랫폼마다 다르다(`google-auth.ts` / 웹은 팝업 `google-auth.web.ts`).
 * 웹은 팝업 차단을 피하려고 클릭 직후 곧바로 팝업을 열어야 하므로, `requestGoogleIdToken()`
 * 앞에 다른 `await` 를 두지 않는다.
 */
export default function useGoogleSignIn() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: async () => {
      const idToken = await requestGoogleIdToken();

      if (!idToken) {
        return null;
      }

      return googleLogin(idToken);
    },
    onSuccess: async (result) => {
      if (!result) {
        return;
      }

      // 로그아웃을 안 거치고 바로 다른 계정으로 로그인하는 경로(구글 계정 선택 화면에서
      // 다른 계정 선택 등)도 있어서, 로그아웃 때와 마찬가지로 이전 계정의 캐시를 여기서도
      // 지운다 — 안 그러면 새 계정인데 이전 계정의 시즌/반죽/설문 결과가 그대로 보인다
      // (사용자가 실기기에서 직접 재현한 버그).
      //
      // useInfernoStore(완료한 회차 목록)도 같이 지운다 — 이건 MMKV에 계정 구분 없이 저장돼서
      // 위 셋을 지워도 안 지워지면, 홈 화면의 "다음 에피소드"(findNextInfernoEpisode)가 이전
      // 계정이 완료한 회차 수만큼 건너뛴 회차를 새 계정 것인 양 보여준다 — 실제 서버 시즌은
      // 1화도 안 끝났는데 홈 화면만 2화부터 시작하는 것처럼 보이는 버그로 재현됨.
      queryClient.clear();
      useBreadStore.getState().clear();
      useSurveyStore.getState().resetSurvey();
      useInfernoStore.getState().resetProgress();

      await setAccessToken(result.accessToken);
      setSession(result.user);
    },
    onError: (error) => {
      // 화면에는 일반 문구만 보여준다(§11) — 실제 원인은 Metro/adb 로그에서 확인한다.
      // 프로덕션 전 크래시 리포팅(§14)이 붙으면 여기서 그쪽으로 보낸다.
      console.error('[useGoogleSignIn] 로그인 실패:', error);
    },
  });
}
