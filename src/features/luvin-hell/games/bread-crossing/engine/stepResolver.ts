import { isColumnOccupied, isRailSafeWindow } from '@/src/features/luvin-hell/games/bread-crossing/engine/laneOccupancy';
import type {
  PlayerGridPosition,
  StepDirection,
  StepOutcome,
  StepResult,
  WorldSnapshot,
} from '@/src/features/luvin-hell/games/bread-crossing/engine/types';

function applyDirection(
  current: PlayerGridPosition,
  direction: StepDirection,
  startLane: number,
  columnCount: number,
): PlayerGridPosition {
  switch (direction) {
    case 'forward':
      return { lane: current.lane + 1, column: current.column };
    case 'back':
      return { lane: Math.max(current.lane - 1, startLane), column: current.column };
    case 'left':
      return { lane: current.lane, column: Math.max(current.column - 1, 0) };
    case 'right':
      return { lane: current.lane, column: Math.min(current.column + 1, columnCount - 1) };
  }
}

/**
 * 스텝(입력 1회) 판정. 순수 함수 — "이동할 때마다" 딱 한 번만 호출된다(매프레임 아님).
 * outcome 은 'hit'(장애물)/'river-fail'(빈 강)로 구분해두지만, 호출부는 둘 다 동일한
 * 페널티(하트-1)를 적용한다(유저 스펙: 페널티 통일).
 */
export function resolveStep(
  current: PlayerGridPosition,
  direction: StepDirection,
  startLane: number,
  world: WorldSnapshot,
  highestLaneReached: number,
): StepResult {
  const next = applyDirection(current, direction, startLane, world.columnCount);
  const lane = world.lanes[next.lane];
  const elapsedSec = world.elapsedMsSinceRunStart / 1000;

  let outcome: StepOutcome = 'safe';
  if (lane) {
    if (lane.type === 'road' && isColumnOccupied(lane, next.column, elapsedSec)) {
      outcome = 'hit';
    } else if (lane.type === 'rail' && !isRailSafeWindow(lane, elapsedSec)) {
      outcome = 'hit';
    } else if (lane.type === 'river' && !isColumnOccupied(lane, next.column, elapsedSec)) {
      outcome = 'river-fail';
    }
  }

  return {
    position: next,
    outcome,
    highestLaneReached: Math.max(highestLaneReached, next.lane),
  };
}
