import { Pressable, View } from 'react-native';

import Text from '@/src/components/ui/text';

interface ReadyOverlayProps {
  onPress: () => void;
}

/** Ready 단계 오버레이. `GameFrame` 안쪽에 절대 위치로 덮어 쓴다. 탭하면 플레이 시작. */
export default function ReadyOverlay({ onPress }: ReadyOverlayProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="absolute inset-0 flex-col items-center justify-center gap-[200px] bg-[rgba(29,29,29,0.5)] px-[39px]"
    >
      <View className="flex-col items-center gap-[8px]">
        <Text variant="display-title">
          Ready?
        </Text>
        <Text variant="heading-h4" className="text-center text-default-white">
          미션을 확인하고 게임하세요!
        </Text>
      </View>
      <Text variant="body-m" className="text-center text-default-white">
        화면을 탭하여 시작해요
      </Text>
    </Pressable>
  );
}
