import { GestureDetector } from 'react-native-gesture-handler';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import CloudLargeIcon from '@/src/assets/icons/CloudLargeIcon';
import CloudMediumIcon from '@/src/assets/icons/CloudMediumIcon';
import CloudSmallIcon from '@/src/assets/icons/CloudSmallIcon';
import { InGameStats } from '@/src/features/luvin-hell/components/GameHud';
import { sceneColors } from '@/src/features/luvin-hell/constants/scene-colors';
import DinoGround from '@/src/features/luvin-hell/games/dino-runner/components/DinoGround';
import { useDinoEngine } from '@/src/features/luvin-hell/games/dino-runner/hooks/useDinoEngine';
import { useDinoGestures } from '@/src/features/luvin-hell/games/dino-runner/hooks/useDinoGestures';
import ObstacleSlotView from '@/src/features/luvin-hell/games/dino-runner/components/ObstacleSlotView';
import PlayerSprite from '@/src/features/luvin-hell/games/dino-runner/components/PlayerSprite';
import type { GamePhase } from '@/src/features/luvin-hell/types';

interface DinoRunnerSceneProps {
  phase: GamePhase;
  score: number;
  hearts: number;
  onHit: () => void;
  onScoreChange: (score: number) => void;
}

/**
 * 공룡빵게임 플레이필드. `relative` 컨테이너 + `absolute` 자식(스프라이트/장애물) —
 * AGENTS.md §16 레이아웃 규칙의 스코프 한정 예외(계획 문서 "엔진 아키텍처" 1번).
 * 하늘/구름/땅은 게임 판정에 쓰이지 않는 장식이지만, Figma 미니게임1(`5913:5154`)의
 * 구름 벡터 3개와 4겹 땅(밝은 잔디/어두운 잔디/흙바닥+패치)을 그대로 재현한다.
 */
export default function DinoRunnerScene({ phase, score, hearts, onHit, onScoreChange }: DinoRunnerSceneProps) {
  const engine = useDinoEngine({ phase, onHit, onScoreChange });
  const gesture = useDinoGestures(engine);

  return (
    <GestureDetector gesture={gesture}>
      <View className="relative h-full w-full overflow-hidden">
        <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          <Defs>
            <LinearGradient id="dinoSky" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={sceneColors.sky} />
              <Stop offset="1" stopColor={sceneColors.skyFade} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#dinoSky)" />
        </Svg>

        <View className="absolute left-[37px] top-[99px]">
          <CloudMediumIcon />
        </View>
        <View className="absolute left-[226px] top-[129px]">
          <CloudLargeIcon />
        </View>
        <View className="absolute left-[100px] top-[164px]">
          <CloudSmallIcon />
        </View>

        <DinoGround />

        <PlayerSprite playerY={engine.playerY} duckSquash={engine.duckSquash} />
        {engine.slots.map((slot, i) => (
          <ObstacleSlotView key={i} x={slot.x} kindFlag={slot.kindFlag} doughType={engine.doughTypes[i]} />
        ))}

        <InGameStats score={score} hearts={hearts} />
      </View>
    </GestureDetector>
  );
}
