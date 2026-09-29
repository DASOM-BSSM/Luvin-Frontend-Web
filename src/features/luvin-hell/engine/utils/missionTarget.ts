import type { MissionRange } from '@/src/features/luvin-hell/types';

/** [min, max] 양끝 포함 정수 균등분포. 런 시작마다 1회만 호출해서 그 값을 고정해 쓴다. */
export function rollMissionTarget(range: MissionRange, rng: () => number = Math.random): number {
  const [min, max] = range;
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function hasMetMissionTarget(score: number, missionTarget: number): boolean {
  return score >= missionTarget;
}
