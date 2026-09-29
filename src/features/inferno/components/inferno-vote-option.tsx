import { Pressable } from 'react-native';

import BreadCharacter from '@/src/assets/images/BreadCharacter';
import Text from '@/src/components/ui/text';
import { findDoughFigure } from '@/src/features/inferno/constants/dough-figures';
import type { InfernoParticipant } from '@/src/features/inferno/types';

interface InfernoVoteOptionProps {
  participant: InfernoParticipant;
  selected: boolean;
  /** 누른 반죽의 id 를 돌려준다. 목록에서 익명 함수를 만들지 않으려고 여기서 감싼다(§16). */
  onSelect: (participantId: string) => void;
}

/**
 * 투표지의 반죽 선택지 한 줄. Figma `option` (5456:2918).
 *
 * 고른 것만 바탕이 진해진다(yellow/300). 시안에 테두리나 체크 표시가 없어서 색이 유일한
 * 표시라, 화면 낭독기에는 accessibilityState 로 따로 알린다.
 *
 * personDough(팔다리 있는 반죽)를 쓴다(BreadCharacter 주석 참고).
 */
export default function InfernoVoteOption({
  participant,
  selected,
  onSelect,
}: InfernoVoteOptionProps) {
  const figure = findDoughFigure(participant.type);

  function handlePress() {
    onSelect(participant.id);
  }

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={participant.name}
      className={`h-[56px] w-full flex-row items-center gap-[16px] rounded-[8px] px-[24px] ${
        selected ? 'bg-yellow-300' : 'bg-yellow-100'
      }`}
      onPress={handlePress}
    >
      <BreadCharacter
        type={participant.type}
        state="personDough"
        className={figure.optionSizeClass}
      />
      <Text variant="body-m" className="text-text-primary">
        {participant.name}
      </Text>
    </Pressable>
  );
}
