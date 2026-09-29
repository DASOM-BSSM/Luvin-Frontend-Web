import { INFERNO_EPISODES } from '@/src/features/inferno/constants/episodes';
import type { InfernoEpisode } from '@/src/features/inferno/types';

/**
 * 아직 안 본 에피소드 중 가장 앞선 것. 전부 봤으면 undefined.
 *
 * 순서를 건너뛸 수 없으므로(ep0 의 "순서를 건너뛸 순 없어요") 회차순으로 훑어 첫 미시청을 찾는다.
 */
export function findNextInfernoEpisode(completedOrders: number[]): InfernoEpisode | undefined {
  return INFERNO_EPISODES.find((episode) => !completedOrders.includes(episode.order));
}
