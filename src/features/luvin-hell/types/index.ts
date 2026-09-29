/** 러빈지옥 미니게임 2종의 식별자. 라우트 세그먼트(`src/app/luvin-hell/<id>/...`)와 1:1 대응한다. */
export type GameId = 'dino-runner' | 'bread-crossing';

/**
 * 런(1회 플레이) 진행 단계.
 * ready: 시작 대기 (화면 탭 대기) / playing: 진행 중 / success: 미션 달성 / fail: 하트 소진
 */
export type GamePhase = 'ready' | 'playing' | 'success' | 'fail';

/** 미션 목표치 랜덤 추출 범위. `[min, max]` 양끝 포함. */
export type MissionRange = [min: number, max: number];
