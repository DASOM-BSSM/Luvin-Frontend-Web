import { View } from 'react-native';

import Text, { type TextVariant } from '@/src/components/ui/text';

/**
 * 녹화 중 표시(분홍 점 + REC). 같은 모양을 두 크기로 쓴다.
 *
 * - `sm` : 홈의 이번주 에피소드 카드
 * - `lg` : 러빈지옥 ep0 화면 (Figma 6159:3317)
 */
export type RecBadgeSize = 'sm' | 'lg';

const SIZE_GAP: Record<RecBadgeSize, string> = {
  sm: 'gap-[4px]',
  lg: 'gap-[8px]',
};

const SIZE_DOT: Record<RecBadgeSize, string> = {
  sm: 'size-[8px]',
  lg: 'size-[12px]',
};

const SIZE_TEXT: Record<RecBadgeSize, TextVariant> = {
  sm: 'body-xs',
  lg: 'body-l',
};

interface RecBadgeProps {
  size?: RecBadgeSize;
}

export default function RecBadge({ size = 'sm' }: RecBadgeProps) {
  return (
    <View className={`flex-row items-center self-start ${SIZE_GAP[size]}`}>
      <View className={`rounded-full bg-pink-500 ${SIZE_DOT[size]}`} />
      <Text variant={SIZE_TEXT[size]} className="text-pink-500">
        REC
      </Text>
    </View>
  );
}
