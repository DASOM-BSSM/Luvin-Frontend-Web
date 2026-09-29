import { useQuery } from '@tanstack/react-query';

import { getMyProfile } from '@/src/features/user/api/profile';
import { userKeys } from '@/src/features/user/api/query-keys';
import { useAuthStore } from '@/src/features/auth/store/auth-store';

/** 로그인된 사용자의 프로필. 로그인 전에는 요청 자체를 보내지 않는다. */
export default function useMyProfile() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: userKeys.me,
    queryFn: getMyProfile,
    enabled: isAuthenticated,
  });
}
