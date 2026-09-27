import { useEffect, useState } from 'react';

import { submitEpisode1Selection } from '@/src/features/inferno/api/ai-season';
import { VOTE_MODAL_DELAY_MS } from '@/src/features/inferno/constants/animation';
import type { InfernoConversation } from '@/src/features/inferno/types';

/** 지금 떠 있는 모달. 없으면 undefined. */
export type InfernoEp1Modal = 'vote' | 'done';

/** 서버 에러를 그대로 보여주지 않는다(§11) — 원인과 무관하게 재시도를 유도하는 한 가지 문구만 쓴다. */
const SUBMIT_ERROR_MESSAGE = '투표 결과를 보내지 못했어요. 다시 시도해주세요.';

interface InfernoEp1Flow {
  /**
   * 회차 안에서 지금 어디까지 왔는지. 대화 쪽이 0..n-1, 투표지가 n 이다.
   * "잠시 나가기" 가 이 값을 기억해 두고, 다시 들어올 때 initialStep 으로 돌아온다.
   */
  step: number;
  pageIndex: number;
  /** 대화를 지나 투표지를 보고 있는지. */
  isBallotOpen: boolean;
  openModal?: InfernoEp1Modal;
  /** 아직 고르지 않았으면 undefined. */
  selectedId?: string;
  /** 투표 제출 요청이 오가는 중인지. 버튼을 잠그고 문구를 바꾸는 데 쓴다. */
  isSubmitting: boolean;
  /** 마지막 제출이 실패했을 때 보여줄 문구. 성공하거나 아직 안 눌렀으면 undefined. */
  submitError?: string;
  goPrevious?: () => void;
  goNext?: () => void;
  handlePageDone: () => void;
  handleModalClose: () => void;
  handleVoteStart: () => void;
  handleSelect: (participantId: string) => void;
  handleSubmit: () => void;
}

/**
 * ep1 의 진행 상태. 대화 쪽 넘기기 → 투표지 → 완료까지를 한곳에서 다룬다.
 *
 * 화면(src/app/inferno/ep1.tsx)에 두면 상태 다섯 개와 핸들러 일곱 개가 한 파일에 몰려
 * 150줄을 넘긴다(§16). 화면은 그리기만 하고 순서는 여기서 정한다.
 *
 * 진행을 `step` 숫자 하나로 들고 있고 쪽 번호와 투표지 여부는 거기서 끌어낸다. 상태를
 * 둘로 나눠 두면 "잠시 나가기" 가 기억한 자리와 실제 화면이 어긋날 수 있어서다.
 * 저장된 step 이 대화 쪽 수보다 크면(데이터가 바뀐 경우) 마지막 자리로 잘라낸다.
 *
 * 투표 모달은 마지막 줄이 다 쳐지면 저절로 뜬다. 상단 바의 `다음화면 >` 로도 띄울 수 있어서
 * 타자를 다 보지 않고 넘어가려는 사람도 막히지 않는다.
 */
export default function useInfernoEp1Flow(
  conversation: InfernoConversation | undefined,
  /** 이어볼 자리. 처음 들어오는 회차면 0. */
  initialStep = 0,
): InfernoEp1Flow {
  const [step, setStep] = useState(initialStep);
  const [openModal, setOpenModal] = useState<InfernoEp1Modal | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [isLastPageTyped, setIsLastPageTyped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  const pageCount = conversation?.pages.length ?? 0;
  const lastPageIndex = Math.max(pageCount - 1, 0);
  /** 투표지의 단계 번호. 대화 쪽 뒤에 한 칸 더 붙는다. */
  const ballotStep = pageCount;

  const safeStep = Math.min(step, ballotStep);
  const isBallotOpen = pageCount > 0 && safeStep >= ballotStep;
  const pageIndex = Math.min(safeStep, lastPageIndex);
  const isLastPage = pageIndex >= lastPageIndex;

  useEffect(() => {
    if (!isLastPageTyped) {
      return;
    }

    const timer = setTimeout(() => setOpenModal('vote'), VOTE_MODAL_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isLastPageTyped]);

  function handlePageDone() {
    if (isLastPage) {
      setIsLastPageTyped(true);
    }
  }

  function handleModalClose() {
    setOpenModal(undefined);
  }

  // 모달의 "투표하기". 모달을 닫고 투표지로 넘어간다.
  function handleVoteStart() {
    setOpenModal(undefined);
    setStep(ballotStep);
  }

  function handleSelect(participantId: string) {
    setSelectedId(participantId);
    setSubmitError(undefined);
  }

  /**
   * 투표지의 "투표하기".
   *
   * NOTE: 고르지 않고 누르면 아무 일도 하지 않는다. 시안에 비활성 버튼도 경고 문구도 없어서
   * 없는 디자인을 지어내지 않았다. 상태 디자인이 나오면 여기에 붙일 것(§11).
   *
   * 요청이 오가는 동안 버튼을 잠근다(중복 제출 방지) — 완료 모달은 서버가 실제로 받았다고
   * 확인해 준 뒤에만 연다. 실패하면 모달을 열지 않고 같은 자리에서 다시 누를 수 있게 둔다.
   * 아직 전역 토스트가 없어서(§11, `src/providers/toast-provider.tsx` 미구현) 우선 이
   * 화면 안에서만 문구로 보여준다.
   */
  async function handleSubmit() {
    if (!conversation || !selectedId || isSubmitting) {
      return;
    }

    setSubmitError(undefined);
    setIsSubmitting(true);

    try {
      await submitEpisode1Selection(selectedId);
      setOpenModal('done');
    } catch {
      setSubmitError(SUBMIT_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  }

  // 쪽을 옮기면 타자가 처음부터 다시 시작하므로 "마지막 줄까지 쳤다" 도 같이 되돌린다.
  function goToPreviousPage() {
    setIsLastPageTyped(false);
    setStep(safeStep - 1);
  }

  // 투표지에서 뒤로 가면 마지막 대화 쪽으로 돌아간다.
  function closeBallot() {
    setStep(lastPageIndex);
  }

  function goToNextPage() {
    setIsLastPageTyped(false);
    setStep(safeStep + 1);
  }

  // 마지막 쪽에서 다음을 누르면 타자가 끝나길 기다리지 않고 투표 모달을 띄운다.
  function openVoteModal() {
    setOpenModal('vote');
  }

  function resolveGoPrevious() {
    if (isBallotOpen) {
      return closeBallot;
    }

    return pageIndex > 0 ? goToPreviousPage : undefined;
  }

  function resolveGoNext() {
    // 투표지에서는 상단 바로 더 갈 곳이 없다. 흐름은 "투표하기" 로만 이어진다.
    if (isBallotOpen) {
      return undefined;
    }

    return isLastPage ? openVoteModal : goToNextPage;
  }

  return {
    step: safeStep,
    pageIndex,
    isBallotOpen,
    openModal,
    selectedId,
    isSubmitting,
    submitError,
    goPrevious: resolveGoPrevious(),
    goNext: resolveGoNext(),
    handlePageDone,
    handleModalClose,
    handleVoteStart,
    handleSelect,
    handleSubmit,
  };
}
