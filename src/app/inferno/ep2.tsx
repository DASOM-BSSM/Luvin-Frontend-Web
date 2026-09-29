import { router } from 'expo-router';

import InfernoChatScene from '@/src/features/inferno/components/inferno-chat-scene';
import InfernoEp2Modals from '@/src/features/inferno/components/inferno-ep2-modals';
import InfernoEpisodeFrame from '@/src/features/inferno/components/inferno-episode-frame';
import InfernoEpisodeStatus from '@/src/features/inferno/components/inferno-episode-status';
import InfernoFeedbackScene from '@/src/features/inferno/components/inferno-feedback-scene';
import InfernoPersonalChatScene from '@/src/features/inferno/components/inferno-personal-chat-scene';
import useInfernoConversation from '@/src/features/inferno/hooks/use-inferno-conversation';
import useInfernoEp2Flow from '@/src/features/inferno/hooks/use-inferno-ep2-flow';
import { useInfernoStore } from '@/src/features/inferno/store/inferno-store';
import { findInfernoEpisode } from '@/src/features/inferno/utils/episodes';

/** 이 화면이 보여주는 회차. */
const EPISODE_ORDER = 2;

/**
 * 러빈지옥 ep2. Figma `ep2-시작`(5467:4595) → `ep2-매칭전 전체대화`(5458:2968) →
 * `ep2-매칭`(5467:5123) → `ep2-대화`(5379:3570) → `ep2-대화 끝`(5467:5564) → `ep2-끝`(5467:5748).
 *
 * ep1 과 달리 투표가 없다. ep1 투표에서 고른 세 후보가 저희끼리 대화를 나누다가 매칭 결과
 * 쪽지가 뜨고("도넛 반죽과 오븐 가기"), 그걸 누르면 매칭 상대(도넛)와의 1:1 대화로 넘어가
 * 두 쪽을 지나 완료 쪽지로 끝난다. 진행 순서는 흐름 훅(use-inferno-ep2-flow)이 정한다.
 *
 * 두 대화가 생김새가 달라서(색·아바타 배치) 컴포넌트를 나눴다 — group 단계는 ep1 이 이미
 * 만든 InfernoChatScene(노랑, 줄마다 아바타)을, personal 단계는 새로 만든
 * InfernoPersonalChatScene(분홍, 고정 초상화)을 쓴다.
 *
 * 1:1 대화에서 "나의 빵에게" 를 누르면 피드백(feedback) 단계로 잠깐 빠졌다가 돌아온다.
 * Figma `나의 빵에게` (5467:6133, 5482:1883, 5467:6203, 5482:1923).
 *
 * 바탕은 대화에서는 흰색(plain), 피드백에서는 물방울 배경 위 쪽지(note)다.
 */
export default function InfernoEp2Screen() {
  const completeEpisode = useInfernoStore((state) => state.completeEpisode);
  const saveCheckpoint = useInfernoStore((state) => state.saveCheckpoint);
  // 지난번에 "잠시 나가기" 로 나갔다면 그 자리에서 이어 본다. 처음 들어오는 회차면 0.
  const initialStep = useInfernoStore((state) => state.checkpoints[EPISODE_ORDER]) ?? 0;

  const episode = findInfernoEpisode(EPISODE_ORDER);
  const { conversation, isLoading, isError, hasGenerationFailed, retryGeneration } =
    useInfernoConversation(EPISODE_ORDER);
  const flow = useInfernoEp2Flow(conversation, initialStep);

  function finishEpisode() {
    completeEpisode(EPISODE_ORDER);
    router.dismissTo('/');
  }

  // "잠시 나가기" 는 스킵과 다르다. 회차를 본 것으로 치지 않고, 보던 자리만 기억해 둔다.
  function handleExitPress() {
    saveCheckpoint(EPISODE_ORDER, flow.step);
    router.dismissTo('/');
  }

  // matchReveal/personalChatPages/feedbackTopics 는 매칭 회차 데이터가 갖춰지면 한꺼번에
  // 채워진다(map-ai-episode.ts). AI가 아직 대화를 안 만들었거나 실패했으면 빈 화면 대신
  // 안내를 보여준다(§11, ep1 과 같은 이유).
  //
  // pages.length도 같이 본다 — isEpisodeFullyGenerated는 매칭 회차에서 1:1 대화(one_to_one)
  // 존재만 확인하고 전체대화(group)는 안 보기 때문에, matchReveal 등은 다 갖춰졌는데 group
  // 메시지만 아직 비어 있는 경우가 실제로 생긴다. 그 상태에서 phase가 아직 'group'이면
  // 아래 `conversation.pages[0]`이 undefined라 화면이 그대로 크래시한다(실기기에서 확인된
  // 버그: "Cannot read property 'messages' of undefined").
  if (
    !episode ||
    !conversation ||
    !conversation.matchReveal ||
    !conversation.personalChatPages ||
    !conversation.feedbackTopics ||
    conversation.pages.length === 0
  ) {
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

  const groupPage = conversation.pages[flow.groupPageIndex];
  const personalPage = conversation.personalChatPages[flow.personalPageIndex];

  return (
    <InfernoEpisodeFrame
      episode={episode}
      // 피드백만 물방울 배경 위 쪽지고, 대화는 흰 바탕을 그대로 쓴다.
      surface={flow.phase === 'feedback' ? 'note' : 'plain'}
      skipLabel="잠시 나가기"
      onPreviousPress={flow.goPrevious}
      onNextPress={flow.goNext}
      onSkipPress={handleExitPress}
    >
      {flow.phase === 'group' ? (
        // 쪽이 바뀌면 타자를 처음부터 다시 치도록 key 로 갈아 끼운다(ep1 과 같은 이유).
        <InfernoChatScene
          key={groupPage.id}
          page={groupPage}
          participants={conversation.participants}
          onPageDone={flow.handleLineDone}
        />
      ) : null}

      {flow.phase === 'personal' ? (
        // 쪽이 바뀌면 타자를 처음부터 다시 치도록 key 로 갈아 끼운다(ep1 과 같은 이유).
        <InfernoPersonalChatScene
          key={personalPage.id}
          page={personalPage}
          participants={conversation.participants}
          onPageDone={flow.handleLineDone}
          onFeedbackPress={flow.handleFeedbackOpen}
        />
      ) : null}

      {flow.phase === 'feedback' ? (
        <InfernoFeedbackScene
          step={flow.feedback.step}
          topics={conversation.feedbackTopics}
          selectedMessageId={flow.feedback.selectedTopicId}
          shownTopic={flow.feedback.shownTopic}
          feedback={flow.feedback.feedback}
          onSelectTopic={flow.feedback.handleTopicSelect}
          onFindPress={flow.feedback.handleTopicFind}
          onWriteStartPress={flow.feedback.handleWriteStart}
          onFeedbackChange={flow.feedback.handleFeedbackChange}
          onSubmitPress={flow.handleFeedbackSubmit}
        />
      ) : null}

      <InfernoEp2Modals
        openModal={flow.openModal}
        matchReveal={conversation.matchReveal}
        onClose={flow.handleModalClose}
        onRevealAction={flow.handleRevealAction}
        onFinishEpisode={finishEpisode}
        onFeedbackStart={flow.handleFeedbackStart}
        onFeedbackDone={flow.handleFeedbackDone}
      />
    </InfernoEpisodeFrame>
  );
}
