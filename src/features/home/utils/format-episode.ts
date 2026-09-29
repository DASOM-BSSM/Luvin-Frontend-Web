/** 1 -> "Episode 01." */
export function formatEpisodeLabel(order: number): string {
  return `Episode ${String(order).padStart(2, '0')}.`;
}
