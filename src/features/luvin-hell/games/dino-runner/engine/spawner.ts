import {
  BASE_SPAWN_GAP_MS,
  BASE_SPEED,
  DIFFICULTY_RAMP_DURATION_MS,
  MAX_SPEED,
  MIN_SPAWN_GAP_MS,
  OBSTACLE_WIDTH,
  REACTION_WINDOW_MS,
  SPAWN_GAP_VARIANCE_MS,
  SPEED_RAMP_PX_PER_SEC2,
} from '@/src/features/luvin-hell/games/dino-runner/engine/constants';
import type {
  ObstacleKind,
  SpawnDecision,
  SpawnSchedulerState,
} from '@/src/features/luvin-hell/games/dino-runner/engine/types';

/**
 * 순수 함수 모음 — RN/Reanimated import 없음. 매프레임 워클릿에서 직접 호출되므로
 * 각 함수는 'worklet' 지시어를 갖는다(엔진 아키텍처 참고).
 */

export function computeCurrentSpeed(elapsedMs: number): number {
  'worklet';
  return Math.min(BASE_SPEED + (elapsedMs / 1000) * SPEED_RAMP_PX_PER_SEC2, MAX_SPEED);
}

function targetAverageGapMs(elapsedMs: number): number {
  'worklet';
  const t = Math.min(elapsedMs / DIFFICULTY_RAMP_DURATION_MS, 1);
  return BASE_SPAWN_GAP_MS + (MIN_SPAWN_GAP_MS - BASE_SPAWN_GAP_MS) * t;
}

export function createInitialSpawnState(): SpawnSchedulerState {
  return { elapsedMs: 0, msSinceLastSpawn: 0, nextGapMs: BASE_SPAWN_GAP_MS };
}

/**
 * 스폰 스케줄러 1스텝. 두 장애물이 반응 불가능한 타이밍으로 겹치지 않도록,
 * 다음 간격(nextGapMs)은 항상 "반응 가능 시간 + 현재 속도로 장애물 폭을 지나는 시간"
 * 이상으로 clamp 한다.
 */
export function stepSpawnScheduler(
  state: SpawnSchedulerState,
  dtMs: number,
  currentSpeedPxPerSec: number,
  allowAir: boolean,
  rng: () => number = Math.random,
): SpawnDecision {
  'worklet';
  const elapsedMs = state.elapsedMs + dtMs;
  const msSinceLastSpawn = state.msSinceLastSpawn + dtMs;

  if (msSinceLastSpawn < state.nextGapMs) {
    return {
      shouldSpawn: false,
      kind: null,
      nextState: { elapsedMs, msSinceLastSpawn, nextGapMs: state.nextGapMs },
    };
  }

  const minGapMs = REACTION_WINDOW_MS + (OBSTACLE_WIDTH / currentSpeedPxPerSec) * 1000;
  const avgGapMs = targetAverageGapMs(elapsedMs);
  const rolledGapMs = avgGapMs + (rng() * 2 - 1) * SPAWN_GAP_VARIANCE_MS;
  const nextGapMs = Math.max(rolledGapMs, minGapMs);

  // 기록 AIR_OBSTACLE_MIN_SCORE 미만에서는 공중 장애물을 후보에서 제외 — 지상 장애물만 스폰.
  const kind: ObstacleKind = allowAir && rng() < 0.5 ? 'air' : 'ground';

  return {
    shouldSpawn: true,
    kind,
    nextState: { elapsedMs, msSinceLastSpawn: 0, nextGapMs },
  };
}
