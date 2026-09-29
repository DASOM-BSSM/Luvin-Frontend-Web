import { Pressable, View } from 'react-native';

import Text from '@/src/components/ui/text';

interface ResultOverlayProps {
  success: boolean;
  onPress: () => void;
}

/** Result 단계 오버레이(성공/실패 공용). `GameFrame` 안쪽에 절대 위치로 덮어 쓴다. 탭하면 재시작. */
export default function ResultOverlay({ success, onPress }: ResultOverlayProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="absolute inset-0 flex-col items-center justify-center gap-[200px] bg-[rgba(29,29,29,0.5)]"
    >
      <View className="flex-col items-center gap-[8px] px-[39px]">
        <Text variant="display-title">
          Game Over
        </Text>
        <Text variant="heading-h4" className="text-center text-default-white">
          {success ? '오늘의 미션 성공!' : '오늘의 미션 실패..'}
        </Text>
      </View>
      {/* body-m 16px 기준 Figma 원본 박스(263px)는 폭이 타이트해 안드로이드 한글 대체
          폰트에서 2줄로 밀림 — 이 줄만 여유 폭(px-16)을 주고 numberOfLines로 한 줄을 보장한다. */}
      <Text variant="body-m" numberOfLines={1} className="w-full px-[16px] text-center text-default-white">
        화면을 탭하여 다시 시작할 수 있어요
      </Text>
    </Pressable>
  );
}
