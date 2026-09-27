import { useQuery } from '@tanstack/react-query';

import { getLikedMessages } from '@/src/features/inferno/api/likes';
import { likeKeys } from '@/src/features/inferno/api/query-keys';
import { useAuthStore } from '@/src/features/auth/store/auth-store';

/** 지금까지 좋아요 누른 메시지 전체 목록. */
export default function useLikedMessages() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: likeKeys.likedMessages,
    queryFn: getLikedMessages,
    enabled: isAuthenticated,
  });
}
