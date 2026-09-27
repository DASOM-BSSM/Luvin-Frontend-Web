import { useState } from "react";
import { View } from "react-native";

import Text from "@/src/components/ui/text";
import InfernoChatRow from "@/src/features/inferno/components/inferno-chat-row";
import type {
  InfernoChatPage,
  InfernoParticipant,
} from "@/src/features/inferno/types";

interface InfernoChatSceneProps {
  page: InfernoChatPage;
  participants: InfernoParticipant[];
  /** 이 쪽의 마지막 줄까지 다 쳐졌을 때 알린다. */
  onPageDone?: () => void;
}

/**
 * 반죽들이 주고받는 대화 한 쪽. Figma `ep1-전체대화` (5425:886), `ep1-전체대화 끝` (6137:2782).
 *
 * 질문은 처음부터 떠 있고, 대화는 위에서부터 한 줄씩 쳐진다. 한 줄이 끝나야 다음 줄이
 * 나타나므로 화면에 있는 줄 수가 곧 진행도다.
 *
 * 아래 안내("대화가 종료되었습니다")는 마지막 줄까지 다 쳐진 뒤에 나온다. 대화가 아직
 * 이어지는 중에 종료 문구가 떠 있으면 말이 되지 않는다.
 *
 * 전체가 세로 중앙 정렬이다(사용자 요청) — 안내 문구가 나중에 나타나면 전체 블록 높이가
 * 늘어나 화면 위에서 살짝 올라가 보이는데, 위에 붙어있는 것보다 그게 자연스럽다.
 *
 * 줄 사이 간격과 위아래 여백은 더 이상 시안 값 그대로가 아니다(사용자 요청) — 말풍선 위에
 * 이름표가 붙으면서(inferno-chat-row 주석 참고) 줄 하나의 높이가 늘어났고, 회차 전체
 * 대화가 스크롤 없이 한 화면에 다 들어와야 해서 남는 여백을 최대한 줄였다.
 */
export default function InfernoChatScene({
  page,
  participants,
  onPageDone,
}: InfernoChatSceneProps) {
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

  return (
    <View className="flex-1 flex-col items-center justify-center">
      {page.question ? (
        <>
          <View className="h-[12px]" />
          <Text variant="body-m" className="text-text-muted">
            {page.question}
          </Text>
          <View className="h-[10px]" />
        </>
      ) : (
        <View className="h-[8px]" />
      )}

      <View className="w-full flex-col gap-[16px] px-[50px]">
        {visibleMessages.map((message, index) => {
          const participant = participants.find(
            ({ id }) => id === message.participantId,
          );

          // 참가자 목록에 없는 줄. 데이터가 어긋난 경우라 그 줄만 건너뛴다.
          if (!participant) {
            return null;
          }

          return (
            <InfernoChatRow
              key={message.id}
              message={message}
              participant={participant}
              onTypingDone={
                index === typedCount ? handleMessageDone : undefined
              }
            />
          );
        })}
      </View>

      {page.notice && isPageDone ? (
        <>
          <View className="h-[10px]" />
          <Text variant="body-m" className="text-text-muted">
            {page.notice}
          </Text>
        </>
      ) : null}
    </View>
  );
}
