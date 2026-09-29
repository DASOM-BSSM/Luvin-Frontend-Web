import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import BreadCharacter from '@/src/assets/images/BreadCharacter';
import InfernoMiniGameCup from '@/src/assets/images/InfernoMiniGameCup';
import type { InfernoShellCupState } from '@/src/features/inferno/hooks/use-inferno-shell-game';

interface InfernoShellCupProps {
  cup: InfernoShellCupState;
  disabled: boolean;
  onPress: (cupId: number) => void;
}

/** 움직이는 컵 하나. 겹침과 transform은 야바위 애니메이션에 필요한 범위로 가둔다. */
export default function InfernoShellCup({ cup, disabled, onPress }: InfernoShellCupProps) {
  const positionStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cup.translateX.value }],
  }));
  const cupStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cup.translateY.value }],
  }));

  function handlePress() {
    onPress(cup.id);
  }

  return (
    <Animated.View className="h-[130px] w-[100px] items-center justify-end" style={positionStyle}>
      {cup.isTarget ? (
        <View className="h-[40px] w-[76px] items-center justify-end">
          <BreadCharacter
            type="pretzel"
            state="personDough"
            className="h-[40px] w-[76px]"
            accessibilityLabel="프레첼 반죽"
          />
        </View>
      ) : (
        <View className="h-[40px] w-[76px]" />
      )}
      <Animated.View className="absolute bottom-0" style={cupStyle}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${cup.id + 1}번 컵`}
          disabled={disabled}
          onPress={handlePress}
        >
          <InfernoMiniGameCup />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
