import InfernoNoteModal from '@/src/features/inferno/components/inferno-note-modal';
import type { InfernoEp4Modal } from '@/src/features/inferno/hooks/use-inferno-ep4-flow';
import type { InfernoMatchReveal } from '@/src/features/inferno/types';

/** 매칭 결과 쪽지. Figma `ep4-매칭` (5467:5196), 폭은 쪽지 실측(390)값. */
const REVEAL_TITLE = 'NOTICE';
const REVEAL_WIDTH = 'w-[390px]';

/** 다시 굽기 확인 쪽지. Figma `다시굽기` 확인 모달 (5467:5829~5467:5837), 폭 344. */
const REBAKE_CONFIRM_TITLE = 'REBAKE';
const REBAKE_CONFIRM_WIDTH = 'w-[344px]';

/** 에피소드 완료 쪽지. Figma `ep4-끝` (5467:5818~5467:5826), 폭은 ep1 의 끝 쪽지와 같은 344. */
const DONE_TITLE = 'NOTICE';
const DONE_MESSAGE = '에피소드가 모두 끝났어요!';
const DONE_ACTION = '에피소드 끝내기';
const DONE_WIDTH = 'w-[344px]';

interface InfernoEp4ModalsProps {
  openModal?: InfernoEp4Modal;
  matchReveal: InfernoMatchReveal;
  rebakeConfirmMessage: string;
  rebakeConfirmActionLabel: string;
  onClose: () => void;
  onRevealAction: () => void;
  onRebakeStart: () => void;
  onFinishEpisode: () => void;
}

/**
 * ep4 위에 뜨는 쪽지 세 장. 한 번에 한 장만 뜬다.
 *
 * 화면(src/app/inferno/ep4.tsx)에 같이 두면 문구 상수까지 붙어 화면이 길어진다(§16).
 * 쪽지는 서로 생김새가 같고 문구만 다르므로 여기 모아 둔다(ep2 의 InfernoEp2Modals 와
 * 같은 이유).
 */
export default function InfernoEp4Modals({
  openModal,
  matchReveal,
  rebakeConfirmMessage,
  rebakeConfirmActionLabel,
  onClose,
  onRevealAction,
  onRebakeStart,
  onFinishEpisode,
}: InfernoEp4ModalsProps) {
  return (
    <>
      <InfernoNoteModal
        visible={openModal === 'reveal'}
        widthClass={REVEAL_WIDTH}
        title={REVEAL_TITLE}
        message={matchReveal.noticeMessage}
        actionLabel={matchReveal.actionLabel}
        onActionPress={onRevealAction}
        onClose={onClose}
      />
      <InfernoNoteModal
        visible={openModal === 'rebakeConfirm'}
        widthClass={REBAKE_CONFIRM_WIDTH}
        title={REBAKE_CONFIRM_TITLE}
        message={rebakeConfirmMessage}
        actionLabel={rebakeConfirmActionLabel}
        onActionPress={onRebakeStart}
        onClose={onClose}
      />
      <InfernoNoteModal
        visible={openModal === 'done'}
        widthClass={DONE_WIDTH}
        title={DONE_TITLE}
        message={DONE_MESSAGE}
        actionLabel={DONE_ACTION}
        onActionPress={onFinishEpisode}
        onClose={onClose}
      />
    </>
  );
}
