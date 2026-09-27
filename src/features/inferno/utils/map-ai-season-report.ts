import type { AiHighlightView, AiReportView, AiSeasonStatusView } from '@/src/features/inferno/api/ai-season-types';
import type { InfernoFinalMatchResult, InfernoHighlight, InfernoSeasonReport } from '@/src/features/inferno/types';
import { deriveCharacterPersona } from '@/src/features/inferno/utils/character-persona';

/** `GET /api/ai/seasons/report`의 `narrative`를 화면이 쓰는 모양으로 바꾼다(§ types.ts 주석 참고). */
export function mapAiReport(report: AiReportView): InfernoSeasonReport {
  return { narrative: report.narrative };
}

/**
 * `GET /api/ai/seasons/report`의 `highlights`를 화면이 쓰는 모양으로 바꾼다.
 *
 * 백엔드 확인 완료 — `title`/`summary` 같은 카드형이 아니라 `AiHighlightView`(1:1 대화 중
 * 인상 깊었던 한 줄 `text`와 그 메시지를 가리키는 `messageId`)다. "제목+요약" 카드가 아니라
 * 대화에서 뽑은 인용구 한 줄이라는 뜻이라, 억지로 title/summary로 쪼개지 않고 `text` 그대로
 * 인용구 하나로 보여준다.
 */
export function mapAiHighlights(highlights: AiHighlightView[]): InfernoHighlight[] {
  return highlights.map((highlight) => ({ text: highlight.text }));
}

/**
 * ep5 "최종 매칭"을 `GET /api/ai/seasons/report`의 `finalPartnerId`에서 뽑는다. 백엔드
 * 확인 완료 — 이 값은 "다시 굽기"로 상대가 바뀐 경우까지 반영된 진짜 최종 상대라, ep4
 * 대화에서 상대를 직접 추론하던 예전 우회 로직(`mapFinalMatchFromEp4`)을 대체한다.
 */
export function mapFinalMatchFromReport(
  report: AiReportView,
  season: AiSeasonStatusView,
): InfernoFinalMatchResult | undefined {
  const character = season.characters.find((candidate) => candidate.characterId === report.finalPartnerId);
  if (!character) {
    return undefined;
  }

  const persona = deriveCharacterPersona(character.characterId);

  return {
    profile: { type: persona.type, name: persona.name },
    summaryLine: '이 시즌, 당신의 분신은 진짜 인연을 만났어요',
  };
}
