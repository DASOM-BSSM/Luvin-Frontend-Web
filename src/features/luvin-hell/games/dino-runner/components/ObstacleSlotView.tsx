import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import BreadCharacter, { type BreadType } from '@/src/assets/images/BreadCharacter';
import {
  AIR_OBSTACLE_HEIGHT,
  AIR_OBSTACLE_Y,
  GROUND_OBSTACLE_HEIGHT,
  GROUND_Y,
  OBSTACLE_WIDTH,
} from '@/src/features/luvin-hell/games/dino-runner/engine/constants';
import { AIR_KIND, GROUND_KIND } from '@/src/features/luvin-hell/games/dino-runner/engine/pool';

interface ObstacleSlotViewProps {
  x: SharedValue<number>;
  kindFlag: SharedValue<number>;
  /** 스폰마다 랜덤 배정되는 반죽 종류(다양화) — 지상/공중 스프라이트 둘 다 같은 값을 쓴다(둘 중 하나만 보임). */
  doughType: BreadType;
}

/**
 * 오브젝트 풀의 슬롯 하나. 지상/공중 스프라이트를 항상 둘 다 마운트해두고 kindFlag로
 * opacity만 토글한다 — 리마운트·키 변경 없이 스포닝을 표현한다(엔진 아키텍처 3번 참고).
 * 순수 reanimated Animated.View + style만 쓴다(className 섞으면 실기기에서 크기가 깨짐 — PlayerSprite 주석 참고).
 */
export default function ObstacleSlotView({ x, kindFlag, doughType }: ObstacleSlotViewProps) {
  const wrapperStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const groundStyle = useAnimatedStyle(() => ({ opacity: kindFlag.value === GROUND_KIND ? 1 : 0 }));
  const airStyle = useAnimatedStyle(() => ({ opacity: kindFlag.value === AIR_KIND ? 1 : 0 }));

  return (
    <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, wrapperStyle]}>
      <Animated.View
        style={[
          { position: 'absolute', top: GROUND_Y - GROUND_OBSTACLE_HEIGHT, width: OBSTACLE_WIDTH, height: GROUND_OBSTACLE_HEIGHT },
          groundStyle,
        ]}
      >
        <BreadCharacter type={doughType} state="dough" className="h-full w-full" />
      </Animated.View>
      <Animated.View
        style={[
          { position: 'absolute', top: AIR_OBSTACLE_Y, width: OBSTACLE_WIDTH, height: AIR_OBSTACLE_HEIGHT },
          airStyle,
        ]}
      >
        <BreadCharacter type={doughType} state="dough" className="h-full w-full" />
      </Animated.View>
    </Animated.View>
  );
}
