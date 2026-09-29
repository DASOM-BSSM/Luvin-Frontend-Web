import type { ReactNode } from 'react';
import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface RiseInProps {
  children: ReactNode;
  /** false 인 동안은 숨은 채 기다린다. 앞선 연출이 끝난 뒤 시작시킬 때 쓴다. */
  start?: boolean;
  /** start 이후 나타나기까지 기다리는 시간(ms). 여러 개를 차례로 띄울 때 이 값을 벌린다. */
  delayMs?: number;
  durationMs?: number;
  /** 아래에서 올라오는 거리(px). */
  riseDistance?: number;
  className?: string;
}

/**
 * 아래에서 살짝 떠오르며 나타나는 감싸개.
 *
 * 처음부터 자리는 차지한 채 투명도만 0 에서 올라온다. 나타날 때 비로소 그리면 형제들과의
 * 정렬이 어긋나면서 이미 떠 있던 것들까지 밀린다.
 */
export default function RiseIn({
  children,
  start = true,
  delayMs = 0,
  durationMs = 620,
  riseDistance = 10,
  className,
}: RiseInProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!start) {
      return;
    }

    progress.value = withDelay(
      delayMs,
      withTiming(1, { duration: durationMs, easing: Easing.out(Easing.quad) }),
    );
  }, [start, delayMs, durationMs, progress]);

  const riseStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * riseDistance }],
  }));

  return (
    <Animated.View className={className} style={riseStyle}>
      {children}
    </Animated.View>
  );
}
