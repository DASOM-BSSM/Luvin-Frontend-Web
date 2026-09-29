import type { BreadType } from '@/src/assets/images/BreadCharacter';

export type TerrainType = 'grass' | 'road' | 'rail' | 'river';

export interface TerrainSegment {
  type: TerrainType;
  length: number;
}

/**
 * 레인 1개의 정적 정의. 생성 시점에 한 번 확정되고 이후 불변 — 장애물/뗏목의 위치는
 * 여기 담긴 값과 "경과 시간"만으로 결정론적으로 계산한다(런타임에 개별 오브젝트 상태를
 * 따로 들고 있지 않음).
 */
export interface LaneDefinition {
  laneIndex: number;
  type: TerrainType;
  /** road/rail/river 전용: 진행 방향. */
  direction: 1 | -1;
  /** road/river 전용: 컬럼/초 단위 이동 속도. */
  speedColumnsPerSec: number;
  /** 0~1. 레인마다 패턴 위상을 다르게 줘서 전부 같은 타이밍으로 움직이지 않게 한다. */
  phaseOffset: number;
  /** road/river 전용: 장애물(또는 뗏목) 하나가 차지하는 컬럼 폭. */
  obstacleColumnSpan: number;
  /** road/river 전용: 장애물 사이 빈 컬럼 수(단일 주기 표현 — road는 `obstacleOffsets`가 있으면 그쪽이 우선). */
  gapColumns: number;
  /** road/river 전용: 이 레인에서 쓰는 반죽 종류(단일 표현 — `doughTypes`가 없을 때 폴백). rail은 항상 고정 기차라 없음. */
  doughType?: BreadType;
  /**
   * road 전용: 한 주기 안에서 각 장애물이 시작하는 컬럼 오프셋(0부터, 오름차순). 존재하면
   * `obstacleColumnSpan`+`gapColumns` 단일 주기 대신 이 배열 + `cycleColumns`를 판정
   * (`laneOccupancy`)과 렌더링(`PeriodicRow`)이 공통으로 참조한다 — 장애물마다 간격이 살짝씩
   * 달라 "자동차처럼" 보이게 하기 위함(§constants.ts `ROAD_OBSTACLES_PER_CYCLE` 참고).
   * river/rail은 설정하지 않는다(기존 단일 주기 그대로).
   */
  obstacleOffsets?: number[];
  /** road 전용: `obstacleOffsets`가 정의된 주기 전체 길이(컬럼). */
  cycleColumns?: number;
  /** road 전용: `obstacleOffsets`와 같은 길이 — 오프셋별 반죽 종류(연속 같은 종류 없음). */
  doughTypes?: BreadType[];
}

export type StepDirection = 'forward' | 'back' | 'left' | 'right';

export interface PlayerGridPosition {
  lane: number;
  column: number;
}

export type StepOutcome = 'safe' | 'hit' | 'river-fail';

export interface StepResult {
  position: PlayerGridPosition;
  outcome: StepOutcome;
  highestLaneReached: number;
}

export interface WorldSnapshot {
  lanes: Record<number, LaneDefinition>;
  elapsedMsSinceRunStart: number;
  columnCount: number;
}
