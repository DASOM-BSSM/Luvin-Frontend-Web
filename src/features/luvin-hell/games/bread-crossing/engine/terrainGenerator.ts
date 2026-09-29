import {
  ALLOW_CONSECUTIVE_GRASS,
  GRASS_LENGTH_RANGE,
  RAIL_LENGTH_RANGE,
  RIVER_LENGTH_RANGE,
  ROAD_LENGTH_RANGE,
} from '@/src/features/luvin-hell/games/bread-crossing/engine/constants';
import type { TerrainSegment, TerrainType } from '@/src/features/luvin-hell/games/bread-crossing/engine/types';

const ALL_TYPES: TerrainType[] = ['grass', 'road', 'rail', 'river'];

function lengthRangeFor(type: TerrainType): [number, number] {
  switch (type) {
    case 'grass':
      return GRASS_LENGTH_RANGE;
    case 'road':
      return ROAD_LENGTH_RANGE;
    case 'rail':
      return RAIL_LENGTH_RANGE;
    case 'river':
      return RIVER_LENGTH_RANGE;
  }
}

function randomLength([min, max]: [number, number], rng: () => number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function isDangerous(type: TerrainType): boolean {
  return type !== 'grass';
}

/**
 * 다음 지형 세그먼트를 생성한다. 순수 함수 — 호출부(엔진 훅)가 history를 들고 있다가
 * 매 호출 결과의 타입을 이어붙여서 다음 호출에 넘긴다.
 *
 * 규칙:
 * - 동일 타입 연속 금지(ALLOW_CONSECUTIVE_GRASS=false면 초원도 포함)
 * - 위험지형(도로/기찻길/강) 2연속 시 강제로 초원 삽입
 * - 길이는 타입별 범위 내 랜덤
 */
export function generateNextSegment(history: TerrainType[], rng: () => number = Math.random): TerrainSegment {
  const lastTwo = history.slice(-2);
  const forceGrass = lastTwo.length === 2 && lastTwo.every(isDangerous);

  if (forceGrass) {
    return { type: 'grass', length: randomLength(GRASS_LENGTH_RANGE, rng) };
  }

  const previous = history[history.length - 1];
  const candidates = ALL_TYPES.filter((type) => {
    if (type !== previous) return true;
    return type === 'grass' && ALLOW_CONSECUTIVE_GRASS;
  });

  const type = candidates[Math.floor(rng() * candidates.length)];
  return { type, length: randomLength(lengthRangeFor(type), rng) };
}
