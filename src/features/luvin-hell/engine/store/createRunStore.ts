import { create, type StoreApi, type UseBoundStore } from 'zustand';

import { useTokenStore } from '@/src/features/luvin-hell/store/token-store';
import type { RunStore } from '@/src/features/luvin-hell/engine/types';
import { hasMetMissionTarget, rollMissionTarget } from '@/src/features/luvin-hell/engine/utils/missionTarget';
import type { MissionRange } from '@/src/features/luvin-hell/types';

/** 모든 미니게임 공통 시작 하트 수. 공통 규칙: 어떤 실패든 하트 -1, 0이 되면 실패 처리. */
const INITIAL_HEARTS = 3;

/**
 * 미션 난이도와 무관하게 성공하면 무조건 1개(백엔드 설계 — `MinigameListItemResponse.rewardToken`
 * 이 게임당 고정값 하나뿐이고, `POST /api/minigames/{gameId}/play`도 난이도/점수를 받지
 * 않는다). 예전엔 난이도 비례로 2~5개를 계산했는데, 서버 잔액 동기화(`useTokenBalance`)가
 * 그 값을 항상 서버의 고정 보상으로 덮어써서 실제로는 늘 1개만 남는 모순이 있었다 — 로컬
 * 계산을 걷어내고 서버와 같은 고정값으로 맞춘다.
 */
const FIXED_MINIGAME_REWARD = 1;

/**
 * 런(하트/점수/미션/phase) 상태 스토어 **팩토리**.
 *
 * 절대 모듈 스코프 싱글턴으로 두지 않는다 — 두 게임이 각자 `createRunStore()`를 호출해
 * 서로 다른 인스턴스를 쓴다. 한쪽 게임의 진행 상태가 다른 게임으로 새어 들어가는 것을 막기 위함
 * (엔진 아키텍처 검토에서 나온 권고).
 */
export function createRunStore(): UseBoundStore<StoreApi<RunStore>> {
  return create<RunStore>((set, get) => ({
    phase: 'ready',
    hearts: INITIAL_HEARTS,
    score: 0,
    missionTarget: 0,
    reward: 0,
    missionRange: [0, 0],

    begin: (missionRange: MissionRange) => {
      const missionTarget = rollMissionTarget(missionRange);
      set({
        phase: 'ready',
        hearts: INITIAL_HEARTS,
        score: 0,
        missionTarget,
        reward: FIXED_MINIGAME_REWARD,
        missionRange,
      });
    },

    startPlaying: () => {
      if (get().phase === 'ready') set({ phase: 'playing' });
    },

    registerHit: () => {
      if (get().phase !== 'playing') return;
      const hearts = get().hearts - 1;
      set({ hearts, phase: hearts <= 0 ? 'fail' : 'playing' });
    },

    setScore: (score: number) => {
      if (get().phase !== 'playing') return;
      const { missionTarget, reward } = get();
      if (hasMetMissionTarget(score, missionTarget)) {
        set({ score, phase: 'success' });
        useTokenStore.getState().addTokens(reward);
      } else {
        set({ score });
      }
    },

    restart: () => get().begin(get().missionRange),
  }));
}
