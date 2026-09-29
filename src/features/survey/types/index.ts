/**
 * 설문 v2 도메인 타입. 문항/보기/채점/분류는 전부 서버가 확정한다 — 앱은 표시와
 * 제출만 한다(SHARED_API_CONTRACT.md §3, FRONTEND_CHANGES.md §7). 20/13/8 같은
 * 숫자를 앱이 다시 계산하지 않는다.
 */

export interface SurveyAnswerDefinition {
  answerId: string;
  order: number;
  text: string;
}

export interface SurveyQuestionDefinition {
  questionId: string;
  order: number;
  text: string;
  answers: SurveyAnswerDefinition[];
}

/** `GET /api/surveys/v2/definition` 응답. */
export interface SurveyDefinition {
  definitionId: string;
  surveyVersion: string;
  scoringVersion: string;
  classificationVersion: string;
  title: string;
  questionCount: number;
  questions: SurveyQuestionDefinition[];
}

/** questionId → 고른 answerId. 아직 안 답한 문항은 키 자체가 없다. */
export type SurveyAnswers = Record<string, string>;

/**
 * 서버 canonical 빵 유형 코드. FRONTEND_CHANGES.md §6 매핑표 그대로 —
 * `src/assets/images/BreadCharacter`의 `BreadType`과 이름이 다르다(예: `salt_bread` vs `salt`).
 */
export type BreadCanonicalType =
  | 'cream_bread'
  | 'red_bean_bread'
  | 'salt_bread'
  | 'pretzel'
  | 'donut'
  | 'baguette'
  | 'madeleine'
  | 'castella';

/** `POST .../submissions`, `GET .../results/me`, `GET .../submissions/{id}` 공통 결과 DTO. */
export interface SurveyResult {
  resultId: string;
  clientSubmissionId: string;
  definitionId: string;
  surveyVersion: string;
  scoringVersion: string;
  classificationVersion: string;
  primaryType: BreadCanonicalType;
  primaryLabel: string;
  secondaryType: BreadCanonicalType | null;
  mixed: boolean;
  poorFit: boolean;
  tie: boolean;
  displayName: string;
  summary: string;
  reasonTexts: string[];
  completedAt: string;
}
