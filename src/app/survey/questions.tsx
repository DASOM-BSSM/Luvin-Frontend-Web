import * as Crypto from 'expo-crypto';
import { Redirect, router } from 'expo-router';
import { View } from 'react-native';

import BottomNav from '@/src/components/bottom-nav';
import Text from '@/src/components/ui/text';
import type { SubmitSurveyInput } from '@/src/features/survey/api/survey';
import SurveyOptionCard from '@/src/features/survey/components/survey-option-card';
import SurveyProgressHeader from '@/src/features/survey/components/survey-progress-header';
import useSubmitSurvey from '@/src/features/survey/hooks/use-submit-survey';
import { useSurveyStore } from '@/src/features/survey/store/survey-store';
import type { SurveyAnswers, SurveyDefinition } from '@/src/features/survey/types';
import { formatQuestionNumber } from '@/src/features/survey/utils/format';

/**
 * 최초 제출 시 한 번만 발급하고, 재시도에도 같은 값을 재사용한다(SHARED_API_CONTRACT.md §4).
 *
 * 전역 `crypto`는 브라우저/Node엔 있지만 React Native(Hermes)엔 없어서, 대신
 * `expo-crypto`의 `randomUUID`를 쓴다 — 네이티브 리빌드(`pnpm ios`/`pnpm android`)가
 * 필요한 패키지다.
 */
function generateClientSubmissionId(): string {
  return Crypto.randomUUID();
}

function buildSubmissionPayload(
  definition: SurveyDefinition,
  answers: SurveyAnswers,
  clientSubmissionId: string,
): SubmitSurveyInput {
  return {
    definitionId: definition.definitionId,
    surveyVersion: definition.surveyVersion,
    clientSubmissionId,
    answers: definition.questions.map((question) => ({
      questionId: question.questionId,
      answerId: answers[question.questionId],
    })),
  };
}

/**
 * 설문 문항 화면. Figma "Luvin-Design" / `설문-우린` (5726:2582).
 *
 * 문항은 서버 정의(snapshot) 배열 순서로 보여주되, 저장·제출은 항상 questionId/answerId로
 * 한다 — 배열 인덱스로 채점하지 않는다(SHARED_API_CONTRACT.md §9). 보기를 누르면 바로
 * 다음 문항으로 넘어간다 — Figma 에 확인 버튼이 없다.
 *
 * 세로 배치는 Figma 프레임(402 x 874) 기준이다.
 * 상단 70 과 하단 44 는 고정, 남는 공간은 문항 아래와 보기 아래로 Figma 비율(240 : 49)로 나눈다.
 */
export default function SurveyQuestionsScreen() {
  const definition = useSurveyStore((state) => state.definition);
  const currentIndex = useSurveyStore((state) => state.currentIndex);
  const answers = useSurveyStore((state) => state.answers);
  const clientSubmissionId = useSurveyStore((state) => state.clientSubmissionId);
  const frozenPayload = useSurveyStore((state) => state.frozenPayload);
  const answerQuestion = useSurveyStore((state) => state.answerQuestion);
  const goToNextQuestion = useSurveyStore((state) => state.goToNextQuestion);
  const goToPreviousQuestion = useSurveyStore((state) => state.goToPreviousQuestion);
  const freezeSubmission = useSurveyStore((state) => state.freezeSubmission);

  const submitMutation = useSubmitSurvey();

  const question = definition?.questions[currentIndex];
  const isLastQuestion = definition ? currentIndex === definition.questions.length - 1 : false;

  function handleBackPress() {
    // 첫 문항에서의 뒤로가기는 문항 이동이 아니라 설문을 빠져나가는 것이다.
    if (currentIndex > 0) {
      goToPreviousQuestion();
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/survey');
  }

  function handleSubmissionSuccess() {
    router.replace('/bread');
  }

  function submitLastAnswer(nextAnswers: SurveyAnswers) {
    if (!definition) {
      return;
    }

    // 이미 한 번 얼린 제출이 있으면(직전 시도 실패 등) 새로 만들지 않고 그 payload를
    // 그대로 재시도한다 — 같은 clientSubmissionId로 같은 내용을 보내야 서버가 재시도로
    // 인식한다(SHARED_API_CONTRACT.md §4).
    const payload =
      frozenPayload ?? buildSubmissionPayload(definition, nextAnswers, clientSubmissionId ?? generateClientSubmissionId());

    freezeSubmission(payload);
    submitMutation.mutate(payload, { onSuccess: handleSubmissionSuccess });
  }

  function handleOptionSelect(answerId: string) {
    if (!question || submitMutation.isPending) {
      return;
    }

    // stale closure의 answers가 아니라 이 선택을 반영한 값으로 바로 이어서 쓴다.
    const nextAnswers = { ...answers, [question.questionId]: answerId };
    answerQuestion(question.questionId, answerId);

    if (!isLastQuestion) {
      goToNextQuestion();
      return;
    }

    submitLastAnswer(nextAnswers);
  }

  // 스토어에 정의가 없으면(설문 시작을 거치지 않고 바로 들어온 경우) 시작 화면으로.
  if (!definition || !question) {
    return <Redirect href="/survey" />;
  }

  return (
    <View className="flex-1 bg-default-bg">
      <View className="h-[70px]" />

      <View className="w-full items-center px-[30px]">
        <View className="w-full gap-[20px]">
          <SurveyProgressHeader
            current={currentIndex + 1}
            total={definition.questionCount}
            onBackPress={handleBackPress}
          />

          <View className="w-full gap-[8px] px-[4px]">
            <Text variant="body-s" className="text-default-black">
              반죽 만들기 {formatQuestionNumber(currentIndex + 1)}.
            </Text>
            <Text variant="heading-h2" className="text-default-black">
              {question.text}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-[240]" />

      <View className="w-full items-center px-[30px]">
        <View className="w-full gap-[20px]">
          {question.answers.map((answer) => (
            <SurveyOptionCard
              key={answer.answerId}
              answerId={answer.answerId}
              number={answer.order}
              label={answer.text}
              selected={answers[question.questionId] === answer.answerId}
              disabled={submitMutation.isPending}
              onSelect={handleOptionSelect}
            />
          ))}
        </View>
      </View>

      <View className="flex-[49]" />

      {submitMutation.isError ? (
        <View className="w-full items-center px-[30px]">
          <Text variant="body-s" className="text-center text-state-error">
            제출하지 못했어요. 마지막 보기를 다시 눌러주세요
          </Text>
        </View>
      ) : null}

      <View className="w-full items-center">
        <BottomNav active="bread" />
      </View>

      <View className="h-[44px]" />
    </View>
  );
}
