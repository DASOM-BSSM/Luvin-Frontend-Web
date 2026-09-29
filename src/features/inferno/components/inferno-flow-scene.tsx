import { useState } from 'react';
import { View } from 'react-native';

import Text from '@/src/components/ui/text';
import TypewriterText from '@/src/components/ui/typewriter-text';
import InfernoStepCard from '@/src/features/inferno/components/inferno-step-card';
import {
  STEP_CARD_STAGGER_MS,
  STEP_CARD_START_GAP_MS,
} from '@/src/features/inferno/constants/animation';

/** Figma 6375:8599. */
const HEADING = '러빈지옥은 이렇게 흘러가요';

/** Figma 6376:8612. 줄바꿈까지 시안 그대로. */
const BODY = [
  '에피소드는 정해진 주기마다 하나씩 열려요',
  '순서를 건너뛸 순 없어요!!',
  '천천히 한 걸음씩 같이 가요',
].join('\n');

/** Figma 6376:8652, 8655, 8658, 8661. 위에서부터 진행 순서다. */
const STEPS = [
  '먼저 전체 대화로 서로를 알아가요',
  '투표로 첫 번째 상대를 만나요',
  '미니게임으로 한번 더 오븐으로 가요',
  '마지막엔 나는 어떤 반죽인지 확인해요',
];

/**
 * ep0 셋째 장면. Figma `ep0` (6375:8593) 의 6376:8668.
 *
 * 왼쪽 설명과 오른쪽 단계 목록이 50 간격으로 나란히 서서 쪽지 가운데에 놓인다.
 * 설명 본문이 한 글자씩 쳐지고, 다 쳐진 뒤에야 오른쪽 카드가 위에서부터 차례로 떠오른다.
 * 진행 순서를 설명하는 내용이라 목록도 순서대로 나오는 편이 말과 맞는다.
 */
export default function InfernoFlowScene() {
  const [isTypingDone, setIsTypingDone] = useState(false);

  function handleTypingDone() {
    setIsTypingDone(true);
  }

  return (
    <View className="flex-1 flex-row items-center justify-center gap-[50px]">
      <View className="w-[272px] flex-col items-start gap-[20px]">
        <Text variant="heading-h3" className="text-default-black">
          {HEADING}
        </Text>
        <TypewriterText
          text={BODY}
          variant="body-s"
          className="text-default-black"
          onDone={handleTypingDone}
        />
      </View>

      <View className="w-[342px] flex-col items-start gap-[12px]">
        {STEPS.map((step, index) => (
          <InfernoStepCard
            key={step}
            label={step}
            start={isTypingDone}
            delayMs={STEP_CARD_START_GAP_MS + index * STEP_CARD_STAGGER_MS}
          />
        ))}
      </View>
    </View>
  );
}
