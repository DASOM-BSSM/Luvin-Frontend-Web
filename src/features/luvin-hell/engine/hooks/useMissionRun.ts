import type { StoreApi, UseBoundStore } from 'zustand';

import type { RunStore } from '@/src/features/luvin-hell/engine/types';

/**
 * 게임별 run 스토어(`createRunStore()`로 만든 훅)를 얇게 셀렉터로 감싼 공용 훅.
 * HUD/Ready/Result 오버레이와 두 게임 엔진 모두 이 훅 하나로 런 상태를 읽고 쓴다.
 *
 * action 함수들(begin/startPlaying/registerHit/setScore/restart)은 zustand store 생성 시
 * 한 번만 만들어져 store 수명 내내 참조가 바뀌지 않으므로 `getState()`로 꺼내 써도 안전하다.
 */
export function useMissionRun(useRunStore: UseBoundStore<StoreApi<RunStore>>) {
  const phase = useRunStore((s) => s.phase);
  const hearts = useRunStore((s) => s.hearts);
  const score = useRunStore((s) => s.score);
  const missionTarget = useRunStore((s) => s.missionTarget);
  const reward = useRunStore((s) => s.reward);
  const { begin, startPlaying, registerHit, setScore, restart } = useRunStore.getState();

  return { phase, hearts, score, missionTarget, reward, begin, startPlaying, registerHit, setScore, restart };
}
