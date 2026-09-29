import InfernoNoteModal from '@/src/features/inferno/components/inferno-note-modal';
import type { InfernoEp2Modal } from '@/src/features/inferno/hooks/use-inferno-ep2-flow';
import type { InfernoMatchReveal } from '@/src/features/inferno/types';

/** 매칭 결과 쪽지. Figma `ep2-매칭` (5466:4529~5466:4546), 폭은 쪽지 실측(390)값. */
const REVEAL_TITLE = 'NOTICE';
const REVEAL_WIDTH = 'w-[390px]';

/** 에피소드 완료 쪽지. Figma `ep2-끝` (5467:5665~5467:5672), 폭은 ep1 의 끝 쪽지와 같은 344. */
const DONE_TITLE = 'NOTICE';
const DONE_MESSAGE = '에피소드가 모두 끝났어요!';
const DONE_ACTION = '에피소드 끝내기';
const DONE_WIDTH = 'w-[344px]';

/** "나의 빵에게" 안내 쪽지. Figma `나의 빵에게` (5467:6077~5467:6085), 폭 344. */
const FEEDBACK_TITLE = 'TO.ME';
const FEEDBACK_INTRO_MESSAGE = '나의 반죽에게 의견을 주세요!';
const FEEDBACK_INTRO_ACTION = '피드백하기';
const FEEDBACK_WIDTH = 'w-[344px]';

/**
 * 피드백 완료 쪽지. 시안에 없는 화면이라 문구는 사용자와 정한 것이고, 생김새는 같은
 * 쪽지 모달을 그대로 쓴다.
 */
const FEEDBACK_DONE_MESSAGE = '피드백이 전달되었어요!';
const FEEDBACK_DONE_ACTION = '대화로 돌아가기';

interface InfernoEp2ModalsProps {
  openModal?: InfernoEp2Modal;
  matchReveal: InfernoMatchReveal;
  onClose: () => void;
  onRevealAction: () => void;
  onFinishEpisode: () => void;
  onFeedbackStart: () => void;
  onFeedbackDone: () => void;
}

/**
 * ep2 위에 뜨는 쪽지 네 장. 한 번에 한 장만 뜬다.
 *
 * 화면(src/app/inferno/ep2.tsx)에 같이 두면 문구 상수까지 스무 줄 넘게 붙어 화면이 길어진다.
 * 쪽지는 서로 생김새가 같고 문구만 다르므로 여기 모아 둔다.
 */
export default function InfernoEp2Modals({
  openModal,
  matchReveal,
  onClose,
  onRevealAction,
  onFinishEpisode,
  onFeedbackStart,
  onFeedbackDone,
}: InfernoEp2ModalsProps) {
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
        visible={openModal === 'done'}
        widthClass={DONE_WIDTH}
        title={DONE_TITLE}
        message={DONE_MESSAGE}
        actionLabel={DONE_ACTION}
        onActionPress={onFinishEpisode}
        onClose={onClose}
      />
      <InfernoNoteModal
        visible={openModal === 'feedbackIntro'}
        widthClass={FEEDBACK_WIDTH}
        title={FEEDBACK_TITLE}
        message={FEEDBACK_INTRO_MESSAGE}
        actionLabel={FEEDBACK_INTRO_ACTION}
        onActionPress={onFeedbackStart}
        onClose={onClose}
      />
      <InfernoNoteModal
        visible={openModal === 'feedbackDone'}
        widthClass={FEEDBACK_WIDTH}
        title={FEEDBACK_TITLE}
        message={FEEDBACK_DONE_MESSAGE}
        actionLabel={FEEDBACK_DONE_ACTION}
        // 완료를 알린 쪽지라 어떻게 닫든 대화로 돌아간다.
        onActionPress={onFeedbackDone}
        onClose={onFeedbackDone}
      />
    </>
  );
}
