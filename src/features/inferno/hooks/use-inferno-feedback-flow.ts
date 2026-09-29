import { useState } from 'react';

import { submitInfernoFeedback } from '@/src/features/inferno/api/conversation';
import type { InfernoFeedbackStep } from '@/src/features/inferno/components/inferno-feedback-scene';
import type { InfernoConversation, InfernoFeedbackTopic } from '@/src/features/inferno/types';

interface InfernoFeedbackFlow {
  /** 대화를 고르는 중인지, 피드백을 쓰는 중인지. */
  step: InfernoFeedbackStep;
  /** 드롭다운에서 고른 줄. 아직 고르지 않았으면 undefined. */
  selectedTopicId?: string;
  /** "대화 찾기" 를 눌러 이유를 펼친 줄. */
  shownTopic?: InfernoFeedbackTopic;
  feedback: string;
  /** 피드백 화면에 들어갈 때 상태를 처음으로 되돌린다. */
  reset: () => void;
  handleTopicSelect: (messageId: string) => void;
  handleTopicFind: () => void;
  handleWriteStart: () => void;
  handleFeedbackChange: (value: string) => void;
  /** 보낸다. 완료 쪽지를 띄우는 건 부르는 쪽(ep2 흐름)이 한다. */
  submit: () => void;
}

/**
 * "나의 빵에게" 피드백 화면 안의 상태.
 * Figma `나의 빵에게` (5482:1883, 5467:6203, 5482:1923).
 *
 * ep2 흐름(use-inferno-ep2-flow)에서 갈라져 나온 곁가지라 상태도 따로 뒀다. 이쪽은 어느
 * 줄을 골랐고 무엇을 썼는지만 알고, 화면을 언제 열고 닫는지는 부르는 쪽이 정한다.
 */
export default function useInfernoFeedbackFlow(
  conversation: InfernoConversation | undefined,
): InfernoFeedbackFlow {
  const [step, setStep] = useState<InfernoFeedbackStep>('pick');
  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>(undefined);
  const [shownTopicId, setShownTopicId] = useState<string | undefined>(undefined);
  const [feedback, setFeedback] = useState('');

  const shownTopic = conversation?.feedbackTopics?.find(
    ({ messageId }) => messageId === shownTopicId,
  );

  function reset() {
    setStep('pick');
    setSelectedTopicId(undefined);
    setShownTopicId(undefined);
    setFeedback('');
  }

  function handleTopicSelect(messageId: string) {
    setSelectedTopicId(messageId);
    // 고른 줄이 바뀌면 펼쳐 둔 이유는 닫는다. 다른 줄의 이유가 남아 있으면 헷갈린다.
    setShownTopicId(undefined);
  }

  // "대화 찾기". 고른 줄의 이유를 오른쪽에 펼친다.
  function handleTopicFind() {
    setShownTopicId(selectedTopicId);
  }

  function handleWriteStart() {
    setStep('write');
  }

  function handleFeedbackChange(value: string) {
    setFeedback(value);
  }

  /**
   * "피드백 하기".
   *
   * NOTE: 빈 채로 눌러도 막지 않는다. 시안에 비활성 버튼도 경고 문구도 없어서 없는 디자인을
   * 지어내지 않았다(ep1 투표와 같은 판단). 상태 디자인이 나오면 여기에 붙일 것(§11).
   */
  function submit() {
    if (!conversation || !shownTopicId) {
      return;
    }

    submitInfernoFeedback(conversation.episodeOrder, shownTopicId, feedback);
  }

  return {
    step,
    selectedTopicId,
    shownTopic,
    feedback,
    reset,
    handleTopicSelect,
    handleTopicFind,
    handleWriteStart,
    handleFeedbackChange,
    submit,
  };
}
