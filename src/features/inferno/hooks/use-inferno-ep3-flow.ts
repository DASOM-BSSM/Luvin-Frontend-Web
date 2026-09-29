import { useEffect, useState } from 'react';

import { submitEpisode3Result } from '@/src/features/inferno/api/ai-season';
import { GAME_MODAL_DELAY_MS } from '@/src/features/inferno/constants/animation';
import type { InfernoConversation } from '@/src/features/inferno/types';

/** 지금 떠 있는 모달. 없으면 undefined. */
export type InfernoEp3Modal = 'done';

/** 같은 결과·문구를 공유하는 두 미니게임 중 어느 쪽인지. 시안이 둘 다 "Episode 03"이다. */
export type InfernoEp3Game = 'shell' | 'cardflip';

interface InfernoEp3Flow {
  pageIndex: number;
  isGameOpen: boolean;
  isGamePromptOpen: boolean;
  /** 게임하기를 누를 때마다 둘 중 하나로 무작위로 정해진다. */
  selectedGame: InfernoEp3Game;
  /** 야바위/카드 뒤집기 성공 뒤 투표지를 보고 있는지. */
  isBallotOpen: boolean;
  openModal?: InfernoEp3Modal;
  /** 아직 고르지 않았으면 undefined. */
  selectedId?: string;
  goPrevious?: () => void;
  goNext?: () => void;
  handlePageDone: () => void;
  handlePromptClose: () => void;
  handleGameStart: () => void;
  handleGameSuccess: () => void;
  /** 미니게임 실패 쪽지의 "에피소드 끝내기". 화면이 finishEpisode 전에 부른다. */
  handleGameFailure: () => void;
  handleModalClose: () => void;
  handleSelect: (participantId: string) => void;
  handleSubmit: () => void;
}

/**
 * ep3 게임 전 대화 두 쪽 → 야바위 → (성공 시) 투표지 → 완료까지의 순서를 관리한다.
 *
 * 실패는 흐름에 남기지 않는다. 실패 쪽지의 "에피소드 끝내기"는 바로 화면 밖(메인)으로
 * 나가는 동작이라 화면(src/app/inferno/ep3.tsx)이 직접 처리한다.
 */
export default function useInfernoEp3Flow(
  conversation: InfernoConversation | undefined,
): InfernoEp3Flow {
  const [pageIndex, setPageIndex] = useState(0);
  const [isLastPageTyped, setIsLastPageTyped] = useState(false);
  const [isGamePromptOpen, setIsGamePromptOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<InfernoEp3Game>('shell');
  const [isBallotOpen, setIsBallotOpen] = useState(false);
  const [openModal, setOpenModal] = useState<InfernoEp3Modal | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const lastPageIndex = conversation ? conversation.pages.length - 1 : 0;
  const isLastPage = pageIndex >= lastPageIndex;

  useEffect(() => {
    if (!isLastPageTyped) return;

    const timer = setTimeout(() => setIsGamePromptOpen(true), GAME_MODAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isLastPageTyped]);

  function handlePageDone() {
    if (isLastPage) setIsLastPageTyped(true);
  }

  function handlePromptClose() {
    setIsGamePromptOpen(false);
  }

  // 두 미니게임이 승패 문구·다음 동작을 그대로 공유해서 매번 무작위로 하나를 고른다.
  function handleGameStart() {
    setIsGamePromptOpen(false);
    setSelectedGame(Math.random() < 0.5 ? 'shell' : 'cardflip');
    setIsGameOpen(true);
  }

  // 미니게임 성공 쪽지의 "투표하기". 게임 화면을 접고 투표지를 연다.
  function handleGameSuccess() {
    setIsGameOpen(false);
    setIsBallotOpen(true);
  }

  // 미니게임 실패 쪽지의 "에피소드 끝내기". 투표 없이 바로 나가지만, 실패도 서버에
  // 남겨야 랜덤 매칭(성공 쪽지 문구 "랜덤으로 상대가 정해져요")이 이뤄진다.
  function handleGameFailure() {
    submitEpisode3Result(false);
  }

  function handleSelect(participantId: string) {
    setSelectedId(participantId);
  }

  // 투표지의 "투표하기". ep1(use-inferno-ep1-flow)과 같은 규칙:
  // 고르지 않고 누르면 아무 일도 하지 않는다(§11, 없는 디자인을 지어내지 않는다).
  function handleSubmit() {
    if (!conversation || !selectedId) return;

    submitEpisode3Result(true, selectedId);
    setOpenModal('done');
  }

  function handleModalClose() {
    setOpenModal(undefined);
  }

  function showPreviousPage() {
    setIsLastPageTyped(false);
    setPageIndex((index) => index - 1);
  }

  function showNextPage() {
    setIsLastPageTyped(false);
    setPageIndex((index) => index + 1);
  }

  function showGamePrompt() {
    setIsGamePromptOpen(true);
  }

  function closeGame() {
    setIsGameOpen(false);
  }

  function resolveGoPrevious() {
    // 투표지에서는 ep1 과 같이 상단 바로 더 갈 곳이 없다("투표하기"로만 이어진다).
    if (isBallotOpen) return undefined;
    if (isGameOpen) return closeGame;
    return pageIndex > 0 ? showPreviousPage : undefined;
  }

  function resolveGoNext() {
    if (isBallotOpen || isGameOpen) return undefined;
    return isLastPage ? showGamePrompt : showNextPage;
  }

  return {
    pageIndex,
    isGameOpen,
    isGamePromptOpen,
    selectedGame,
    isBallotOpen,
    openModal,
    selectedId,
    goPrevious: resolveGoPrevious(),
    goNext: resolveGoNext(),
    handlePageDone,
    handlePromptClose,
    handleGameStart,
    handleGameSuccess,
    handleGameFailure,
    handleModalClose,
    handleSelect,
    handleSubmit,
  };
}
