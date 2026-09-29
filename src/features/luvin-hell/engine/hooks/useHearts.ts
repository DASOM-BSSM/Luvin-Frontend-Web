import type { StoreApi, UseBoundStore } from 'zustand';

import type { RunStore } from '@/src/features/luvin-hell/engine/types';

/** 하트 개수만 구독하는 얇은 셀렉터. 하트 표시만 필요한 곳에서 전체 useMissionRun 대신 쓴다. */
export function useHearts(useRunStore: UseBoundStore<StoreApi<RunStore>>): number {
  return useRunStore((s) => s.hearts);
}
