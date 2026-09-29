import { useEffect, useState } from 'react';

import { VOTE_MODAL_DELAY_MS } from '@/src/features/inferno/constants/animation';

/** 지금 떠 있는 모달. 없으면 undefined. */
export type InfernoEp4Modal = 'reveal' | 'rebakeConfirm' | 'done';

/** 지금 보고 있는 단계. */
export type InfernoEp4Phase = 'group' | 'personal' | 'rebakeVote' | 'rebakeChat';

interface InfernoEp4Flow {
  phase: InfernoEp4Phase;
  openModal?: InfernoEp4Modal;
  /** 다시 굽기 투표지에서 고른 상대. 아직 안 골랐으면 undefined. */
  rebakeSelectedId?: string;
  goPrevious?: () => void;
  goNext?: () => void;
  handleLineDone: () => void;
  handleModalClose: () => void;
  /** 매칭 결과 쪽지의 "도넛 반죽과 오븐 가기". 쪽지를 닫고 1:1 대화로 넘어간다. */
  handleRevealAction: () => void;
  /** 1:1 대화의 "다시 굽기" 폴더. 확인 쪽지를 띄운다. */
  handleRebakeOpen: () => void;
  /** 확인 쪽지의 "다시 굽기 상대 고르기". 쪽지를 닫고 투표지로 넘어간다. */
  handleRebakeStart: () => void;
  handleRebakeSelect: (participantId: string) => void;
  /** 투표지의 "투표하기". 고른 상대와의 새 1:1 대화로 넘어간다. */
  handleRebakeSubmit: () => void;
}

/**
 * ep4 의 진행 상태. Figma `ep4-매칭전 전체대화`(5467:4661) → `ep4-매칭`(5467:5196) →
 * `ep4-대화`(5449:1735) → `ep4-끝`(5467:5675), 그리고 1:1 대화에서 갈라져 나가는
 * `다시굽기`(5467:5418 확인 → 5467:5840 투표지 → 5467:5876 새 대화).
 *
 * ep2(use-inferno-ep2-flow, feat/LUV-27 미머지)와 뼈대는 같지만, "나의 빵에게" 피드백으로
 * 빠지는 시안이 아직 없어서 그건 걷어냈다. group → reveal 모달 → personal 로 가는 줄기는
 * ep1과 같고(마지막 줄이 다 쳐지면 저절로 다음 모달이 뜨고, 상단 바 `다음화면 >` 로도
 * 띄울 수 있다), personal 단계에서는 "다시 굽기" 폴더로 rebakeVote → rebakeChat 곁가지로
 * 빠질 수 있다. rebakeChat 도 personal 과 똑같이 마지막 줄에서 done 쪽지가 뜬다.
 *
 * 되돌아가지 못하는 경계가 두 곳이다: reveal 쪽지를 닫으면 group 으로 못 돌아가고(매칭
 * 결과를 이미 봤는데 되돌리는 건 말이 안 된다, ep1 투표지와 같은 이유), rebakeVote 에서
 * 투표하면 rebakeChat 으로만 가고 personal 로 못 돌아간다(다시 굽기는 한 회차에 한 번만
 * 쓸 수 있다 — InfernoPersonalChatSidebar 주석 참고). rebakeVote 자체는 ep1 투표지처럼
 * "이전화면" 으로 personal 로 되돌아갈 수 있다(아직 투표를 안 한 상태니까).
 */
export default function useInfernoEp4Flow(): InfernoEp4Flow {
  const [phase, setPhase] = useState<InfernoEp4Phase>('group');
  const [isLastLineTyped, setIsLastLineTyped] = useState(false);
  const [openModal, setOpenModal] = useState<InfernoEp4Modal | undefined>(undefined);
  const [rebakeSelectedId, setRebakeSelectedId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // rebakeVote 는 줄이 쳐지는 화면이 아니다. personal 단계에서 다 쳐진 뒤(대기 중인
    // 타이머가 있는 상태) "다시 굽기" 로 넘어와도, phase 가 바뀌었으니 이 효과가 다시 돌면서
    // 여기서 걸러진다 — handleRebakeStart 가 isLastLineTyped 를 되돌려도 이 가드가 이중으로
    // 막아 준다.
    if (!isLastLineTyped || phase === 'rebakeVote') {
      return;
    }

    // group 단계 뒤엔 매칭 결과, personal·rebakeChat 뒤엔 완료 쪽지다.
    const nextModal: InfernoEp4Modal = phase === 'group' ? 'reveal' : 'done';
    const timer = setTimeout(() => setOpenModal(nextModal), VOTE_MODAL_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isLastLineTyped, phase]);

  function handleLineDone() {
    setIsLastLineTyped(true);
  }

  function handleModalClose() {
    setOpenModal(undefined);
  }

  function handleRevealAction() {
    setOpenModal(undefined);
    setPhase('personal');
    setIsLastLineTyped(false);
  }

  // 대화가 다 쳐진 뒤 자동으로 뜨려던 done 쪽지보다 먼저 누를 수도 있어서, 뭐가 떠 있든
  // 확인 쪽지로 덮어 쓴다.
  function handleRebakeOpen() {
    setOpenModal('rebakeConfirm');
  }

  function handleRebakeStart() {
    setOpenModal(undefined);
    setPhase('rebakeVote');
    setRebakeSelectedId(undefined);
    // personal 단계에서 이미 다 쳐진 채로 넘어왔을 수 있어서, 남아 있던 done 타이머가
    // 뒤늦게 뜨지 않도록 되돌린다(위 useEffect 가드도 같은 이유).
    setIsLastLineTyped(false);
  }

  function handleRebakeSelect(participantId: string) {
    setRebakeSelectedId(participantId);
  }

  // NOTE: 고르지 않고 누르면 아무 일도 하지 않는다. 시안에 비활성 버튼도 경고 문구도
  // 없어서 없는 디자인을 지어내지 않았다(ep1 투표지와 같은 이유).
  function handleRebakeSubmit() {
    if (!rebakeSelectedId) {
      return;
    }

    setPhase('rebakeChat');
    setIsLastLineTyped(false);
  }

  function goToPersonal() {
    setPhase('personal');
  }

  function openModalNow(modal: InfernoEp4Modal) {
    return () => setOpenModal(modal);
  }

  function resolveGoPrevious() {
    if (openModal) {
      return undefined;
    }

    // 아직 투표하지 않았으니 personal 로 돌아갈 수 있다.
    return phase === 'rebakeVote' ? goToPersonal : undefined;
  }

  function resolveGoNext() {
    if (openModal || phase === 'rebakeVote') {
      return undefined;
    }

    return openModalNow(phase === 'group' ? 'reveal' : 'done');
  }

  return {
    phase,
    openModal,
    rebakeSelectedId,
    goPrevious: resolveGoPrevious(),
    goNext: resolveGoNext(),
    handleLineDone,
    handleModalClose,
    handleRevealAction,
    handleRebakeOpen,
    handleRebakeStart,
    handleRebakeSelect,
    handleRebakeSubmit,
  };
}
