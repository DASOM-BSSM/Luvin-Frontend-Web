import { GestureDetector } from 'react-native-gesture-handler';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { state as stateColors } from '@/src/constants/colors';
import { InGameStats } from '@/src/features/luvin-hell/components/GameHud';
import {
  FRAME_HEIGHT,
  LANE_HEIGHT,
  LANES_BEHIND_PLAYER,
  OBSTACLE_ROW_MARGIN,
  PLAYER_ROW_FROM_BOTTOM,
  POOL_SIZE,
  START_LANE,
} from '@/src/features/luvin-hell/games/bread-crossing/engine/constants';
import type { LaneDefinition } from '@/src/features/luvin-hell/games/bread-crossing/engine/types';
import { laneSlotIndex } from '@/src/features/luvin-hell/games/bread-crossing/engine/pool';
import { useBreadCrossingEngine } from '@/src/features/luvin-hell/games/bread-crossing/hooks/useBreadCrossingEngine';
import { useBreadCrossingGestures } from '@/src/features/luvin-hell/games/bread-crossing/hooks/useBreadCrossingGestures';
import LaneSlotView, { LaneStackBackground } from '@/src/features/luvin-hell/games/bread-crossing/components/LaneSlotView';
import PlayerToken from '@/src/features/luvin-hell/games/bread-crossing/components/PlayerToken';
import type { GamePhase } from '@/src/features/luvin-hell/types';

interface BreadCrossingSceneProps {
  phase: GamePhase;
  hearts: number;
  onFail: () => void;
  onScoreChange: (highestLaneReached: number) => void;
}

const PLAYER_ANCHOR_Y = FRAME_HEIGHT - (PLAYER_ROW_FROM_BOTTOM + 1) * LANE_HEIGHT;

function laneScreenY(laneIndex: number, playerLane: number): number {
  return PLAYER_ANCHOR_Y - (laneIndex - playerLane) * LANE_HEIGHT;
}

/**
 * START_LANE(0) 아래는 엔진이 레인을 생성하지 않는다(후퇴 한계) — 게임 시작 직후 플레이어가
 * START_LANE에 있을 때, `PLAYER_ROW_FROM_BOTTOM`이 확보해 둔 "뒤쪽" 화면 행 몇 개가 대응되는
 * 레인이 아예 없어 배경이 그대로 노출된다(흰색 배경 노출 버그). 실제 지형처럼 판정에 관여하지
 * 않는, 렌더링 전용 초원 채움 레인으로 그 자리를 메운다.
 */
function makeStartFillerLane(laneIndex: number): LaneDefinition {
  return {
    laneIndex,
    type: 'grass',
    direction: 1,
    speedColumnsPerSec: 0,
    phaseOffset: 0,
    obstacleColumnSpan: 0,
    gapColumns: 0,
  };
}

/**
 * 빵건너친구들 플레이필드. 플레이어는 화면상 고정 행에 머물고, 레인이 위/아래로 흘러
 * 지나가는 것처럼 보이게 한다(카메라가 플레이어를 따라가는 대신 세계가 움직임).
 * `relative` 컨테이너 + `absolute` 자식 — AGENTS.md §16 스코프 한정 예외.
 */
export default function BreadCrossingScene({ phase, hearts, onFail, onScoreChange }: BreadCrossingSceneProps) {
  // 실패(장애물 충돌/빈 강)는 stepResolver→commitStep→onFail 한 경로로만 들어온다(§엔진,
  // 하트 로직 통합). 여기서 그 하나의 진입점에 짧은 빨간 플래시를 얹어 두 실패 케이스 모두
  // 동일한 시각 피드백을 받게 한다 — 공룡빵게임은 장애물이 사라지는 것으로 이미 피드백이
  // 있지만, 빵건너친구들은 하트만 조용히 줄어 "어색하다"는 피드백이 있었다.
  const hitFlash = useSharedValue(0);
  const handleFail = () => {
    hitFlash.value = withSequence(withTiming(0.45, { duration: 40 }), withTiming(0, { duration: 260 }));
    onFail();
  };

  const engine = useBreadCrossingEngine({ phase, onFail: handleFail, onScoreChange });
  const gesture = useBreadCrossingGestures(engine.commitStep);

  const flashStyle = useAnimatedStyle(() => ({ opacity: hitFlash.value }));

  // 실제 생성된 레인(engine.lanes)은 START_LANE부터지만, 화면 채우기는 그보다 뒤쪽 행도
  // 필요할 수 있다(위 makeStartFillerLane 주석 참고) — 그래서 여기 windowStart는 clamp하지
  // 않고, 엔진에 없는 index(< START_LANE)는 초원 채움 레인으로 대체한다.
  const windowStart = engine.position.lane - LANES_BEHIND_PLAYER;

  function laneAt(laneIndex: number): LaneDefinition | undefined {
    return laneIndex < START_LANE ? makeStartFillerLane(laneIndex) : engine.lanes[laneIndex];
  }

  return (
    <GestureDetector gesture={gesture}>
      <View className="relative h-full w-full overflow-hidden">
        <LaneStackBackground windowStart={windowStart} laneAt={laneAt} />

        {Array.from({ length: POOL_SIZE }, (_, i) => windowStart + i).map((laneIndex) => {
          const y = laneScreenY(laneIndex, engine.position.lane);
          // 화면 밖(위/아래로 한참 벗어난) 레인의 오버레이는 애초에 마운트하지 않는다 — 배경/
          // 기차/신호기는 이제 전부 SVG(`LaneStackBackground`)라 이 문제와 무관하지만, 도로/강
          // 장애물(`PeriodicRow`, Animated.View 기반)은 굳이 화면 밖까지 그릴 필요가 없다.
          // 장애물이 배경과 같은 각도로 대각선 이동하면서 `OBSTACLE_ROW_MARGIN`만큼 위아래로
          // 넘칠 수 있어(§engine/constants.ts), 컬링 임계값도 LANE_HEIGHT 대신 그만큼
          // 넉넉하게 잡아야 실제로 보이는 장애물을 너무 일찍 언마운트하지 않는다.
          if (y <= -LANE_HEIGHT - OBSTACLE_ROW_MARGIN || y >= FRAME_HEIGHT + OBSTACLE_ROW_MARGIN) return null;

          const lane = laneAt(laneIndex);

          return <LaneSlotView key={laneSlotIndex(laneIndex)} laneIndex={laneIndex} lane={lane} y={y} />;
        })}

        <PlayerToken
          column={engine.position.column}
          raftLane={laneAt(engine.position.lane)?.type === 'river' ? laneAt(engine.position.lane) : undefined}
        />

        <InGameStats score={engine.position.lane} hearts={hearts} />

        <Animated.View
          pointerEvents="none"
          style={[
            { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: stateColors.error },
            flashStyle,
          ]}
        />
      </View>
    </GestureDetector>
  );
}
