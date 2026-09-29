import type { BreadType } from '@/src/assets/images/BreadCharacter';
import { pickNextDoughType } from '@/src/features/luvin-hell/engine/utils/randomDough';
import {
  RAIL_SAFE_DURATION_SEC,
  RIVER_GAP_COLUMNS,
  RIVER_RAFT_SPAN,
  RIVER_RAFT_SPEED_COLUMNS_PER_SEC,
  ROAD_GAP_COLUMNS,
  ROAD_GAP_JITTER_COLUMNS,
  ROAD_OBSTACLE_SPAN,
  ROAD_OBSTACLES_PER_CYCLE,
  ROAD_SPEED_COLUMNS_PER_SEC,
} from '@/src/features/luvin-hell/games/bread-crossing/engine/constants';
import type {
  LaneDefinition,
  TerrainSegment,
  TerrainType,
} from '@/src/features/luvin-hell/games/bread-crossing/engine/types';

/**
 * 도로 레인 하나의 "주기"를 만든다 — 장애물 여러 개를 한 주기에 넣고 사이 간격에 지터를
 * 줘서, 전부 똑같은 간격으로 대열을 맞춘 것처럼 보이지 않게 한다(사용자 지적: "기차처럼
 * 이동"). 간격의 최솟값은 항상 `ROAD_GAP_COLUMNS` 그대로 유지하고 그 위에만 지터를
 * 더하므로, 기존보다 난이도(최소 반응 여유)가 줄어드는 일은 없다 — 판정(`laneOccupancy`)과
 * 렌더링(`PeriodicRow`)이 이 결과(offsets/cycleColumns)를 그대로 공유해서 항상 일치한다.
 */
function buildRoadCycle(rng: () => number): { offsets: number[]; cycleColumns: number } {
  const offsets: number[] = [];
  let cursor = 0;
  for (let i = 0; i < ROAD_OBSTACLES_PER_CYCLE; i++) {
    offsets.push(cursor);
    const gap = ROAD_GAP_COLUMNS + Math.floor(rng() * (ROAD_GAP_JITTER_COLUMNS + 1));
    cursor += ROAD_OBSTACLE_SPAN + gap;
  }
  return { offsets, cycleColumns: cursor };
}

/**
 * 레인 1개 정의를 만든다. 도로/기찻길은 레인별로 좌/우 방향을 랜덤 고정한다(유저 스펙).
 * `previousDoughType`은 도로/강 레인에서 바로 이전 레인과 같은 반죽이 연달아 나오지 않게
 * 하는 용도 — 기찻길(rail)은 항상 고정된 바게트 기차라 반죽 다양화 대상이 아니다.
 */
export function buildLane(
  type: TerrainType,
  laneIndex: number,
  rng: () => number = Math.random,
  previousDoughType: BreadType | null = null,
): LaneDefinition {
  const direction: 1 | -1 = rng() < 0.5 ? 1 : -1;
  const phaseOffset = rng();

  switch (type) {
    case 'grass':
      return { laneIndex, type, direction: 1, speedColumnsPerSec: 0, phaseOffset: 0, obstacleColumnSpan: 0, gapColumns: 0 };
    case 'road': {
      const { offsets, cycleColumns } = buildRoadCycle(rng);
      const doughTypes: BreadType[] = [];
      let previous = previousDoughType;
      for (let i = 0; i < offsets.length; i++) {
        const next = pickNextDoughType(previous, rng);
        doughTypes.push(next);
        previous = next;
      }
      return {
        laneIndex,
        type,
        direction,
        speedColumnsPerSec: ROAD_SPEED_COLUMNS_PER_SEC,
        phaseOffset,
        obstacleColumnSpan: ROAD_OBSTACLE_SPAN,
        gapColumns: ROAD_GAP_COLUMNS,
        doughType: doughTypes[0],
        obstacleOffsets: offsets,
        cycleColumns,
        doughTypes,
      };
    }
    case 'rail':
      // 기찻길은 "안전구간/wave" 시간 모델(stepResolver)을 쓰므로 공간적 장애물 정의가 필요 없다.
      // phaseOffset만 레인마다 달라져서 안전구간 타이밍이 레인마다 어긋나게 한다.
      return {
        laneIndex,
        type,
        direction,
        speedColumnsPerSec: 0,
        phaseOffset: phaseOffset * RAIL_SAFE_DURATION_SEC,
        obstacleColumnSpan: 0,
        gapColumns: 0,
      };
    case 'river':
      return {
        laneIndex,
        type,
        direction,
        speedColumnsPerSec: RIVER_RAFT_SPEED_COLUMNS_PER_SEC,
        phaseOffset,
        obstacleColumnSpan: RIVER_RAFT_SPAN,
        gapColumns: RIVER_GAP_COLUMNS,
        doughType: pickNextDoughType(previousDoughType, rng),
      };
  }
}

/**
 * 세그먼트(같은 타입 레인 묶음) 하나를 레인 정의 배열로 펼친다. 같은 세그먼트 안에서
 * 도로/강 레인이 여러 개면 바로 앞 레인과 다른 반죽이 되도록 순서대로 이어서 뽑는다.
 */
export function buildLanesForSegment(
  segment: TerrainSegment,
  startLaneIndex: number,
  rng: () => number = Math.random,
): LaneDefinition[] {
  const lanes: LaneDefinition[] = [];
  let previousDoughType: BreadType | null = null;
  for (let i = 0; i < segment.length; i++) {
    const lane = buildLane(segment.type, startLaneIndex + i, rng, previousDoughType);
    lanes.push(lane);
    if (lane.doughType) previousDoughType = lane.doughType;
  }
  return lanes;
}
