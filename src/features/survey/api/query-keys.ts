/** `survey` 기능의 쿼리 키 팩토리(§11). */
export const surveyKeys = {
  definition: ['survey', 'definition'] as const,
  myResult: ['survey', 'my-result'] as const,
  submission: (clientSubmissionId: string) => ['survey', 'submission', clientSubmissionId] as const,
};
