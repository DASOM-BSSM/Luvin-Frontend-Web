import type { InfernoSeasonSummary } from '@/src/features/inferno/types';

/**
 * ep5(시즌 마무리) 데이터 출입구. conversation.ts 와 같은 이유로 지금은 상수를 그대로
 * 돌려주지만, 서버가 생기면 이 파일만 바꾸면 된다(§11).
 *
 * [DRAFT] Figma 디자인이 아직 없는 상태에서 먼저 짠 값이다. 실제 데이터 연동이 필요한
 * 지점은 아래 TODO 로 표시해 뒀다.
 */

const EP5_SEASON_SUMMARY: InfernoSeasonSummary = {
  episodeOrder: 5,
  finalMatch: {
    profile: {
      type: 'donut',
      name: '차가운 도넛 반죽',
    },
    summaryLine: '이 시즌, 당신의 분신은 진짜 인연을 만났어요',
  },
  report: {
    narrative:
      '사용자는 적극적으로 호감을 표현하지만 갈등 상황에서는 회피하는 경향이 있습니다. 상대방과 감정을 솔직하게 공유하는 연습이 필요합니다.',
  },
  highlights: [
    { text: '상대방의 연락이 늦어지면서 사용자가 먼저 연락했습니다.' },
    { text: '사용자가 상대방의 선택과 반대되는 행동을 했습니다.' },
  ],
};

/** ep5 하나뿐이라 다른 order 는 없다는 뜻으로 undefined. conversation.ts 의 CONVERSATIONS 와 같은 모양. */
const SEASON_SUMMARIES: Record<number, InfernoSeasonSummary | undefined> = {
  5: EP5_SEASON_SUMMARY,
};

export function getInfernoSeasonSummary(order: number): InfernoSeasonSummary | undefined {
  return SEASON_SUMMARIES[order];
}
