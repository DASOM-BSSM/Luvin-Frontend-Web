import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import Text from '@/src/components/ui/text';

interface StatBarProps {
  label: string;
  /** 0~100. 범위를 벗어나면 잘라낸다. */
  value: number;
}

const FILL_ANIMATION_DURATION_MS = 700;

/**
 * 라벨 + 퍼센트 막대. Figma 에 차트/게이지 컴포넌트가 없고(AGENTS.md §9 디렉토리 구조가
 * 예고한 `TemperatureGauge` 류의 첫 실제 구현) 프로젝트 어디서든 쓸 수 있는 형태라
 * 도메인 종속 컴포넌트가 아니라 여기 `ui/` 에 둔다.
 *
 * 막대는 0 에서 시작해 실제 값까지 채워지는 애니메이션으로 나타난다. 폭(%)은 매 프레임
 * 새로 정해지는 값이라 Tailwind 클래스로 표현할 수 없어 style 로 준다 — Reanimated/Ok
 * Mallang B 예외와 같은 이유의, 동적 값에 대한 §16 예외다.
 */
export default function StatBar({ label, value }: StatBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(clampedValue, { duration: FILL_ANIMATION_DURATION_MS });
  }, [clampedValue, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View className="w-full flex-col items-start gap-[4px]">
      <View className="w-full flex-row items-center justify-between">
        <Text variant="body-s" className="text-text-primary">
          {label}
        </Text>
        <Text variant="body-xs" className="text-text-muted">
          {clampedValue}%
        </Text>
      </View>
      <View className="h-[8px] w-full overflow-hidden rounded-[8px] bg-default-gray">
        <Animated.View className="h-full rounded-[8px] bg-pink-400" style={fillStyle} />
      </View>
    </View>
  );
}
