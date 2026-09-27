/**
 * `ai-season-controller` DTO. openapi 스키마를 그대로 옮긴 것 — UI 가 쓰는
 * `InfernoConversation` 등과는 별개다. 화면에 보여줄 모양으로 바꾸는 건
 * `utils/map-ai-episode.ts` 가 한다.
 */

export interface AiTraitsRequest {
  affectionExpression: number;
  relationshipAnxiety: number;
  relationshipAvoidance: number;
  emotionalAttunement: number;
  relationshipInitiative: number;
  practicalPriority: number;
  reassuranceNeed: number;
  jealousyReactivity: number;
  relationshipEnergyDependence: number;
  emotionalSuppression: number;
  conflictConfrontation: number;
  relationshipPace: number;
  interestExpressionFrequency: number;
}

export interface AiCharacterProfileRequest {
  gender: string;
  traits: AiTraitsRequest;
}

export interface AiCharacterView {
  characterId: string;
  /**
   * "나"(내 분신)인지 상대 후보인지 구분하는 값. 실제 응답으로 확인 완료 —
   * 대표(나)는 `'REPRESENTATIVE'`, 후보는 `'CANDIDATE'`(둘 다 대문자, § map-ai-episode.ts 참고).
   */
  role: string;
  gender: string;
}

export interface AiSeasonStatusView {
  seasonId: string;
  revision: number;
  currentEpisode: number;
  status: string;
  characters: AiCharacterView[];
}

export interface AiMessageView {
  messageId: string;
  sequence: number;
  sceneKind: string;
  speakerId: string;
  fromRepresentative: boolean;
  text: string;
}

export interface AiTopicView {
  id: string;
  title: string;
  category: string;
}

export interface AiEpisodeMessagesView {
  episodeNumber: number;
  versionId: string;
  topic: AiTopicView;
  messages: AiMessageView[];
  hasMore: boolean;
  nextAfterSequence?: number;
}

export interface AiEpisodeProgressView {
  episodeNumber: number;
  jobId: string;
  jobStatus: string;
  versionId?: string;
  errorCode?: string;
}

export interface AiRerollView {
  jobId: string;
  jobStatus: string;
}

export interface AiSelectionView {
  selectionId: string;
  partnerId: string;
  revision: number;
}

/** `GET /api/ai/seasons/report`의 `highlights` 배열 원소 하나. */
export interface AiHighlightView {
  messageId: string;
  text: string;
}

/** `GET /api/ai/seasons/report`. */
export interface AiReportView {
  finalPartnerId: string;
  highlights: AiHighlightView[];
  narrative: string;
  renderMode: string;
}
