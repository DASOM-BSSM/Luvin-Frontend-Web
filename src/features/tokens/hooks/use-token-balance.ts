import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getMyTokenBalance } from '@/src/features/tokens/api/tokens';
import { tokenKeys } from '@/src/features/tokens/api/query-keys';
import { useAuthStore } from '@/src/features/auth/store/auth-store';
import { useTokenStore } from '@/src/features/luvin-hell/store/token-store';

/**
 * 서버 토큰 잔액을 받아와 기존 `useTokenStore`(MMKV, §12 표)에 동기화한다.
 *
 * 화면들은 여전히 `useTokenStore` 를 그대로 읽으면 된다 — 미니게임 보상 등 로컬에서
 * 먼저 반영해야 하는 흐름을 건드리지 않기 위해, 이 훅은 "서버 값으로 덮어쓰기"만 하고
 * 화면의 읽기 방식은 바꾸지 않는다.
 */
export default function useTokenBalance() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setBalance = useTokenStore((state) => state.setBalance);

  const query = useQuery({
    queryKey: tokenKeys.balance,
    queryFn: getMyTokenBalance,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (query.data) {
      setBalance(query.data.tokenBalance);
    }
  }, [query.data, setBalance]);

  return query;
}
