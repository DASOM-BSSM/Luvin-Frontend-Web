import { useMutation } from '@tanstack/react-query';

import { signOutGoogle } from '@/src/features/auth/lib/google-auth';
import { clearAccessToken } from '@/src/features/auth/lib/token-storage';
import { useAuthStore } from '@/src/features/auth/store/auth-store';
import { useBreadStore } from '@/src/features/bread/store/bread-store';
import { useInfernoStore } from '@/src/features/inferno/store/inferno-store';
import { useTokenStore } from '@/src/features/luvin-hell/store/token-store';
import { useProfileSettingsStore } from '@/src/features/my-page/store/profile-settings-store';
import { useSurveyStore } from '@/src/features/survey/store/survey-store';
import { deleteMyAccount } from '@/src/features/user/api/profile';
import queryClient from '@/src/lib/query-client';

/**
 * 마이페이지 "계정 탈퇴"가 쓰는 훅. 서버에서 계정을 지운 뒤, 이 기기에 남은 것까지 전부 지워
 * 같은 구글 계정으로 다시 로그인해도 처음 가입한 것처럼 시작하게 한다.
 *
 * 로그아웃(use-logout)과 달리 서버 요청이 실패하면 로컬을 지우지 않는다 — 계정이 서버에 그대로
 * 남아 있는데 로그아웃만 된 상태를 "탈퇴됐다"로 보이게 하면 안 된다. 화면이 실패를 알리고
 * 다시 시도하게 한다.
 *
 * 로그아웃이 지우는 것에 더해, 로그아웃은 남겨두는 기기 저장값(내 정보 수정의 닉네임/성별 초안,
 * 토큰 잔액)도 처음 값으로 되돌린다.
 */
export default function useDeleteAccount() {
  const clearSession = useAuthStore((state) => state.clearSession);

  return useMutation({
    mutationFn: async () => {
      await deleteMyAccount();
      await signOutGoogle();
      await clearAccessToken();
    },
    onSuccess: () => {
      clearSession();
      useBreadStore.getState().clear();
      useSurveyStore.getState().resetSurvey();
      useInfernoStore.getState().resetProgress();
      useProfileSettingsStore.getState().setNickname('');
      useProfileSettingsStore.getState().setGender('male');
      useTokenStore.getState().setBalance(0);
      queryClient.clear();
    },
  });
}
