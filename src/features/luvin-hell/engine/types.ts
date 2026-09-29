import type { GamePhase, MissionRange } from '@/src/features/luvin-hell/types';

export type { GamePhase, MissionRange };

/** 축 정렬 사각형(Axis-Aligned Bounding Box). 충돌판정에 쓰는 최소 단위. */
export interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RunState {
  phase: GamePhase;
  hearts: number;
  score: number;
  /** 이번 런의 목표 기록. `begin()`/`restart()` 시 1회 랜덤 추출 후 고정. */
  missionTarget: number;
  /** 목표 달성 시 지급될 토큰 수. 목표치와 함께 미리 계산해 Ready 단계부터 HUD에 보여준다. */
  reward: number;
  missionRange: MissionRange;
}

export interface RunActions {
  /** 목표치/보상을 새로 뽑고 하트·점수를 초기화한 뒤 phase를 'ready'로 되돌린다. 화면 진입/재시작 공용. */
  begin: (missionRange: MissionRange) => void;
  /** Ready 오버레이 탭 → 실제 플레이 시작. */
  startPlaying: () => void;
  /** 충돌/낙사 등 모든 실패 이벤트의 공통 진입점. 하트 -1, 0이면 phase='fail'. */
  registerHit: () => void;
  /** 점수 갱신. 목표치 이상이면 phase='success' + 토큰 지급. */
  setScore: (score: number) => void;
  /** Result 오버레이 탭 → 같은 missionRange로 재시작. */
  restart: () => void;
}

export type RunStore = RunState & RunActions;
