import { RAIL_SAFE_DURATION_SEC, RAIL_WAVE_DURATION_SEC } from '@/src/features/luvin-hell/games/bread-crossing/engine/constants';
import type { LaneDefinition } from '@/src/features/luvin-hell/games/bread-crossing/engine/types';

/**
 * 판정(stepResolver)과 렌더링(LaneSlotView)이 "경과 시간"이라는 같은 입력으로부터 동일한
 * 장애물 위치를 계산하도록, 그 계산을 이 파일 하나에 모아둔다 — 둘이 따로 계산하면 로직과
 * 화면이 어긋날 수 있다.
 */

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/**
 * 레인의 주기 패턴을 (오프셋 배열, 주기 길이)로 통일해서 반환한다. road는 `laneFactory`가
 * 미리 여러 장애물을 지터를 줘서 채워둔 `obstacleOffsets`/`cycleColumns`를 그대로 쓰고,
 * 그 필드가 없는 레인(river/rail)은 기존처럼 오프셋 0 하나짜리 단일 주기로 취급한다 —
 * 이 함수 하나로 판정(`isColumnOccupied`)과 렌더링(`PeriodicRow`)이 항상 같은 패턴을 본다.
 */
export function getObstacleCycle(lane: LaneDefinition): { offsets: number[]; cycleColumns: number } {
  if (lane.obstacleOffsets && lane.obstacleOffsets.length > 0 && lane.cycleColumns) {
    return { offsets: lane.obstacleOffsets, cycleColumns: lane.cycleColumns };
  }
  return { offsets: [0], cycleColumns: lane.obstacleColumnSpan + lane.gapColumns };
}

/** 도로/강 공용: 주기 패턴 위에서 특정 컬럼이 지금 장애물/뗏목에 덮여 있는지. */
export function isColumnOccupied(lane: LaneDefinition, column: number, elapsedSec: number): boolean {
  if (lane.obstacleColumnSpan <= 0) return false;
  const { offsets, cycleColumns } = getObstacleCycle(lane);
  const travel = lane.direction * lane.speedColumnsPerSec * elapsedSec + lane.phaseOffset * cycleColumns;
  const local = mod(column - travel, cycleColumns);
  return offsets.some((start) => local >= start && local < start + lane.obstacleColumnSpan);
}

/** 기찻길 전용: 지금이 안전구간인지(= 아니면 wave, 전 칸 위험). */
export function isRailSafeWindow(lane: LaneDefinition, elapsedSec: number): boolean {
  const cycle = RAIL_SAFE_DURATION_SEC + RAIL_WAVE_DURATION_SEC;
  const t = mod(elapsedSec + lane.phaseOffset, cycle);
  return t < RAIL_SAFE_DURATION_SEC;
}
