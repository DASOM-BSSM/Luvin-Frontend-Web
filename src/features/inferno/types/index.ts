import type { BreadType } from '@/src/assets/images/BreadCharacter';

/** 러빈지옥 에피소드 한 편. */
export interface InfernoEpisode {
  /** 0 이면 "Episode 00" 으로 보여준다. 목록의 키 역할도 한다. */
  order: number;
  /** 시작 화면 하단 바에 들어가는 제목. 예: "러빈지옥에 대해 알려드릴게요" */
  title: string;
}

/** 말풍선이 화면 어느 쪽에 붙는지. */
export type InfernoChatSide = 'left' | 'right';

/**
 * 대화에 참여하는 반죽 하나.
 *
 * 대화 줄의 아바타도, 투표 선택지도 전부 여기서 나온다. 그래서 이름과 반죽 종류를
 * 메시지가 아니라 참가자가 들고 있다.
 */
export interface InfernoParticipant {
  /** 메시지가 가리키는 키. 서버 id 가 들어올 자리. */
  id: string;
  /** 반죽 종류. 값이 에셋 파일명과 1:1 이라 그대로 그림을 고를 수 있다. */
  type: BreadType;
  /** 투표 선택지에 보이는 이름. 예: "유쾌한 카스테라 반죽" */
  name: string;
  /** 내 분신인지. 말풍선 색이 갈리고, 투표 선택지에서는 빠진다. */
  isMine: boolean;
}

/**
 * 대화 한 줄.
 *
 * 서버가 내려줄 모양을 그대로 본뜬 순수 데이터다. 누가 말했는지는 participantId 로만
 * 가리키고, 그림·이름은 참가자 쪽에서 찾는다.
 */
export interface InfernoChatMessage {
  /** 줄을 구분하는 키. 서버 id 가 들어올 자리라 숫자가 아니라 문자열이다. */
  id: string;
  participantId: string;
  /**
   * 좌우 중 어느 쪽에 붙는지.
   *
   * 내 말인지에서 뽑지 않고 따로 두는 이유: 시안(5425:886)에서 내 분신이 아닌 프레첼도
   * 오른쪽에 붙어 있어 "내 말이면 오른쪽" 규칙이 성립하지 않는다. 규칙이 정해지기 전까지는
   * 데이터가 직접 들고 있는다. 규칙이 생기면 이 필드를 지우고 파생시키면 된다.
   */
  side: InfernoChatSide;
  text: string;
  /**
   * 이 줄 아래에 하트 배지를 붙일지. Figma `ep2-대화 끝` (5467:5765), `ep4-끝` (5467:5693)
   * 처럼 대화의 결정적인 한 줄에만 붙는 장식이라 메시지 단위로 둔다.
   */
  showHeart?: boolean;
}

/**
 * 대화 한 쪽(화면 하나에 담기는 분량).
 *
 * 시안이 대화를 두 화면으로 끊어 놨고(5425:886, 6137:2782) 화면마다 위아래에 붙는 문구가
 * 달라서, 줄을 한 배열에 몰지 않고 쪽으로 나눈다.
 */
export interface InfernoChatPage {
  id: string;
  /** 대화 위에 뜨는 질문. 첫 쪽에만 있다. */
  question?: string;
  /** 대화 아래 안내. 예: "- 대화가 종료되었습니다 투표를 진행해주세요 -" */
  notice?: string;
  /** 위에서부터 이 순서대로 한 줄씩 쳐진다. */
  messages: InfernoChatMessage[];
}

/** 대화가 끝난 뒤의 투표 문구. 회차마다 다른 내용이라 대화와 같이 내려온다. */
export interface InfernoVotePrompt {
  /** 대화 끝 모달에 뜨는 문구. */
  modalMessage: string;
  /** 투표지에 뜨는 문구. */
  ballotMessage: string;
}

/**
 * 투표 없이 곧장 정해지는 매칭 결과 쪽지. Figma `ep2-매칭` (5466:4529~5466:4546),
 * `ep4-매칭전 전체대화` (5467:5196).
 *
 * ep1 은 대화가 끝나면 투표로 이어지지만(InfernoVotePrompt), ep2·ep4 는 고를 것 없이
 * 결과만 통보받는다. 회차마다 대화 뒤에 오는 게 다르므로 둘 다 대화와 같이 내려오되 따로 둔다.
 */
export interface InfernoMatchReveal {
  /** 쪽지에 뜨는 매칭 문구. 예: "쫀쫀한 소금빵 반죽 → 차가운 도넛 반죽" */
  noticeMessage: string;
  /** 쪽지 버튼 문구. 예: "도넛 반죽과 오븐 가기" */
  actionLabel: string;
}

/**
 * "나의 빵에게" 피드백에서 고를 수 있는 대화 한 줄.
 * Figma `나의 빵에게` (5482:1883, 5467:6203).
 *
 * 내 분신이 한 말만 대상이다 — 화면이 묻는 게 "나의 AI가 이렇게 대답한 이유"라서다.
 */
export interface InfernoFeedbackTopic {
  /** 어떤 줄인지. 1:1 대화 메시지의 id 를 그대로 쓴다. */
  messageId: string;
  /** 드롭다운과 필드에 보이는 글자. 내 분신이 했던 말. */
  message: string;
  /**
   * 내 분신이 그렇게 답한 이유. 없으면 "대화 찾기" 를 눌러도 오른쪽이 비어 있는 채로 둔다.
   *
   * 시안에 문구가 있는 줄이 아직 하나뿐이라 나머지는 비워 뒀다. 지어내지 않는다(§13) —
   * API 가 붙으면 서버가 줄마다 채워 줄 자리다.
   */
  reason?: string;
}

/**
 * 1:1 대화 중 "다시 굽기"로 상대를 바꾸는 곁가지. Figma `다시굽기`
 * (5467:5418 확인 모달, 5467:5840 투표지, 5467:5876 새 상대와의 대화).
 *
 * 투표로 새 상대를 고른다는 점은 ep1 투표(InfernoVotePrompt)와 같지만, 후보가 전체대화
 * 참가자 중 이미 매칭된 상대를 뺀 나머지라는 점과 투표 뒤 곧장 1:1 대화로 이어진다는 점이
 * 다르다. 대화 상대는 사용자가 고른 값이라 메시지 데이터가 실제 participant id 를 미리
 * 알 수 없으므로, `chatMessages` 는 상대 쪽 줄에 `EP4_REBAKE_PARTNER_ID` 같은 자리표시자
 * participantId 를 쓰고 화면이 고른 상대로 바꿔 끼운다.
 */
export interface InfernoRebake {
  /** 확인 쪽지 문구. 예: "다시 굽기를 진행하시겠어요?" */
  confirmMessage: string;
  /** 확인 쪽지 버튼 문구. 예: "다시 굽기 상대 고르기" */
  confirmActionLabel: string;
  /** 투표지 문구. 예: "당신과 다시 구워지고 싶어요" */
  voteMessage: string;
  /** 고를 수 있는 반죽들의 participant id. 이미 매칭된 상대는 빠져 있다. */
  candidateIds: string[];
  /** 새 상대와의 대화. 상대 쪽 줄의 participantId 는 자리표시자다(위 설명 참고). */
  chatMessages: InfernoChatMessage[];
}

/**
 * 에피소드 한 편의 대화 전체.
 *
 * API 가 붙으면 이 타입이 응답 본문이 된다. 그래서 JSON 으로 그대로 직렬화되는 값만 담는다.
 *
 * 대화 뒤에 오는 게 회차마다 달라서(ep1 은 투표, ep2·ep4 는 매칭 결과) vote 와 matchReveal 을
 * 둘 다 옵셔널로 두고 회차 데이터가 자기한테 맞는 것만 채운다.
 */
export interface InfernoConversation {
  episodeOrder: number;
  participants: InfernoParticipant[];
  pages: InfernoChatPage[];
  vote?: InfernoVotePrompt;
  matchReveal?: InfernoMatchReveal;
  /**
   * 매칭 발표 뒤에 이어지는 1:1 대화. Figma `ep2-대화`(5379:3570), `ep2-대화 끝`(5467:5564),
   * `ep4-대화`(5449:1735), `ep4-끝`(5467:5675).
   *
   * 전체 대화(`pages`)와 생김새가 달라서(아바타가 줄마다 안 붙고 왼쪽에 고정, 말풍선도
   * 분홍) 같은 배열에 섞지 않고 따로 둔다. `InfernoPersonalChatScene` 이 그린다.
   */
  personalChatPages?: InfernoChatPage[];
  /**
   * "나의 빵에게" 에서 피드백할 수 있는 줄들. 1:1 대화가 있는 회차만 채운다.
   *
   * personalChatPages 에서 파생시키지 않고 따로 두는 이유: 줄마다 붙는 "이유" 는 대화
   * 데이터가 아니라 분신이 내놓는 설명이라, API 가 붙으면 다른 응답에서 올 값이다.
   */
  feedbackTopics?: InfernoFeedbackTopic[];
  /** "다시 굽기" 곁가지. 없으면 이 회차에는 다시 굽기가 없다는 뜻. */
  rebake?: InfernoRebake;
}

/**
 * ep5(시즌 마무리) 데이터.
 *
 * [DRAFT] Figma 디자인이 아직 없는 상태에서 먼저 짠 화면이라(AGENTS.md §8 예외 — 사용자
 * 요청으로 디자인보다 동작을 먼저 만든다) 타입도 잠정적이다. 디자인이 나오면 필드가
 * 바뀔 수 있다.
 *
 * ep1~4 는 전부 대화가 있어 `InfernoConversation`(pages/participants 필수)을 썼지만,
 * ep5 는 대화 없이 시즌 리포트만 보여주는 화면이라 그 타입에 억지로 끼워 맞추지 않고
 * 따로 둔다. API 가 붙으면 이 타입이 응답 모양이 된다(§11).
 */

/**
 * 최종 매칭 상대 프로필.
 *
 * `state` 가 없는 이유: 이 화면은 매칭 상대와 내 반죽을 personDough(팔다리 있는 반죽)로
 * 나란히 보여주는 "매칭 성사" 장면이라 `InfernoPersonalChatSidebar`와 같은 이유로 항상
 * personDough 로 고정한다 — 회차 대화 데이터의 dough/baked 상태와는 무관하다.
 *
 * 예전엔 "애착유형" 라벨(`attachmentLabel`)도 있었는데, `AiCharacterView`에 그런 성향
 * 필드가 없다는 게 최신 openapi로 확인돼서 걷어냈다(Figma에도 없던 값이라 손실 없음).
 */
export interface InfernoFinalMatchProfile {
  type: BreadType;
  name: string;
}

export interface InfernoFinalMatchResult {
  profile: InfernoFinalMatchProfile;
  /**
   * "이 시즌, 당신의 분신은 진짜 인연을 만났어요" 같은 한 줄 요약.
   *
   * 조사가 붙는 조합 규칙을 코드로 만들지 않고 문구를 데이터가 완성된 문장으로 그대로
   * 들고 있는다 — 잘못된 조사 조합을 지어내지 않기 위함(§13과 같은 취지).
   */
  summaryLine: string;
}

/**
 * `GET /api/ai/seasons/report`의 `narrative`. 예전엔 `/api/simulation/report`(강점/약점/
 * 조언 텍스트)를 썼는데, 백엔드 확인 완료 — AI 시즌 계정은 `simulation_reports`에 애초에
 * 행이 안 생겨서 그 엔드포인트가 영영 404다. `ai/seasons/report`의 `narrative`/`highlights`
 * 로 완전히 대체됐다(레거시 `/api/simulation/*`는 AI 시즌에서 호출하지 않는다).
 */
export interface InfernoSeasonReport {
  narrative: string;
}

/**
 * 지난 회차 하이라이트 한 장. `GET /api/ai/seasons/report`의 `highlights`에서 뽑는다.
 *
 * "제목+요약" 카드가 아니라 1:1 대화 중 인상 깊었던 한 줄을 그대로 인용한 것이다(실기기
 * 확인: 실제 키는 `text`/`message_id`다 — map-ai-season-report.ts의 `mapAiHighlights` 참고).
 */
export interface InfernoHighlight {
  text: string;
}

export interface InfernoSeasonSummary {
  episodeOrder: number;
  /**
   * 최종 매칭 상대 정보. `GET /api/ai/seasons/report`의 `finalPartnerId`에서 뽑는다
   * (map-ai-season-report.ts 의 `mapFinalMatchFromReport`) — "다시 굽기"로 상대가 바뀐
   * 경우까지 반영된 값이다(백엔드 확인 완료).
   */
  finalMatch: InfernoFinalMatchResult;
  report: InfernoSeasonReport;
  highlights: InfernoHighlight[];
}
