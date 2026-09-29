/** openapi `TokenBalanceResponse` — `GET /api/tokens/me`. */
export interface TokenBalance {
  tokenBalance: number;
  /** 무료로 남은 시뮬레이션(에피소드 진행) 횟수. 아직 이 값을 쓰는 화면이 없다. */
  freeSimulationCount: number;
}
