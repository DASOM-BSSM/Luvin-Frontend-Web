import { router } from 'expo-router';

import { EP4_REBAKE_PARTNER_ID } from '@/src/features/inferno/api/conversation';
import InfernoChatScene from '@/src/features/inferno/components/inferno-chat-scene';
import InfernoEp4Modals from '@/src/features/inferno/components/inferno-ep4-modals';
import InfernoEpisodeFrame from '@/src/features/inferno/components/inferno-episode-frame';
import InfernoEpisodeStatus from '@/src/features/inferno/components/inferno-episode-status';
import InfernoPersonalChatScene from '@/src/features/inferno/components/inferno-personal-chat-scene';
import InfernoVoteScene from '@/src/features/inferno/components/inferno-vote-scene';
import useInfernoConversation from '@/src/features/inferno/hooks/use-inferno-conversation';
import useInfernoEp4Flow from '@/src/features/inferno/hooks/use-inferno-ep4-flow';
import { useInfernoStore } from '@/src/features/inferno/store/inferno-store';
import { findInfernoEpisode } from '@/src/features/inferno/utils/episodes';

/** 이 화면이 보여주는 회차. */
const EPISODE_ORDER = 4;

/**
 * 러빈지옥 ep4. Figma `ep4-매칭전 전체대화`(5467:4661) → `ep4-매칭`(5467:5196) →
 * `ep4-대화`(5449:1735) → `ep4-끝`(5467:5675), 그리고 1:1 대화에서 갈라져 나가는
 * `다시굽기`(5467:5418 확인 → 5467:5840 투표지 → 5467:5876 새 대화).
 *
 * ep2와 뼈대가 같다 — 투표 없이 전체대화 한 쪽 뒤에 매칭 결과 쪽지가 뜨고, 그걸 닫으면
 * 매칭 상대와의 1:1 대화로 넘어간다. 그 대화에서 "다시 굽기" 를 누르면 남은 반죽 중 하나로
 * 투표해 새 1:1 대화로 넘어갈 수 있다 — 둘 중 어느 쪽이든 대화 문구는 같다
 * (EP4_REBAKE_PARTNER_ID 주석 참고). "나의 빵에게" 피드백으로 빠지는 시안은 아직 없어서
 * 그 버튼은 눌러도 아무 일도 하지 않는다.
 *
 * "다시 굽기"는 API 연동 범위 밖이다 — 새 1:1 대화가 어떤 응답으로 내려오는지 알 방법이
 * 없어서(use-inferno-conversation 주석 참고) `conversation.rebake` 가 항상 undefined 고,
 * 그래서 아래에서 onRebakePress 를 안 넘긴다 — "다 쓴 다시 굽기"와 같은 방식으로 폴더가
 * 흐려진 채 있다(InfernoPersonalChatSidebar 주석 참고, 이미 있던 처리라 새로 만들 것 없다).
 *
 * 진행 순서는 흐름 훅(use-inferno-ep4-flow)이 정한다.
 */
export default function InfernoEp4Screen() {
  const completeEpisode = useInfernoStore((state) => state.completeEpisode);

  const episode = findInfernoEpisode(EPISODE_ORDER);
  const { conversation, isLoading, isError, hasGenerationFailed, retryGeneration } =
    useInfernoConversation(EPISODE_ORDER);
  const flow = useInfernoEp4Flow();

  // "잠시 나가기" 는 스킵과 다르다. 본 것으로 치지 않아서 다시 들어오면 처음부터다.
  function handleExitPress() {
    router.dismissTo('/');
  }

  // 완료 쪽지의 "에피소드 끝내기". 회차를 끝내고 오븐으로 보낸다.
  //
  // 쪽지를 먼저 닫는 이유: 이 화면은 dismiss 가 아니라 push 로 오븐에게 자리를 넘겨서
  // 화면 자체가 언마운트되지 않는다. RN `Modal` 은 내비게이션 스택과 무관하게 항상
  // 최상단에 그려지는 네이티브 오버레이라, 닫지 않고 넘어가면 오븐 화면 위에 그대로
  // 떠 있는다.
  function finishEpisode() {
    flow.handleModalClose();
    completeEpisode(EPISODE_ORDER);
    router.push('/oven');
  }

  // rebake 는 일부러 뺀다(위 주석 참고) — matchReveal/personalChatPages 만 갖추면 되고,
  // AI가 아직 대화를 안 만들었거나 실패했으면 빈 화면 대신 안내를 보여준다(§11, ep1~3 과
  // 같은 이유).
  //
  // pages.length도 같이 본다(ep2.tsx와 같은 이유) — matchReveal/personalChatPages가 다
  // 갖춰져도 전체대화(group) 메시지만 아직 비어 있을 수 있어서, 그 상태로 phase가 'group'
  // 이면 `conversation.pages[0]`이 undefined라 크래시한다(실기기 확인된 버그).
  if (
    !episode ||
    !conversation ||
    !conversation.matchReveal ||
    !conversation.personalChatPages ||
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

  const personalPage = conversation.personalChatPages[0];
  const rebakeOptions = conversation.rebake
    ? conversation.participants.filter(({ id }) => conversation.rebake!.candidateIds.includes(id))
    : [];
  const rebakeSelected = conversation.participants.find(({ id }) => id === flow.rebakeSelectedId);

  // rebakeChat 은 상대가 투표로 정해지므로, 고른 참가자를 자리표시자 id 로 감싸 끼운다.
  const rebakeChatParticipants = rebakeSelected
    ? [
        ...conversation.participants.filter(({ isMine }) => isMine),
        { ...rebakeSelected, id: EP4_REBAKE_PARTNER_ID },
      ]
    : conversation.participants;

  return (
    <InfernoEpisodeFrame
      episode={episode}
      // 투표지만 ep1 투표지와 같은 쪽지 바탕이고, 나머지는 흰 바탕을 그대로 쓴다.
      surface={flow.phase === 'rebakeVote' ? 'note' : 'plain'}
      skipLabel="잠시 나가기"
      onPreviousPress={flow.goPrevious}
      onNextPress={flow.goNext}
      onSkipPress={handleExitPress}
    >
      {flow.phase === 'group' ? (
        <InfernoChatScene
          page={conversation.pages[0]}
          participants={conversation.participants}
          onPageDone={flow.handleLineDone}
        />
      ) : null}

      {flow.phase === 'personal' ? (
        <InfernoPersonalChatScene
          page={personalPage}
          participants={conversation.participants}
          onPageDone={flow.handleLineDone}
          // rebake 가 없으면 넘기지 않는다 — "다 쓴 다시 굽기"와 같은 방식으로 폴더가
          // 흐려진 채 있다(위 화면 주석, InfernoPersonalChatSidebar 참고).
          onRebakePress={conversation.rebake ? flow.handleRebakeOpen : undefined}
        />
      ) : null}

      {flow.phase === 'rebakeVote' ? (
        <InfernoVoteScene
          title="REBAKE"
          message={conversation.rebake?.voteMessage ?? ''}
          options={rebakeOptions}
          selectedId={flow.rebakeSelectedId}
          onSelect={flow.handleRebakeSelect}
          onSubmit={flow.handleRebakeSubmit}
        />
      ) : null}

      {flow.phase === 'rebakeChat' ? (
        <InfernoPersonalChatScene
          page={{ id: 'ep4-rebake', messages: conversation.rebake?.chatMessages ?? [] }}
          participants={rebakeChatParticipants}
          onPageDone={flow.handleLineDone}
        />
      ) : null}

      <InfernoEp4Modals
        openModal={flow.openModal}
        matchReveal={conversation.matchReveal}
        rebakeConfirmMessage={conversation.rebake?.confirmMessage ?? ''}
        rebakeConfirmActionLabel={conversation.rebake?.confirmActionLabel ?? ''}
        onClose={flow.handleModalClose}
        onRevealAction={flow.handleRevealAction}
        onRebakeStart={flow.handleRebakeStart}
        onFinishEpisode={finishEpisode}
      />
    </InfernoEpisodeFrame>
  );
}
