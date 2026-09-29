/** openapi `MinigameListItemResponse`. */
export interface MinigameListItem {
  gameId: number;
  title: string;
  rewardToken: number;
}

/** openapi `MinigameDetailResponse`. */
export interface MinigameDetail extends MinigameListItem {
  description: string;
  thumbnailUrl: string;
}

/** openapi `MinigamePlayResponse`. */
export interface MinigamePlayResult {
  gameId: number;
  reward: { token: number };
}

/** openapi `MinigamePlayRequest.success` — `"성공"` | `"실패"` 문자열이지 boolean 이 아니다. */
export type MinigameOutcome = 'success' | 'fail';
