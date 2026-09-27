import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuthStore } from '@/src/features/auth/store/auth-store';

/**
 * 개발 중 원인 불명 실패를 안 겪으려고 실제 요청 URL/상태코드까지 찍는다(§14 — 프로덕션 전
 * 크래시 리포팅으로 교체할 자리). 계정별 캐시 격리 버그를 추적할 때 "어느 계정에서 난
 * 에러인지"가 핵심 증거라 실패 시에도 현재 로그인된 user를 같이 찍는다.
 */
function logQueryError(context: string, error: unknown) {
  if (!__DEV__) {
    return;
  }

  const user = useAuthStore.getState().user;
  const userTag = `user=${user?.userId}(${user?.nickname})`;

  if (axios.isAxiosError(error)) {
    // response가 없으면(타임아웃/네트워크 단절) status/data는 항상 undefined라 그대로 찍으면
    // "무슨 일이 있었는지 전혀 모름"이 된다 — 이 경우 axios가 주는 code/message(예:
    // 'ECONNABORTED', 'timeout of 15000ms exceeded')를 대신 찍어서 "응답이 아예 안 왔다"는
    // 걸 다른 실패(4xx/5xx)와 구분할 수 있게 한다.
    if (!error.response) {
      console.error(
        `[${context}] ${userTag} ${error.config?.method?.toUpperCase()} ${error.config?.url} -> 응답 없음 (${error.code}: ${error.message})`,
      );
      return;
    }

    console.error(
      `[${context}] ${userTag} ${error.config?.method?.toUpperCase()} ${error.config?.url} -> ${error.response.status}`,
      error.response.data,
    );
    return;
  }

  console.error(`[${context}] ${userTag}`, error);
}

/**
 * 앱 전역에서 쓰는 단 하나의 QueryClient. §11 — 컴포넌트 안에서 새로 만들지 않는다.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => logQueryError(`query ${String(query.queryKey[0])}`, error),
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) =>
      logQueryError(`mutation ${mutation.options.mutationKey ?? ''}`, error),
  }),
});

export default queryClient;
