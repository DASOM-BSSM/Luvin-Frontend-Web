import { Fragment, useEffect } from 'react';
import { Image as RNImage, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Image as SvgImage, Rect } from 'react-native-svg';

import BreadCharacter from '@/src/assets/images/BreadCharacter';
import { defaultColor, state as stateColors } from '@/src/constants/colors';
import { sceneColors } from '@/src/features/luvin-hell/constants/scene-colors';
import {
  BACKGROUND_EXTRA_BEHIND_SLOTS,
  BAGUETTE_INTRINSIC_TILT_DEG,
  COLUMN_WIDTH,
  FRAME_HEIGHT,
  FRAME_WIDTH,
  LANE_HEIGHT,
  LANE_ROTATION_DEG,
  LANE_ROTATION_RAD,
  LANE_STACK_CENTER_X,
  LANE_STACK_CENTER_Y,
  LANE_STACK_LEFT,
  LANE_STACK_WIDTH,
  LANES_BEHIND_PLAYER,
  OBSTACLE_ROW_MARGIN,
  OBSTACLE_SPRITE_SIZE,
  PLAYER_ROW_FROM_BOTTOM,
  POOL_SIZE,
  RAFT_HEIGHT,
  RAIL_SAFE_DURATION_SEC,
  RAIL_SIGNAL_BOX_HEIGHT,
  RAIL_SIGNAL_BOX_WIDTH,
  RAIL_SIGNAL_LIGHT_SIZE,
  RAIL_SIGNAL_POLE_HEIGHT,
  RAIL_SIGNAL_POLE_WIDTH,
  RAIL_SIGNAL_X_FRACTION,
  RAIL_SIGNAL_Y_FRACTION,
  RAIL_TRAIN_CAR_COUNT,
  RAIL_TRAIN_CAR_OVERLAP,
  RAIL_TRAIN_CAR_SIZE,
  RAIL_TRAIN_ROTATION_DEG,
  RAIL_WAVE_DURATION_SEC,
} from '@/src/features/luvin-hell/games/bread-crossing/engine/constants';
import { getObstacleCycle } from '@/src/features/luvin-hell/games/bread-crossing/engine/laneOccupancy';
import { laneSlotIndex } from '@/src/features/luvin-hell/games/bread-crossing/engine/pool';
import type { LaneDefinition } from '@/src/features/luvin-hell/games/bread-crossing/engine/types';

interface LaneSlotViewProps {
  laneIndex: number;
  lane: LaneDefinition | undefined;
  /** 화면 y좌표. Scene이 플레이어 기준 상대 위치로 계산해 내려준다. */
  y: number;
}

const RAIL_SLEEPER_COUNT = 10;
const ROAD_DASH_FRACTIONS = [0.2, 0.5, 0.8];

/** 기차 전용 바게트 스프라이트의 실제 파일 URI. SVG `<Image>`는 RN `require()` 숫자 id가
 * 아니라 URI 문자열을 받으므로 `resolveAssetSource`로 변환해 모듈 로드 시점에 한 번만 구한다. */
const BAGUETTE_URI = RNImage.resolveAssetSource(require('@/src/assets/images/dough_baguette.png')).uri;

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function bandColor(lane: LaneDefinition): string {
  if (lane.type === 'grass') return sceneColors.grass;
  if (lane.type === 'river') return sceneColors.river;
  return sceneColors.trackBase;
}

/**
 * 기찻길 전용 "바게트 4개 연결" 기차. 안전구간에는 안 보이고, wave 구간에만 화면을 빠르게
 * 가로질러 지나간다 — 판정(안전/위험)은 여전히 stepResolver의 시간 기반 안전창 로직을 그대로
 * 쓰고, 이 컴포넌트는 그 wave를 시각적으로 표현만 한다. 바게트 4개는 간격 없이 옆면이 겹치게
 * (`RAIL_TRAIN_CAR_OVERLAP`) 나란히 놓고, 그 줄 전체를 `RAIL_TRAIN_ROTATION_DEG`(-43.02도)
 * 만큼 통째로 회전시킨다 — 개별 바게트가 아니라 연결된 기차 전체에 회전을 건다.
 *
 * (구현 메모) RN `View` + `Animated.View`(rotate + opacity 애니메이션)로 구현했을 때,
 * `overflow:hidden`인 `LaneSlotView`/`GameFrame` 밖으로 안드로이드 실기기에서 렌더링이
 * 새는 버그를 반복적으로 확인했다(`collapsable={false}`, `renderToHardwareTextureAndroid`
 * 로도 해결 안 됨) — 배경(`LaneStackBackground`)과 동일하게 `react-native-svg`로 그려서
 * 이 문제 자체를 원천 차단한다. `<G>`(그룹) 하나에 회전+애니메이션 opacity/위치를 한 번에
 * 걸고, 그 안에 바게트 4장을 정적으로 배치한다.
 */
function BaguetteTrainSvg({ lane, laneTop }: { lane: LaneDefinition; laneTop: number }) {
  const cycleMs = (RAIL_SAFE_DURATION_SEC + RAIL_WAVE_DURATION_SEC) * 1000;
  const waveStartMs = RAIL_SAFE_DURATION_SEC * 1000;
  const clock = useSharedValue(lane.phaseOffset * 1000);
  const trainWidth = RAIL_TRAIN_CAR_COUNT * (RAIL_TRAIN_CAR_SIZE - RAIL_TRAIN_CAR_OVERLAP) + RAIL_TRAIN_CAR_OVERLAP;
  const rowCenterX = trainWidth / 2;
  const rowCenterY = RAIL_TRAIN_CAR_SIZE / 2;
  const rowTop = laneTop + (LANE_HEIGHT - RAIL_TRAIN_CAR_SIZE) / 2;

  useEffect(() => {
    clock.value = withRepeat(withTiming(clock.value + cycleMs, { duration: cycleMs, easing: Easing.linear }), -1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- lane이 바뀔 때만 다시 건다
  }, [lane.laneIndex]);

  // (구현 메모) `transform`을 SVG 문법 문자열("rotate(deg cx cy)")로 만들어 useAnimatedProps에
  // 넘기면 안 된다 — Reanimated는 prop 이름이 "transform"이면 컴포넌트 종류와 무관하게 항상
  // 자신의 CSS transform 문자열 파서(processTransform)를 강제로 거치는데, 이 파서는
  // "rotate(30deg)" 같은 CSS 문법만 이해하고 SVG의 "rotate(deg cx cy)"(공백 구분, 회전축 포함)
  // 형태를 이해하지 못해 즉시 "[Reanimated] Invalid transform property"로 크래시한다(실기기 확인).
  // 반면 값이 배열이면 processTransform이 그대로 통과시키고, react-native-svg도 RN 스타일
  // transform 배열(`{translateX}`/`{rotate: 'Ndeg'}` 등)을 그대로 지원하므로, 회전축(cx, cy)
  // 중심 회전을 translate-rotate-translate로 직접 분해한 배열을 만들어 이 문제를 피한다.
  const animatedProps = useAnimatedProps(() => {
    const t = clock.value % cycleMs;
    const isWave = t >= waveStartMs;
    const progress = isWave ? (t - waveStartMs) / (cycleMs - waveStartMs) : 0;
    const x = -trainWidth + progress * (FRAME_WIDTH + trainWidth * 2);
    return {
      opacity: isWave ? 1 : 0,
      transform: [
        { translateX: x },
        { translateY: rowTop },
        { translateX: rowCenterX },
        { translateY: rowCenterY },
        { rotate: `${RAIL_TRAIN_ROTATION_DEG}deg` },
        { translateX: -rowCenterX },
        { translateY: -rowCenterY },
      ],
    };
  });

  return (
    <AnimatedG animatedProps={animatedProps}>
      {Array.from({ length: RAIL_TRAIN_CAR_COUNT }, (_, i) => {
        const carX = i * (RAIL_TRAIN_CAR_SIZE - RAIL_TRAIN_CAR_OVERLAP);
        const carCenterX = carX + RAIL_TRAIN_CAR_SIZE / 2;
        const carCenterY = RAIL_TRAIN_CAR_SIZE / 2;
        return (
          <SvgImage
            key={i}
            href={BAGUETTE_URI}
            x={carX}
            y={0}
            width={RAIL_TRAIN_CAR_SIZE}
            height={RAIL_TRAIN_CAR_SIZE}
            // 정적(비-애니메이션) prop이라 react-native-svg 자체의 SVG transform 파싱을
            // 그대로 타서 안전하다(useAnimatedProps로 넘길 때만 Reanimated의 CSS 파서와
            // 충돌한다 — 위 AnimatedG의 animatedProps 주석 참고). 각 바게트 이미지 자체의
            // 내재 기울기(BAGUETTE_INTRINSIC_TILT_DEG)를 자기 중심 기준으로 먼저 상쇄해서
            // "진짜 가로로 누운" 상태로 만든다 — 이 상쇄 없이 그룹 회전만 걸면 두 각도가
            // 더해져 기차가 거의 세로로 서 보인다(§constants.ts 주석 참고).
            transform={`rotate(${-BAGUETTE_INTRINSIC_TILT_DEG} ${carCenterX} ${carCenterY})`}
          />
        );
      })}
    </AnimatedG>
  );
}

/**
 * 기찻길 신호기(기둥+박스+불빛). Figma에서는 기찻길 레인 자체가 아니라 그 바로 앞(플레이어
 * 쪽) 초원 레인 위에 딱 1개만 놓여 있다. `BaguetteTrain`과 같은 이유로 SVG로 그린다.
 * 안전구간엔 초록, wave 구간엔 빨강으로 바뀌는데, 기차와 같은 안전구간/wave 주기를 그
 * 기찻길 레인의 `phaseOffset`으로 독립적으로 돌려서 항상 기차 등장 타이밍과 맞아떨어지게
 * 한다(판정 자체는 여전히 stepResolver의 시간 기반 계산을 쓴다 — 이 컴포넌트는 시각 표현
 * 전용). 초록(안전) 색은 Figma 목업이 wave 순간만 캡처해 둬서 실제 값이 없어 디자인
 * 시스템의 `state.success`를 재사용한다. 빨강은 Figma 신호기 자산에 박혀 있던
 * `state.error`(#FF0030) 그대로다.
 */
function RailSignalSvg({ railLane, x, y }: { railLane: LaneDefinition; x: number; y: number }) {
  const cycleMs = (RAIL_SAFE_DURATION_SEC + RAIL_WAVE_DURATION_SEC) * 1000;
  const waveStartMs = RAIL_SAFE_DURATION_SEC * 1000;
  const clock = useSharedValue(railLane.phaseOffset * 1000);

  useEffect(() => {
    clock.value = withRepeat(withTiming(clock.value + cycleMs, { duration: cycleMs, easing: Easing.linear }), -1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- railLane이 바뀔 때만 다시 건다
  }, [railLane.laneIndex]);

  const animatedProps = useAnimatedProps(() => {
    const t = clock.value % cycleMs;
    const isSafe = t < waveStartMs;
    return { fill: isSafe ? stateColors.success : stateColors.error };
  });

  const boxLeft = x - (RAIL_SIGNAL_BOX_WIDTH - RAIL_SIGNAL_POLE_WIDTH) / 2;

  return (
    <Fragment>
      <Rect x={x} y={y} width={RAIL_SIGNAL_POLE_WIDTH} height={RAIL_SIGNAL_POLE_HEIGHT} fill={sceneColors.signWhite} />
      <Rect x={boxLeft} y={y} width={RAIL_SIGNAL_BOX_WIDTH} height={RAIL_SIGNAL_BOX_HEIGHT} rx={2} fill={defaultColor.black} />
      <AnimatedCircle
        cx={x + RAIL_SIGNAL_POLE_WIDTH / 2}
        cy={y + RAIL_SIGNAL_BOX_HEIGHT / 2}
        r={RAIL_SIGNAL_LIGHT_SIZE / 2}
        animatedProps={animatedProps}
      />
    </Fragment>
  );
}

/**
 * 지형 배경 스택 + 기차/신호기 — 풀에 동시에 마운트된 `POOL_SIZE`개 레인을 이어 붙인 큰
 * 직사각형 하나를 통째로 13.08도 회전시켜 대각선 도로처럼 보이게 한다(§engine/constants.ts
 * 구현 메모 참고 — 레인 하나씩 따로 회전시키면 각도가 거의 안 보인다). 기차/신호기도 이제
 * 여기서 SVG로 함께 그린다(위 각 컴포넌트 주석 참고 — 안드로이드 클리핑 누수 버그 회피).
 * `BreadCrossingScene`에서 레인 오버레이(장애물, `LaneSlotView`)와 별개로 딱 한 번만
 * 렌더링한다.
 */
/** 풀 슬롯 s의 회전 전 밴드 top-y. 플레이어 슬롯(`LANES_BEHIND_PLAYER`)이 파이벗(`LANE_STACK_CENTER_Y`)
 * 자리에 오고, 그보다 앞/뒤 슬롯은 그 파이벗에서 `LANE_HEIGHT`씩 떨어진 자리에 놓인다
 * (§engine/constants.ts `LANE_STACK_CENTER_Y` 주석 참고 — 부호 오류 재발 방지용 단일 지점). */
function laneStackBandTop(slot: number): number {
  return LANE_STACK_CENTER_Y + (LANES_BEHIND_PLAYER - slot) * LANE_HEIGHT - LANE_HEIGHT / 2;
}

export function LaneStackBackground({
  windowStart,
  laneAt,
}: {
  windowStart: number;
  laneAt: (laneIndex: number) => LaneDefinition | undefined;
}) {
  const rotateTransform = `rotate(${LANE_ROTATION_DEG} ${LANE_STACK_CENTER_X} ${LANE_STACK_CENTER_Y})`;
  // 배경 밴드만 -BACKGROUND_EXTRA_BEHIND_SLOTS..POOL_SIZE-1 범위로 그린다(§engine/constants.ts
  // `BACKGROUND_EXTRA_BEHIND_SLOTS` 주석 참고 — 프레임 좌하단 모서리가 흰 배경으로 비치는
  // 것을 막기 위함). 장애물/기차/신호기 오버레이는 아래에서 그대로 원래 POOL_SIZE 범위만 쓴다.
  const backgroundSlots = Array.from(
    { length: POOL_SIZE + BACKGROUND_EXTRA_BEHIND_SLOTS },
    (_, i) => i - BACKGROUND_EXTRA_BEHIND_SLOTS,
  );

  return (
    <Svg width={FRAME_WIDTH} height={FRAME_HEIGHT} style={{ position: 'absolute', top: 0, left: 0 }}>
      {backgroundSlots.map((slot) => {
        const laneIndex = windowStart + slot;
        const lane = laneAt(laneIndex);
        if (!lane) return null;
        const laneTop = laneStackBandTop(slot);

        return (
          <Rect
            key={`bg-${slot}`}
            x={LANE_STACK_LEFT}
            y={laneTop}
            width={LANE_STACK_WIDTH}
            height={LANE_HEIGHT}
            fill={bandColor(lane)}
            transform={rotateTransform}
          />
        );
      })}
      {backgroundSlots.map((slot) => {
        const laneIndex = windowStart + slot;
        const lane = laneAt(laneIndex);
        if (!lane || lane.type !== 'rail') return null;
        const laneTop = laneStackBandTop(slot);

        return (
          <Fragment key={`bg-${slot}`}>
            <Rect
              x={LANE_STACK_LEFT}
              y={laneTop + 0.2 * LANE_HEIGHT}
              width={LANE_STACK_WIDTH}
              height={4}
              fill={sceneColors.trackAccent}
              transform={rotateTransform}
            />
            <Rect
              x={LANE_STACK_LEFT}
              y={laneTop + 0.68 * LANE_HEIGHT}
              width={LANE_STACK_WIDTH}
              height={4}
              fill={sceneColors.trackAccent}
              transform={rotateTransform}
            />
            {Array.from({ length: RAIL_SLEEPER_COUNT }, (_, i) => (
              <Rect
                key={i}
                x={LANE_STACK_LEFT + (i + 0.5) * (LANE_STACK_WIDTH / RAIL_SLEEPER_COUNT) - 4}
                y={laneTop + 0.15 * LANE_HEIGHT}
                width={8}
                height={0.7 * LANE_HEIGHT}
                fill={sceneColors.woodAccent}
                transform={rotateTransform}
              />
            ))}
          </Fragment>
        );
      })}
      {backgroundSlots.map((slot) => {
        const laneIndex = windowStart + slot;
        const lane = laneAt(laneIndex);
        if (!lane || lane.type !== 'road') return null;
        const laneTop = laneStackBandTop(slot);

        return (
          <Fragment key={`bg-${slot}`}>
            {ROAD_DASH_FRACTIONS.map((frac, i) => (
              <Rect
                key={i}
                x={LANE_STACK_LEFT + frac * LANE_STACK_WIDTH - 20}
                y={laneTop + 0.46 * LANE_HEIGHT}
                width={40}
                height={5}
                fill={sceneColors.trackAccent}
                transform={rotateTransform}
              />
            ))}
          </Fragment>
        );
      })}
      {/* 기차/신호기는 실제 화면 y좌표(회전 없는 오버레이 좌표계, `LaneSlotView`/`PlayerToken`과
          동일한 `laneScreenY` 계산)에 그린다 — Figma에서도 개별 오브젝트는 밴드 회전과 무관하게
          놓인다. `windowStart = playerLane - LANES_BEHIND_PLAYER`이므로 playerLane을 역산한다. */}
      {(() => {
        const playerLane = windowStart + LANES_BEHIND_PLAYER;
        const playerAnchorY = FRAME_HEIGHT - (PLAYER_ROW_FROM_BOTTOM + 1) * LANE_HEIGHT;
        const laneScreenY = (laneIndex: number) => playerAnchorY - (laneIndex - playerLane) * LANE_HEIGHT;

        return Array.from({ length: POOL_SIZE }, (_, i) => windowStart + i).map((laneIndex) => {
          const lane = laneAt(laneIndex);
          if (!lane) return null;
          const nextLane = laneAt(laneIndex + 1);
          const y = laneScreenY(laneIndex);

          return (
            <Fragment key={`overlay-${laneSlotIndex(laneIndex)}`}>
              {lane.type === 'rail' && <BaguetteTrainSvg lane={lane} laneTop={y} />}
              {lane.type === 'grass' && nextLane?.type === 'rail' && (
                <RailSignalSvg
                  railLane={nextLane}
                  x={FRAME_WIDTH * RAIL_SIGNAL_X_FRACTION}
                  y={y + LANE_HEIGHT * RAIL_SIGNAL_Y_FRACTION - RAIL_SIGNAL_POLE_HEIGHT / 2}
                />
              )}
            </Fragment>
          );
        });
      })()}
    </Svg>
  );
}

const OBSTACLE_ROW_HEIGHT = LANE_HEIGHT + 2 * OBSTACLE_ROW_MARGIN;
const OBSTACLE_ROW_CENTER_Y = OBSTACLE_ROW_MARGIN + LANE_HEIGHT / 2;
/** 배경 회전과 정확히 같은 각도로 이동하게 하는 기울기(dy/dx) — item 1: 장애물이 배경과 다른
 * 방향(수평)으로 움직이던 버그의 원인이 바로 이 각도를 아예 쓰지 않고 translateX만 줬던 것. */
const OBSTACLE_MOVE_SLOPE = Math.tan(LANE_ROTATION_RAD);

/**
 * 도로 차량 빵 / 강 뗏목. `getObstacleCycle`로 판정(`laneOccupancy`)과 완전히 같은
 * 오프셋/주기를 읽어서 그린다 — road는 이제 한 주기 안에 여러 대(간격에 지터 있음)가 들어
 * 있어 "기차처럼" 보이지 않는다(§constants.ts `ROAD_OBSTACLES_PER_CYCLE`). 이동은 순수
 * translateX가 아니라 배경과 같은 각도(`OBSTACLE_MOVE_SLOPE`)만큼 translateY를 더해 대각선
 * 으로 흐르게 하고, 각 사본(copy)마다 자기 x좌표에 비례하는 정적 세로 오프셋을 미리 깔아둬서
 * (애니메이션이 한 주기 끝에서 순간 복귀해도) 화면에 보이는 대각선 줄이 끊기지 않게 한다.
 */
function PeriodicRow({ lane, isRaft }: { lane: LaneDefinition; isRaft: boolean }) {
  const { offsets, cycleColumns } = getObstacleCycle(lane);
  const periodPx = cycleColumns * COLUMN_WIDTH;
  const durationMs = (cycleColumns / lane.speedColumnsPerSec) * 1000;
  const offset = useSharedValue(lane.phaseOffset * periodPx);
  const raftWidth = lane.obstacleColumnSpan * COLUMN_WIDTH;

  useEffect(() => {
    offset.value = lane.phaseOffset * periodPx;
    offset.value = withRepeat(
      withTiming(offset.value + lane.direction * periodPx, { duration: durationMs, easing: Easing.linear }),
      -1,
      false,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- lane 값이 바뀔 때만 애니메이션을 다시 건다
  }, [lane.laneIndex, lane.type]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }, { translateY: offset.value * OBSTACLE_MOVE_SLOPE }],
  }));

  const copies = Math.ceil(FRAME_WIDTH / periodPx) + 2;

  return (
    <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, style]}>
      {Array.from({ length: copies }, (_, i) => {
        const tileLeft = i * periodPx - periodPx;
        return offsets.map((colOffset, j) => {
          const leftBase = tileLeft + colOffset * COLUMN_WIDTH;
          // 정적 세로 오프셋(leftBase * slope)과 애니메이션 translateY(offset.value * slope)를
          // 더하면 최종 y는 항상 (leftBase + offset.value) * slope — 즉 실제 최종 x좌표에
          // 정확히 비례해서, 주기 경계에서 순간 복귀가 일어나도 대각선이 끊기지 않는다.
          const staticTop = leftBase * OBSTACLE_MOVE_SLOPE;

          if (isRaft) {
            return (
              <View
                key={j}
                className="absolute"
                style={{
                  left: leftBase,
                  top: OBSTACLE_ROW_CENTER_Y - RAFT_HEIGHT / 2 + staticTop,
                  width: raftWidth,
                  height: RAFT_HEIGHT,
                  backgroundColor: sceneColors.woodAccent,
                }}
              >
                <View
                  className="absolute"
                  style={{ left: 6, right: 6, top: RAFT_HEIGHT * 0.26, height: 4, backgroundColor: sceneColors.woodAccentLight }}
                />
                <View
                  className="absolute"
                  style={{ left: 6, right: 6, top: RAFT_HEIGHT * 0.62, height: 4, backgroundColor: sceneColors.woodAccentLight }}
                />
              </View>
            );
          }

          const breadType = lane.doughTypes?.[j] ?? lane.doughType ?? 'donut';
          const left = leftBase + (COLUMN_WIDTH - OBSTACLE_SPRITE_SIZE) / 2;
          return (
            <View
              key={j}
              className="absolute"
              style={{
                left,
                top: OBSTACLE_ROW_CENTER_Y - OBSTACLE_SPRITE_SIZE / 2 + staticTop,
                width: OBSTACLE_SPRITE_SIZE,
                height: OBSTACLE_SPRITE_SIZE,
              }}
            >
              <BreadCharacter type={breadType} state="dough" className="h-full w-full" />
            </View>
          );
        });
      })}
    </Animated.View>
  );
}

/** 레인 하나의 "오버레이"(도로/강 장애물)만 그린다 — 배경과 기차/신호기는 `LaneStackBackground`
 * 가 SVG로 한 번에 그린다(§engine/constants.ts 구현 메모, 안드로이드 클리핑 누수 회피).
 * 장애물이 배경과 같은 각도로 대각선 이동하면서 커진 스프라이트 크기까지 넘칠 수 있어서,
 * 60px 딱 맞는 높이로 자르지 않고 `OBSTACLE_ROW_MARGIN`만큼 위아래 여유를 둔다. */
export default function LaneSlotView({ lane, y }: LaneSlotViewProps) {
  if (!lane) return null;

  return (
    <View className="absolute left-0 w-full" style={{ top: y - OBSTACLE_ROW_MARGIN, height: OBSTACLE_ROW_HEIGHT }}>
      {lane.type === 'road' && <PeriodicRow lane={lane} isRaft={false} />}
      {lane.type === 'river' && <PeriodicRow lane={lane} isRaft />}
    </View>
  );
}
