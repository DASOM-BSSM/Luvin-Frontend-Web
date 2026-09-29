import type { ReactNode } from 'react';
import { View } from 'react-native';

import type { InfernoChatSide } from '@/src/features/inferno/types';

/** 말풍선 색 짝. 전체대화는 노랑(yellow), 매칭 뒤 1:1 대화는 분홍(pink). */
export type InfernoChatBubblePalette = 'yellow' | 'pink';

const BUBBLE_COLOR_CLASS: Record<InfernoChatBubblePalette, { mine: string; theirs: string }> = {
  yellow: { mine: 'bg-yellow-400', theirs: 'bg-yellow-200' },
  pink: { mine: 'bg-pink-400', theirs: 'bg-pink-200' },
};

interface InfernoChatBubbleProps {
  side: InfernoChatSide;
  /** 내 분신의 말이면 진한 색, 아니면 연한 색. Figma 5425:901 / 5449:1546. */
  isMine: boolean;
  /** 기본은 노랑(전체대화). 매칭 뒤 1:1 대화(`ep2-대화` 5379:3570, `ep4-대화` 5449:1735)는 분홍을 쓴다. */
  palette?: InfernoChatBubblePalette;
  children: ReactNode;
}

/**
 * 러빈지옥 대화 말풍선. Figma `firstmeeting` (5425:901), `trollycaht` (5379:3574, 5449:1750).
 *
 * 꼬리 대신 반죽 쪽 아래 모서리만 각지게 두는 시안이라, 각지는 모서리는 좌우 위치를 따라간다.
 * 글자에 맞춰 늘어나는(hug) 상자라서 한 글자씩 쳐지면 반죽 쪽에 붙은 채로 자란다.
 */
export default function InfernoChatBubble({
  side,
  isMine,
  palette = 'yellow',
  children,
}: InfernoChatBubbleProps) {
  const cornerClass = side === 'right' ? 'rounded-br-none' : 'rounded-bl-none';
  const colorClass = isMine ? BUBBLE_COLOR_CLASS[palette].mine : BUBBLE_COLOR_CLASS[palette].theirs;

  return (
    <View className={`shrink rounded-[20px] px-[20px] py-[10px] ${cornerClass} ${colorClass}`}>
      {children}
    </View>
  );
}
