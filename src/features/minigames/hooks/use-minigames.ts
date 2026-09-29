import { useQuery } from '@tanstack/react-query';

import { getMinigames } from '@/src/features/minigames/api/minigames';
import { minigameKeys } from '@/src/features/minigames/api/query-keys';
import { useAuthStore } from '@/src/features/auth/store/auth-store';

/** 미니게임 목록. `title` 로 개별 게임(공룡빵게임/빵건너친구들)의 서버 gameId 를 찾는 데 쓴다. */
export default function useMinigames() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: minigameKeys.list,
    queryFn: getMinigames,
    enabled: isAuthenticated,
  });
}
