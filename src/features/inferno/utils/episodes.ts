import { INFERNO_EPISODES } from '@/src/features/inferno/constants/episodes';
import type { InfernoEpisode } from '@/src/features/inferno/types';

/**
 * 회차 번호로 에피소드를 찾는다. 없으면 undefined.
 *
 * 배열 순서에 기대지 않고 order 로 찾는 이유는, 나중에 순서가 바뀌거나 중간 회차가
 * 빠져도 엉뚱한 에피소드가 나오지 않게 하기 위해서다.
 */
export function findInfernoEpisode(order: number): InfernoEpisode | undefined {
  return INFERNO_EPISODES.find((episode) => episode.order === order);
}
