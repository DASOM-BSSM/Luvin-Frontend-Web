import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import PlayerAvatar from '@/src/assets/images/PlayerAvatar';
import { PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_X } from '@/src/features/luvin-hell/games/dino-runner/engine/constants';

interface PlayerSpriteProps {
  playerY: SharedValue<number>;
  duckSquash: SharedValue<number>;
}

/** 플레이어 캐릭터. y좌표는 매프레임 갱신되는 shared value를 transform으로만 반영한다. */
export default function PlayerSprite({ playerY, duckSquash }: PlayerSpriteProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      // scaleY 로 인한 중심 기준 축소를 보정해 발이 땅에 붙어 있는 것처럼 보이게 살짝 내려준다.
      { translateY: playerY.value + duckSquash.value * 20 },
      { scaleY: 1 - duckSquash.value * 0.4 },
    ],
  }));

  return (
    // 순수 reanimated Animated.View + style만 쓴다(className 없음). cssInterop으로 감싼
    // 컴포넌트에 "일반 객체 + useAnimatedStyle 결과"를 배열로 같이 넘기면 cssInterop의
    // 스타일 병합이 reanimated의 특수 애니메이션 스타일 객체를 제대로 못 다뤄서 크기/위치가
    // 깨지는 걸 실기기에서 확인했다 — 그래서 애니메이션이 걸리는 요소는 항상 style만 쓴다.
    <Animated.View
      style={[{ position: 'absolute', top: 0, left: PLAYER_X, height: PLAYER_HEIGHT, width: PLAYER_WIDTH }, animatedStyle]}
    >
      <PlayerAvatar facing="front" className="h-full w-full" />
    </Animated.View>
  );
}
