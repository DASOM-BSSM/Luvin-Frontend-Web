import { useEffect } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import PlayerAvatar from '@/src/assets/images/PlayerAvatar';
import {
  COLUMN_WIDTH,
  FRAME_HEIGHT,
  LANE_HEIGHT,
  LANE_ROTATION_RAD,
  PLAYER_ROW_FROM_BOTTOM,
} from '@/src/features/luvin-hell/games/bread-crossing/engine/constants';
import type { LaneDefinition } from '@/src/features/luvin-hell/games/bread-crossing/engine/types';

/** Figma "미니게임2"(5726:2608) 실제 Playing 화면, "image 51"(6307:8112) 노드 실측값. */
const PLAYER_WIDTH = 58;
const PLAYER_HEIGHT = 118;
/** 플레이어는 항상 이 화면 y좌표에 고정 — 카메라가 플레이어를 따라가는 대신, 레인이 흐른다. */
const PLAYER_SCREEN_Y = FRAME_HEIGHT - (PLAYER_ROW_FROM_BOTTOM + 1) * LANE_HEIGHT + (LANE_HEIGHT - PLAYER_HEIGHT) / 2;

interface PlayerTokenProps {
  column: number;
  /** 플레이어가 지금 서 있는 레인이 강(river)이면 그 레인 정의를 내려준다 — 뗏목과 같은
   * 속도로 좌우 드리프트를 더해 "뗏목에 실려 이동"하는 것처럼 보이게 한다. 강이 아니면
   * undefined — 드리프트 없음. */
  raftLane?: LaneDefinition;
}

/** 순수 reanimated Animated.View + style만 쓴다(className 섞으면 실기기에서 크기가 깨짐 — PlayerSprite 주석 참고). */
export default function PlayerToken({ column, raftLane }: PlayerTokenProps) {
  const x = useSharedValue(column * COLUMN_WIDTH + (COLUMN_WIDTH - PLAYER_WIDTH) / 2);
  const raftDrift = useSharedValue(0);
  const raftDriftY = useSharedValue(0);

  useEffect(() => {
    x.value = withTiming(column * COLUMN_WIDTH + (COLUMN_WIDTH - PLAYER_WIDTH) / 2, { duration: 120 });
  }, [column, x]);

  useEffect(() => {
    // 뗏목 위에 있을 때만 그 뗏목(`PeriodicRow`)과 정확히 같은 주기(period)로 드리프트를
    // 더한다 — `PeriodicRow`의 각 뗏목 사본도 매 주기 시작 지점으로 순간 복귀(sawtooth)하며
    // 반복하므로(끝없는 컨베이어 착시), 플레이어 드리프트도 같은 거리/시간으로 반복해야
    // 뗏목과 어긋나지 않는다. 레인이 바뀌면(뗏목에서 내리면) 0으로 되돌린다 — 판정(칸 점유
    // 여부)은 여전히 stepResolver가 스텝 시점에만 검사하므로 건드리지 않는다. 순수 시각 효과.
    raftDrift.value = 0;
    raftDriftY.value = 0;
    if (!raftLane) return;
    const periodPx = (raftLane.obstacleColumnSpan + raftLane.gapColumns) * COLUMN_WIDTH;
    const durationMs = ((raftLane.obstacleColumnSpan + raftLane.gapColumns) / raftLane.speedColumnsPerSec) * 1000;
    raftDrift.value = withRepeat(
      withTiming(raftLane.direction * periodPx, { duration: durationMs, easing: Easing.linear }),
      -1,
      false,
    );
    // 뗏목(PeriodicRow)이 이제 배경과 같은 각도로 대각선 이동하므로(§LaneSlotView
    // OBSTACLE_MOVE_SLOPE), 캐릭터도 같은 기울기만큼 세로로 같이 밀려야 뗏목 위에 그대로
    // 서 있는 것처럼 보인다 — 같은 duration/easing으로 동시에 시작해서 위상이 어긋나지 않는다.
    raftDriftY.value = withRepeat(
      withTiming(raftLane.direction * periodPx * Math.tan(LANE_ROTATION_RAD), { duration: durationMs, easing: Easing.linear }),
      -1,
      false,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- raftLane이 바뀔 때만 다시 건다(레인 전체 객체가 매 렌더 새로 만들어지므로 laneIndex로 비교)
  }, [raftLane?.laneIndex]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value + raftDrift.value },
      { translateY: raftDriftY.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        { position: 'absolute', top: PLAYER_SCREEN_Y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT, zIndex: 10 },
        style,
      ]}
    >
      <PlayerAvatar facing="back" className="h-full w-full" />
    </Animated.View>
  );
}
