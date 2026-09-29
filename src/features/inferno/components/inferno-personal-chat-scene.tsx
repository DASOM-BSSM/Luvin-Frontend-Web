import { useState } from 'react';
import { View } from 'react-native';

import HeartBadgeIcon from '@/src/assets/icons/HeartBadgeIcon';
import Text from '@/src/components/ui/text';
import TypewriterText from '@/src/components/ui/typewriter-text';
import InfernoChatBubble from '@/src/features/inferno/components/inferno-chat-bubble';
import InfernoPersonalChatSidebar from '@/src/features/inferno/components/inferno-personal-chat-sidebar';
import type { InfernoChatPage, InfernoParticipant } from '@/src/features/inferno/types';

interface InfernoPersonalChatSceneProps {
  page: InfernoChatPage;
  participants: InfernoParticipant[];
  /** 이 쪽의 마지막 줄까지 다 쳐졌을 때 알린다. */
  onPageDone?: () => void;
  /** "나의 빵에게" 를 눌렀을 때. 넘기지 않으면 눌러도 아무 일도 하지 않는다. */
  onFeedbackPress?: () => void;
  /** "다시 굽기" 를 눌렀을 때. 넘기지 않으면 갈 곳이 없거나 이미 다시 굽기를 썼다는 뜻. */
  onRebakePress?: () => void;
}

/**
 * 매칭 발표 뒤 1:1 대화. Figma `ep2-대화` (5379:3570), `ep2-대화 끝` (5467:5564),
 * `ep4-대화` (5449:1735), `ep4-끝` (5467:5675).
 *
 * 전체 대화(`InfernoChatScene`)와 생김새가 다르다: 아바타가 줄마다 붙지 않고 왼쪽 아래에 두
 * 반죽으로 고정돼 있고(InfernoPersonalChatSidebar), 말풍선은 분홍이다(palette="pink").
 *
 * 자리는 시안 프레임(874x402 = 기준 기기 가로 좌표)에서 그대로 옮겼다. 상하 바 51 씩을 뺀
 * 본문(874x300) 안에서 말풍선 칸은 x=384 부터 폭 450 이고 오른쪽 여백이 40 이다
 * (384 + 450 + 40 = 874). 왼쪽 묶음과 마찬가지로 본문 위에서 25 에서 시작한다(위쪽 정렬).
 *
 * 줄이 하나씩 쳐지는 방식은 InfernoChatScene 과 같다.
 */
export default function InfernoPersonalChatScene({
  page,
  participants,
  onPageDone,
  onFeedbackPress,
  onRebakePress,
}: InfernoPersonalChatSceneProps) {
  /** 다 쳐진 줄 수. 지금 쳐지고 있는 줄의 인덱스이기도 하다. */
  const [typedCount, setTypedCount] = useState(0);

  const visibleMessages = page.messages.slice(0, typedCount + 1);
  const isPageDone = typedCount >= page.messages.length;

  function handleMessageDone() {
    const nextCount = typedCount + 1;
    setTypedCount(nextCount);

    if (nextCount >= page.messages.length) {
      onPageDone?.();
    }
  }

  const mine = participants.find(({ isMine }) => isMine);

  // 1:1 상대는 "참가자 목록에서 내가 아닌 첫 반죽"이 아니라 이 쪽에서 말을 건 반죽이다.
  // ep2·ep4 참가자 목록에는 전체대화에 나온 넷이 다 들어 있어서, 목록 순서로 고르면
  // 매칭되지 않은 반죽이 설 수 있다.
  const partner = participants.find(
    ({ id, isMine }) => !isMine && page.messages.some((message) => message.participantId === id),
  );

  return (
    <View className="w-full flex-1 flex-row">
      <InfernoPersonalChatSidebar
        mine={mine}
        partner={partner}
        onFeedbackPress={onFeedbackPress}
        onRebakePress={onRebakePress}
      />

      <View className="flex-1 flex-col pr-[40px]">
        <View className="h-[25px]" />

        <View className="w-full flex-col gap-[20px]">
          {visibleMessages.map((message, index) => {
            const participant = participants.find(({ id }) => id === message.participantId);

            // 참가자 목록에 없는 줄. 데이터가 어긋난 경우라 그 줄만 건너뛴다.
            if (!participant) {
              return null;
            }

            const isRight = message.side === 'right';

            return (
              <View key={message.id} className="w-full flex-col items-start">
                <View className={`w-full flex-row ${isRight ? 'justify-end' : 'justify-start'}`}>
                  <InfernoChatBubble side={message.side} isMine={participant.isMine} palette="pink">
                    <TypewriterText
                      text={message.text}
                      variant="body-m"
                      className="text-text-primary"
                      onDone={index === typedCount ? handleMessageDone : undefined}
                    />
                  </InfernoChatBubble>
                </View>
                {/* 하트는 말풍선 왼쪽 아래에 걸쳐 앉는다 — 시안에서 말풍선 위에서 38, 왼쪽에서 13. */}
                {message.showHeart && index < typedCount ? (
                  <View className="-mt-[8px] pl-[13px]">
                    <HeartBadgeIcon />
                  </View>
                ) : null}
              </View>
            );
          })}

          {page.notice && isPageDone ? (
            <View className="w-full items-center">
              <Text variant="body-m" className="text-text-muted">
                {page.notice}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
