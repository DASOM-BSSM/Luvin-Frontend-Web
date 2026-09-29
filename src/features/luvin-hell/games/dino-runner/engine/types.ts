export type ObstacleKind = 'ground' | 'air';

export interface SpawnSchedulerState {
  elapsedMs: number;
  msSinceLastSpawn: number;
  nextGapMs: number;
}

export interface SpawnDecision {
  shouldSpawn: boolean;
  kind: ObstacleKind | null;
  nextState: SpawnSchedulerState;
}
