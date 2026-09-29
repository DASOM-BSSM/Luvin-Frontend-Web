import type { SurveyAnswers, SurveyDefinition, SurveyQuestionDefinition } from '@/src/features/survey/types';

/** 정의의 모든 문항에 답이 있는지. 서버가 채점하므로 앱은 완결성만 본다(§6). */
export function isSurveyComplete(definition: SurveyDefinition, answers: SurveyAnswers): boolean {
  return definition.questions.every((question) => Boolean(answers[question.questionId]));
}

/** 답한 문항 수. 진행률 표시에 쓴다. */
export function countAnsweredQuestions(definition: SurveyDefinition, answers: SurveyAnswers): number {
  return definition.questions.filter((question) => Boolean(answers[question.questionId])).length;
}

/** 고른 answerId가 실제로 이 문항 소속인지. 제출 전 로컬에서 한 번 더 막는다. */
export function isAnswerBelongsToQuestion(question: SurveyQuestionDefinition, answerId: string): boolean {
  return question.answers.some((answer) => answer.answerId === answerId);
}
