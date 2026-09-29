import httpClient from '@/src/lib/http-client';

/** openapi `LikeMessageResponse`. */
export interface LikedMessage {
  episodeNumber: number;
  messageId: number;
  text: string;
}

/**
 * `POST /api/matches/{matchId}/conversations/{messageId}/like`. `match-controller` 소속이라
 * `matchId`/`messageId`가 둘 다 숫자(int64)다 — ai-season-controller 쪽 메시지의 문자열(UUID)
 * `messageId`와는 다른 값이다. 이 엔드포인트는 응답을 `ApiResponse`로 감싸지 않는다
 * (openapi 스키마가 `MessageResponse`를 직접 참조).
 */
export async function likeMessage(matchId: number, messageId: number): Promise<void> {
  await httpClient.post(`/api/matches/${matchId}/conversations/${messageId}/like`);
}

/** `GET /api/episodes/likes`. 지금까지 좋아요 누른 메시지 전체 목록. */
export async function getLikedMessages(): Promise<LikedMessage[]> {
  const { data } = await httpClient.get<LikedMessage[]>('/api/episodes/likes');
  return data;
}
