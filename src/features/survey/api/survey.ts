import httpClient from '@/src/lib/http-client';
import type { ApiEnvelope } from '@/src/lib/api-envelope';

import type { SurveyDefinition, SurveyResult } from '@/src/features/survey/types';

/**
 * 설문 v2 API. 아직 백엔드에 구현되지 않은 제안 경로다(SHARED_API_CONTRACT.md) — 백엔드가
 * 실제로 배포하기 전까지 이 계층을 호출하는 화면을 프로덕션에 노출하지 않는다.
 */

/** `GET /api/surveys/v2/definition`. */
export async function getSurveyDefinition(): Promise<SurveyDefinition> {
  const { data } = await httpClient.get<ApiEnvelope<SurveyDefinition>>('/api/surveys/v2/definition');
  return data.data;
}

export interface SubmitSurveyInput {
  definitionId: string;
  surveyVersion: string;
  clientSubmissionId: string;
  answers: { questionId: string; answerId: string }[];
}

/** `POST /api/surveys/v2/submissions`. 최초 201/replay 200 둘 다 같은 결과 모양. */
export async function submitSurvey(input: SubmitSurveyInput): Promise<SurveyResult> {
  const { data } = await httpClient.post<ApiEnvelope<SurveyResult>>('/api/surveys/v2/submissions', input);
  return data.data;
}

/** `GET /api/surveys/v2/results/me`. 미완료는 에러가 아니라 data=null. */
export async function getMySurveyResult(): Promise<SurveyResult | null> {
  const { data } = await httpClient.get<ApiEnvelope<SurveyResult | null>>('/api/surveys/v2/results/me');
  return data.data;
}

/** `GET /api/surveys/v2/submissions/{clientSubmissionId}`. 응답 유실 후 복구용. */
export async function recoverSurveySubmission(clientSubmissionId: string): Promise<SurveyResult> {
  const { data } = await httpClient.get<ApiEnvelope<SurveyResult>>(
    `/api/surveys/v2/submissions/${clientSubmissionId}`,
  );
  return data.data;
}
