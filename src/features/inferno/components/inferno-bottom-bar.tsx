import { View } from 'react-native';

import Text from '@/src/components/ui/text';

/** 대부분의 회차가 쓰는 오른쪽 문구. */
const DEFAULT_SKIP_LABEL = '에피소드 스킵하기';

interface InfernoBottomBarProps {
  /** 예: "Episode 00 :: 러빈지옥에 대해 알려드릴게요" */
  label: string;
  /**
   * 오른쪽 문구. 회차마다 다르다(ep0 "에피소드 스킵하기", ep1 "잠시 나가기").
   *
   * 문구가 다르면 뜻도 다르다. 스킵은 회차를 본 것으로 치고 나가고, 잠시 나가기는 치지 않는다.
   * 그 판단은 화면이 하므로 여기서는 글자와 누름만 다룬다.
   */
  skipLabel?: string;
  onSkipPress?: () => void;
}

/**
 * 러빈지옥 본문 하단 바. Figma `Frame 80` (6340:8367, 6463:3798).
 *
 * 왼쪽에 지금 보고 있는 에피소드, 오른쪽에 나가는 길.
 */
export default function InfernoBottomBar({
  label,
  skipLabel = DEFAULT_SKIP_LABEL,
  onSkipPress,
}: InfernoBottomBarProps) {
  return (
    <View className="h-[51px] w-full flex-row items-center justify-between overflow-hidden bg-yellow-200 px-[28px]">
      <Text variant="heading-h4" className="text-text-muted">
        {label}
      </Text>
      <Text variant="body-m" className="text-text-muted" onPress={onSkipPress}>
        {skipLabel}
      </Text>
    </View>
  );
}
