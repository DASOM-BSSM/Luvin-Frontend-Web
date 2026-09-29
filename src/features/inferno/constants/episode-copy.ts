import type { InfernoVotePrompt } from '@/src/features/inferno/types';

/**
 * AI가 만들지 않는, 회차별 고정 UI 문구. 투표지/모달 문구는 대화 내용과 무관하게
 * 항상 같은 문장이라 예전 로컬 대본(conversation.ts)에 있던 값을 그대로 옮겼다.
 *
 * ep2/ep4의 매칭쪽지(matchReveal)는 "누구와 매칭됐는지" 이름이 문장에 들어가서
 * 여기 고정 문구로 못 둔다 — 그건 ep2/ep4 연동할 때 따로 다룬다.
 */
export const EPISODE_VOTE_PROMPTS: Partial<Record<number, InfernoVotePrompt>> = {
  1: { modalMessage: '더 알아가고 싶은 반죽을 골라주세요', ballotMessage: '당신과 단둘이 대화하고 싶어요' },
  3: { modalMessage: '게임에 성공해서 원하는 상대와 대화해요!', ballotMessage: '당신과 단둘이 대화하고 싶어요' },
};
