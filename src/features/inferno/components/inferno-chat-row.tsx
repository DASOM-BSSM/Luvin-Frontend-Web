import { View } from "react-native";

import BreadCharacter from "@/src/assets/images/BreadCharacter";
import Text from "@/src/components/ui/text";
import TypewriterText from "@/src/components/ui/typewriter-text";
import InfernoChatBubble from "@/src/features/inferno/components/inferno-chat-bubble";
import {
  CHAT_AVATAR_SLOT_CLASS,
  CHAT_ROW_GAP_CLASS,
  findDoughFigure,
} from "@/src/features/inferno/constants/dough-figures";
import type {
  InfernoChatMessage,
  InfernoParticipant,
} from "@/src/features/inferno/types";

interface InfernoChatRowProps {
  message: InfernoChatMessage;
  /** message.participantId 가 가리키는 반죽. 그림과 말풍선 색이 여기서 나온다. */
  participant: InfernoParticipant;
  /** 이 줄이 다 쳐졌을 때 알린다. 다음 줄을 띄우는 신호. */
  onTypingDone?: () => void;
}

/**
 * 대화 한 줄. 반죽과 말풍선이 나란히 서고, 반죽은 말풍선 바깥쪽에 붙는다.
 *
 * 이름표는 말풍선 바로 위에 작게 붙인다(사용자 요청) — AI가 만드는 실제 대화에서는 반죽
 * 종류가 `characterId` 해시로 결정되다 보니(deriveCharacterPersona) 서로 다른 캐릭터가
 * 같은 반죽 모양으로 겹칠 수 있어서, 이름 없이는 누가 누군지 구분이 안 되는 문제가 있었다.
 * 반죽 쪽이 아니라 말풍선 쪽에 붙이고 여백을 최소로 둔 이유: 회차 전체 대화가 스크롤 없이
 * 한 화면에 다 들어와야 해서(사용자 요청), 줄마다 늘어나는 높이를 최대한 줄여야 한다.
 *
 * 대화하는 반죽이라 personDough(팔다리 있는 반죽)를 쓴다(BreadCharacter 주석 참고).
 * 이 컴포넌트는 ep1 전체대화뿐 아니라 다른 회차의 group 단계(InfernoChatScene)도 그대로
 * 재사용하므로, 여기 하나만 바꾸면 모든 회차가 같이 바뀐다.
 *
 * 반죽은 실제 그림 크기(`chatSizeClass`, 반죽마다 84~107px로 다름) 그대로가 아니라
 * 고정 폭 칸(`CHAT_AVATAR_SLOT_CLASS`) 안에 넣고 말풍선 쪽 끝에 붙여 그린다(사용자 지적:
 * "말풍선들이 빵 반죽 크기에 의해 뒤죽박죽 섞인것 처럼 보인다"). 칸 폭이 늘 같으니 그
 * 다음에 오는 말풍선의 시작 위치도 반죽 종류와 무관하게 항상 같다.
 */
export default function InfernoChatRow({
  message,
  participant,
  onTypingDone,
}: InfernoChatRowProps) {
  const figure = findDoughFigure(participant.type);
  const isRight = message.side === "right";

  const avatar = (
    <View
      className={`${CHAT_AVATAR_SLOT_CLASS} flex-col ${isRight ? "items-start" : "items-end"}`}
    >
      <BreadCharacter
        type={participant.type}
        state="personDough"
        className={figure.chatSizeClass}
        accessibilityLabel={participant.name}
      />
    </View>
  );

  const bubble = (
    <View
      className={`shrink flex-col gap-[4px] ${isRight ? "items-end" : "items-start"}`}
    >
      <Text variant="body-xxs" className="text-text-muted" numberOfLines={1}>
        {participant.name}
      </Text>
      <InfernoChatBubble side={message.side} isMine={participant.isMine}>
        <TypewriterText
          text={message.text}
          variant="body-m"
          className="text-text-primary"
          onDone={onTypingDone}
        />
      </InfernoChatBubble>
    </View>
  );

  return (
    <View
      className={`w-full flex-row items-end ${isRight ? "justify-end" : ""} ${CHAT_ROW_GAP_CLASS}`}
    >
      {isRight ? null : avatar}
      {bubble}
      {isRight ? avatar : null}
    </View>
  );
}
