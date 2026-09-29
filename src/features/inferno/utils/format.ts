/**
 * 0, "러빈지옥에 대해 알려드릴게요" -> "Episode 00 :: 러빈지옥에 대해 알려드릴게요"
 *
 * 홈의 formatEpisodeLabel 은 "Episode 01." 로 끝나는 다른 형식이라 따로 둔다.
 */
export function formatIntroLabel(order: number, title: string): string {
  return `Episode ${String(order).padStart(2, '0')} :: ${title}`;
}
