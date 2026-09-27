import { router } from 'expo-router';

import InfernoChatScene from '@/src/features/inferno/components/inferno-chat-scene';
import InfernoEpisodeFrame from '@/src/features/inferno/components/inferno-episode-frame';
import InfernoEpisodeStatus from '@/src/features/inferno/components/inferno-episode-status';
import InfernoNoteModal from '@/src/features/inferno/components/inferno-note-modal';
import InfernoVoteScene from '@/src/features/inferno/components/inferno-vote-scene';
import useInfernoConversation from '@/src/features/inferno/hooks/use-inferno-conversation';
import useInfernoEp1Flow from '@/src/features/inferno/hooks/use-inferno-ep1-flow';
import { useInfernoStore } from '@/src/features/inferno/store/inferno-store';
import { findInfernoEpisode } from '@/src/features/inferno/utils/episodes';

/** 이 화면이 보여주는 회차. */
const EPISODE_ORDER = 1;

/** 대화 끝 투표 모달. Figma `ep1-투표` (5466:4550, 5466:4555, 5466:4557). */
const VOTE_MODAL_TITLE = 'VOTE';
const VOTE_MODAL_ACTION = '투표하기';
const VOTE_MODAL_WIDTH = 'w-[366px]';

/** 투표 완료 모달. Figma `ep1-끝` (5467:5645, 5467:5650~5467:5652). */
const DONE_MODAL_TITLE = 'NOTICE';
const DONE_MODAL_MESSAGE = '첫인상 투표가 완료되었어요!';
const DONE_MODAL_ACTION = '에피소드 끝내기';
const DONE_MODAL_WIDTH = 'w-[344px]';

/**
 * 러빈지옥 ep1. Figma `ep1-전체대화`(5425:886), `ep1-전체대화 끝`(6137:2782),
 * `ep1-투표`(5466:4268), `ep1-투표지`(5452:1989), `ep1-끝`(5467:5373).
 *
 * 대화 두 쪽을 지나 투표지까지 한 라우트가 들고 간다. ep0 처럼 화면을 쪼개지 않는 이유는
 * 같고(라우트 경로는 딥링크 계약이라 늘리면 되돌리기 어렵다), 진행 순서는 흐름 훅이 정한다.
 *
 * 바탕이 대화에서는 흰색, 투표지에서는 ep0 와 같은 물방울 배경 위 쪽지라 surface 가 바뀐다.
 */
export default function InfernoEp1Screen() {
  const completeEpisode = useInfernoStore((state) => state.completeEpisode);
  const saveCheckpoint = useInfernoStore((state) => state.saveCheckpoint);
  // 지난번에 "잠시 나가기" 로 나갔다면 그 자리에서 이어 본다. 처음 들어오는 회차면 0.
  const initialStep = useInfernoStore((state) => state.checkpoints[EPISODE_ORDER]) ?? 0;

  const episode = findInfernoEpisode(EPISODE_ORDER);
  const { conversation, isLoading, isError, hasGenerationFailed, retryGeneration } =
    useInfernoConversation(EPISODE_ORDER);
  const flow = useInfernoEp1Flow(conversation, initialStep);

  function finishEpisode() {
    completeEpisode(EPISODE_ORDER);
    router.dismissTo('/');
  }

  // "잠시 나가기" 는 스킵과 다르다. 회차를 본 것으로 치지 않고, 보던 자리만 기억해 둔다.
  function handleExitPress() {
    saveCheckpoint(EPISODE_ORDER, flow.step);
    router.dismissTo('/');
  }

  // vote 는 회차마다 있을 수도 없을 수도 있는 필드라(types/index.ts 주석 참고) ep1
  // 데이터에는 항상 있지만 타입상 좁혀 둬야 한다. AI가 아직 대화를 안 만들었거나
  // 실패했으면 빈 화면 대신 안내를 보여준다(§11).
  if (!episode || !conversation || !conversation.vote) {
    return (
      <InfernoEpisodeFrame episode={episode ?? { order: EPISODE_ORDER, title: '' }} surface="plain" skipLabel="잠시 나가기" onSkipPress={handleExitPress}>
        <InfernoEpisodeStatus
          isError={isError}
          isLoading={isLoading}
          hasGenerationFailed={hasGenerationFailed}
          onRetry={retryGeneration}
        />
      </InfernoEpisodeFrame>
    );
  }

  const page = conversation.pages[flow.pageIndex];
  const voteOptions = conversation.participants.filter(({ isMine }) => !isMine);

  return (
    <InfernoEpisodeFrame
      episode={episode}
      surface={flow.isBallotOpen ? 'note' : 'plain'}
      skipLabel="잠시 나가기"
      onPreviousPress={flow.goPrevious}
      onNextPress={flow.goNext}
      onSkipPress={handleExitPress}
    >
      {flow.isBallotOpen ? (
        <InfernoVoteScene
          message={conversation.vote.ballotMessage}
          options={voteOptions}
          selectedId={flow.selectedId}
          isSubmitting={flow.isSubmitting}
          errorMessage={flow.submitError}
          onSelect={flow.handleSelect}
          onSubmit={flow.handleSubmit}
        />
      ) : (
        /* 쪽이 바뀌면 타자를 처음부터 다시 치도록 key 로 갈아 끼운다. */
        <InfernoChatScene
          key={page.id}
          page={page}
          participants={conversation.participants}
          onPageDone={flow.handlePageDone}
        />
      )}

      <InfernoNoteModal
        visible={flow.openModal === 'vote'}
        widthClass={VOTE_MODAL_WIDTH}
        title={VOTE_MODAL_TITLE}
        message={conversation.vote.modalMessage}
        actionLabel={VOTE_MODAL_ACTION}
        onActionPress={flow.handleVoteStart}
        onClose={flow.handleModalClose}
      />
      <InfernoNoteModal
        visible={flow.openModal === 'done'}
        widthClass={DONE_MODAL_WIDTH}
        title={DONE_MODAL_TITLE}
        message={DONE_MODAL_MESSAGE}
        actionLabel={DONE_MODAL_ACTION}
        onActionPress={finishEpisode}
        onClose={flow.handleModalClose}
      />
    </InfernoEpisodeFrame>
  );
}
