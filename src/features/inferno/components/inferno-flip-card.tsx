import { Pressable } from 'react-native';

import BreadCharacter from '@/src/assets/images/BreadCharacter';
import type { InfernoCardState } from '@/src/features/inferno/hooks/use-inferno-cardflip-game';

interface InfernoFlipCardProps {
  card: InfernoCardState;
  disabled: boolean;
  /** 누른 카드의 id 를 돌려준다. 목록에서 익명 함수를 만들지 않으려고 여기서 감싼다(§16). */
  onPress: (cardId: number) => void;
}

/**
 * 카드 뒤집기 한 장. Figma `6478:4004`(뒤집힘) / `6483:4020`(짝 맞음, 반죽이 보임).
 *
 * 맞은 카드는 계속 앞면으로 남는다 — 셔플되어 사라지지 않는다.
 */
export default function InfernoFlipCard({ card, disabled, onPress }: InfernoFlipCardProps) {
  function handlePress() {
    onPress(card.id);
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={card.isFaceUp ? `${card.type} 카드` : '뒤집힌 카드'}
      accessibilityState={{ disabled: disabled || card.isFaceUp }}
      disabled={disabled || card.isFaceUp}
      className={`h-[56px] w-[76px] items-center justify-center rounded-[12px] border ${
        card.isFaceUp ? 'border-pink-400 bg-pink-300' : 'border-pink-300 bg-pink-200'
      }`}
      onPress={handlePress}
    >
      {card.isFaceUp ? (
        <BreadCharacter
          type={card.type}
          state="personDough"
          className="h-[40px] w-[48px]"
          accessibilityLabel={`${card.type} 반죽`}
        />
      ) : null}
    </Pressable>
  );
}
