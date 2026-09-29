/** `minigames` 기능의 쿼리 키 팩토리(§11). */
export const minigameKeys = {
  list: ['minigames', 'list'] as const,
  detail: (gameId: number) => ['minigames', 'detail', gameId] as const,
};
