import type { AiReportView, AiSeasonStatusView } from '@/src/features/inferno/api/ai-season-types';
import type { SimulationHighlightView, SimulationReportView } from '@/src/features/inferno/api/simulation-types';
import type { InfernoFinalMatchResult, InfernoHighlight, InfernoSeasonReport } from '@/src/features/inferno/types';
import { deriveCharacterPersona } from '@/src/features/inferno/utils/character-persona';

/** `GET /api/simulation/report` 응답을 화면이 쓰는 모양으로 바꾼다. 지금은 필드가 1:1이라 그대로 옮기기만 한다. */
export function mapSimulationReport(report: SimulationReportView): InfernoSeasonReport {
  return {
    summary: report.summary,
    strength: report.strength,
    weakness: report.weakness,
    advice: report.advice,
  };
}

/**
 * `GET /api/simulation/highlights` 응답을 화면이 쓰는 모양으로 바꾸고, 중요도(`importance`)
 * 높은 순으로 정렬한다 — 화면(inferno-highlight-scene.tsx)은 이 순서를 그대로 보여준다.
 */
export function mapSimulationHighlights(highlights: SimulationHighlightView[]): InfernoHighlight[] {
  return [...highlights]
    .sort((a, b) => b.importance - a.importance)
    .map((highlight) => ({
      episodeId: highlight.episodeId,
      title: highlight.title,
      summary: highlight.summary,
      importance: highlight.importance,
    }));
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
    profile: { type: persona.type, name: persona.name, attachmentLabel: character.personality },
    summaryLine: `이 시즌, 당신의 분신은 ${character.personality} 성향과 이어졌어요`,
  };
}
