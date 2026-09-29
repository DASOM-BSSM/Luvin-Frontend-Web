import { useQuery } from '@tanstack/react-query';

import { getSeasonStatus } from '@/src/features/inferno/api/ai-season';
import { aiSeasonKeys } from '@/src/features/inferno/api/query-keys';
import { useAuthStore } from '@/src/features/auth/store/auth-store';

/** 지금 시즌 상태(참가자 목록 포함). `GET /api/ai/seasons/me`. */
export default function useAiSeasonStatus() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: aiSeasonKeys.status,
    queryFn: getSeasonStatus,
    enabled: isAuthenticated,
  });
}
