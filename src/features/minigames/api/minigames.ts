import httpClient from '@/src/lib/http-client';

import type {
  MinigameDetail,
  MinigameListItem,
  MinigameOutcome,
  MinigamePlayResult,
} from '@/src/features/minigames/types';

interface MinigameListResponseBody {
  games: MinigameListItem[];
}

/** `GET /api/minigames`. */
export async function getMinigames(): Promise<MinigameListItem[]> {
  const { data } = await httpClient.get<MinigameListResponseBody>('/api/minigames');
  return data.games;
}

/** `GET /api/minigames/{gameId}`. */
export async function getMinigameDetail(gameId: number): Promise<MinigameDetail> {
  const { data } = await httpClient.get<MinigameDetail>(`/api/minigames/${gameId}`);
  return data;
}

const OUTCOME_LABEL: Record<MinigameOutcome, string> = {
  success: '성공',
  fail: '실패',
};

/** `POST /api/minigames/{gameId}/play`. */
export async function playMinigame(gameId: number, outcome: MinigameOutcome): Promise<MinigamePlayResult> {
  const { data } = await httpClient.post<MinigamePlayResult>(`/api/minigames/${gameId}/play`, {
    success: OUTCOME_LABEL[outcome],
  });
  return data;
}
