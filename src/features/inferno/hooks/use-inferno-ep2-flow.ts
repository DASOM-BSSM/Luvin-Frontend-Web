import { useEffect, useState } from 'react';

import { VOTE_MODAL_DELAY_MS } from '@/src/features/inferno/constants/animation';
import useInfernoFeedbackFlow from '@/src/features/inferno/hooks/use-inferno-feedback-flow';
import type { InfernoConversation } from '@/src/features/inferno/types';

/** 지금 떠 있는 모달. 없으면 undefined. */
export type InfernoEp2Modal = 'reveal' | 'done' | 'feedbackIntro' | 'feedbackDone';

/** 지금 보고 있는 단계. 매칭 결과 쪽지를 기점으로 갈리고, 피드백은 곁가지다. */
export type InfernoEp2Phase = 'group' | 'personal' | 'feedback';

/** 피드백 화면 안의 상태. 자세한 건 use-inferno-feedback-flow 참고. */
type InfernoFeedback = ReturnType<typeof useInfernoFeedbackFlow>;

interface InfernoEp2Flow {
  /**
   * 회차 안에서 지금 어디까지 왔는지. 전체대화 쪽들이 0..그룹쪽수-1, 1:1 대화 쪽이 그
   * 다음부터다. "잠시 나가기" 가 이 값을 기억해 두고, 다시 들어올 때 initialStep 으로
   * 돌아온다. 피드백은 곁가지라 따로 세지 않고, 그때 보던 1:1 대화 쪽으로 친다.
   */
  step: number;
  phase: InfernoEp2Phase;
  /** group 단계에서 지금 몇 쪽인지. 다른 단계에서는 의미 없다. */
  groupPageIndex: number;
  /** personal 단계에서 지금 몇 쪽인지. 다른 단계에서는 의미 없다. */
  personalPageIndex: number;
  openModal?: InfernoEp2Modal;
  goPrevious?: () => void;
  goNext?: () => void;
  handleLineDone: () => void;
  handleModalClose: () => void;
  handleRevealAction: () => void;
  /** 1:1 대화의 "나의 빵에게". 안내 쪽지를 띄운다. */
  handleFeedbackOpen: () => void;
  /** 안내 쪽지의 "피드백하기". 피드백 화면으로 들어간다. */
  handleFeedbackStart: () => void;
  /** 피드백을 보내고 완료 쪽지를 띄운다. */
  handleFeedbackSubmit: () => void;
  /** 완료 쪽지를 닫고 1:1 대화로 돌아간다. */
  handleFeedbackDone: () => void;
  feedback: InfernoFeedback;
}

/**
 * ep2 의 진행 상태. Figma `ep2-매칭전 전체대화`(5458:2968) → `ep2-매칭`(5467:5123) →
 * `ep2-대화`(5379:3570) → `ep2-대화 끝`(5467:5564) → `ep2-끝`(5467:5748),
 * 그리고 1:1 대화에서 갈라져 나가는 `나의 빵에게`(5467:6133, 5482:1883, 5467:6203, 5482:1923).
 *
 * ep1(use-inferno-ep1-flow)과 뼈대는 같다(줄 다 쳐짐 → 지연 뒤 모달, 마지막 쪽에서
 * "다음화면"은 모달을 곧장 연다). 다른 점은 쪽 묶음이 두 겹이라는 것 — 투표 없이 매칭
 * 결과만 보여주는 group 단계(ep1처럼 한 쪽에 말풍선 3개씩 여러 쪽)를 지나야 매칭 상대와의
 * personal 단계(쪽 여러 개)로 넘어간다. 두 겹을 `step` 숫자 하나로 눕혀 들고 있고(0..
 * 그룹쪽수-1 이 전체대화, 그 다음이 1:1 대화), phase 와 groupPageIndex/personalPageIndex 는
 * 거기서 끌어낸다 — "잠시 나가기" 가 기억한 자리와 화면이 어긋나지 않게 하려는 것이다.
 * 저장된 step 이 쪽 수보다 크면 마지막 자리로 잘라낸다.
 *
 * personal 단계로 넘어가면 되돌아가지 못한다(ep1 의 투표지가 되돌아갈 수 없는 것과 같은
 * 이유 — 매칭 결과를 이미 봤는데 되돌리는 건 말이 안 된다).
 *
 * feedback 단계는 본 줄기에서 잠깐 빠져나가는 곁가지다. 끝나면 personal 로 돌아오고,
 * 대화 진행도(step)는 건드리지 않는다. 그 안의 상태는 이 훅이 들고 있지 않고
 * use-inferno-feedback-flow 가 따로 맡는다.
 */
export default function useInfernoEp2Flow(
  conversation: InfernoConversation | undefined,
  /** 이어볼 자리. 처음 들어오는 회차면 0. */
  initialStep = 0,
): InfernoEp2Flow {
  const [step, setStep] = useState(initialStep);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isLastLineTyped, setIsLastLineTyped] = useState(false);
  const [openModal, setOpenModal] = useState<InfernoEp2Modal | undefined>(undefined);

  const feedback = useInfernoFeedbackFlow(conversation);

  const groupPageCount = conversation?.pages.length ?? 0;
  const personalPageCount = conversation?.personalChatPages?.length ?? 0;
  const lastGroupIndex = Math.max(groupPageCount - 1, 0);
  /** personal 단계의 첫 쪽이 시작되는 step 값. */
  const personalStartStep = groupPageCount;
  /** 마지막 단계 번호. 1:1 대화의 마지막 쪽이다. */
  const lastStep = personalStartStep + Math.max(personalPageCount - 1, 0);

  const safeStep = Math.min(step, lastStep);
  const isInGroupPhase = safeStep < personalStartStep;
  const groupPageIndex = isInGroupPhase ? Math.min(safeStep, lastGroupIndex) : lastGroupIndex;
  const personalPageIndex = isInGroupPhase ? 0 : Math.max(safeStep - personalStartStep, 0);
  const isLastGroupPage = groupPageIndex >= lastGroupIndex;
  const isLastPersonalPage = !isInGroupPhase && safeStep >= lastStep;

  const phase: InfernoEp2Phase = isFeedbackOpen ? 'feedback' : isInGroupPhase ? 'group' : 'personal';

  useEffect(() => {
    if (!isLastLineTyped) {
      return;
    }

    // group 단계는 마지막 쪽에서만, personal 단계도 진짜 마지막 쪽일 때만 다음 모달을 띄운다.
    const nextModal: InfernoEp2Modal | undefined =
      phase === 'group' && isLastGroupPage
        ? 'reveal'
        : phase === 'personal' && isLastPersonalPage
          ? 'done'
          : undefined;

    if (!nextModal) {
      return;
    }

    const timer = setTimeout(() => setOpenModal(nextModal), VOTE_MODAL_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isLastLineTyped, phase, isLastGroupPage, isLastPersonalPage]);

  function handleLineDone() {
    setIsLastLineTyped(true);
  }

  function handleModalClose() {
    setOpenModal(undefined);
  }

  // 매칭 결과 쪽지의 "도넛 반죽과 오븐 가기". 쪽지를 닫고 매칭 상대와의 1:1 대화로 넘어간다.
  function handleRevealAction() {
    setOpenModal(undefined);
    setStep(personalStartStep);
    setIsLastLineTyped(false);
  }

  function handleFeedbackOpen() {
    setOpenModal('feedbackIntro');
  }

  function handleFeedbackStart() {
    setOpenModal(undefined);
    setIsFeedbackOpen(true);
    feedback.reset();
  }

  function handleFeedbackSubmit() {
    feedback.submit();
    setOpenModal('feedbackDone');
  }

  function returnToPersonalChat() {
    setOpenModal(undefined);
    setIsFeedbackOpen(false);
  }

  // group/personal 둘 다 그냥 눕혀 놓은 step 하나를 앞뒤로 옮기는 것뿐이라 쪽 이동 함수는
  // 공용이다(ep1 의 goToPreviousPage/goToNextPage 와 같은 이유).
  function goToPreviousPage() {
    setIsLastLineTyped(false);
    setStep(safeStep - 1);
  }

  function goToNextPage() {
    setIsLastLineTyped(false);
    setStep(safeStep + 1);
  }

  function openModalNow(modal: InfernoEp2Modal) {
    return () => setOpenModal(modal);
  }

  function resolveGoPrevious() {
    // 모달이 떠 있으면 상단 바로 더 갈 곳이 없다.
    if (openModal) {
      return undefined;
    }

    // 피드백은 곁가지라 "이전화면" 이 대화로 돌아가는 길이 된다.
    if (phase === 'feedback') {
      return returnToPersonalChat;
    }

    // 1:1 대화 첫 쪽에서는 전체대화로 되돌아가지 못한다(매칭 결과를 이미 봤는데 되돌리는
    // 건 말이 안 된다 — ep1 투표지와 같은 이유).
    if (phase === 'personal') {
      return personalPageIndex > 0 ? goToPreviousPage : undefined;
    }

    // group 단계는 ep1 처럼 여러 쪽 — 첫 쪽이 아니면 이전 쪽으로.
    return groupPageIndex > 0 ? goToPreviousPage : undefined;
  }

  function resolveGoNext() {
    if (openModal) {
      return undefined;
    }

    if (phase === 'group') {
      // 대화를 다 보지 않아도 다음 쪽/매칭 결과로 곧장 넘어갈 수 있게 한다(ep1 과 같은 지름길).
      return isLastGroupPage ? openModalNow('reveal') : goToNextPage;
    }

    // 피드백 화면에서는 상단 바로 더 갈 곳이 없다. 흐름은 화면 안 버튼으로만 이어진다.
    if (phase === 'feedback') {
      return undefined;
    }

    return isLastPersonalPage ? openModalNow('done') : goToNextPage;
  }

  return {
    step: safeStep,
    phase,
    groupPageIndex,
    personalPageIndex,
    openModal,
    goPrevious: resolveGoPrevious(),
    goNext: resolveGoNext(),
    handleLineDone,
    handleModalClose,
    handleRevealAction,
    handleFeedbackOpen,
    handleFeedbackStart,
    handleFeedbackSubmit,
    handleFeedbackDone: returnToPersonalChat,
    feedback,
  };
}
