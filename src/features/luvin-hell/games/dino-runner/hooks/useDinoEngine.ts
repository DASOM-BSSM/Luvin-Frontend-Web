import { useMemo, useRef, useState } from 'react';
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import type { BreadType } from '@/src/assets/images/BreadCharacter';
import { isAabbOverlap, shrinkAabb } from '@/src/features/luvin-hell/engine/utils/collision';
import { useGameClock } from '@/src/features/luvin-hell/engine/hooks/useGameClock';
import { pickNextDoughType } from '@/src/features/luvin-hell/engine/utils/randomDough';
import {
  AIR_OBSTACLE_HEIGHT,
  AIR_OBSTACLE_MIN_SCORE,
  AIR_OBSTACLE_Y,
  DUCK_HEIGHT_RATIO,
  DUCK_SPRING_CONFIG,
  FRAME_WIDTH,
  GRAVITY,
  GROUND_OBSTACLE_HEIGHT,
  GROUND_Y,
  JUMP_VELOCITY,
  OBSTACLE_HITBOX_SCALE,
  OBSTACLE_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_HITBOX_SCALE,
  PLAYER_STAND_Y,
  PLAYER_WIDTH,
  PLAYER_X,
  POOL_SIZE,
  SCORE_UNIT_PX,
} from '@/src/features/luvin-hell/games/dino-runner/engine/constants';
import { AIR_KIND, findInactiveSlotIndex, GROUND_KIND, INACTIVE_KIND } from '@/src/features/luvin-hell/games/dino-runner/engine/pool';
import { computeCurrentSpeed, createInitialSpawnState, stepSpawnScheduler } from '@/src/features/luvin-hell/games/dino-runner/engine/spawner';
import type { GamePhase } from '@/src/features/luvin-hell/types';

export interface ObstacleSlot {
  x: SharedValue<number>;
  kindFlag: SharedValue<number>;
}

interface UseDinoEngineParams {
  phase: GamePhase;
  onHit: () => void;
  onScoreChange: (score: number) => void;
}

export interface DinoEngine {
  playerY: SharedValue<number>;
  duckSquash: SharedValue<number>;
  slots: ObstacleSlot[];
  /** 슬롯별 현재 반죽 종류(장애물 다양화). 스폰될 때만 갱신되는 React state — 매프레임 아님. */
  doughTypes: BreadType[];
  /** Tap 제스처(점프)에서 호출. 워클릿 함수. */
  triggerJump: () => void;
  /** Pan 제스처(숙이기)에서 호출. 워클릿 함수. */
  setDucking: (active: boolean) => void;
}

/**
 * 공룡빵게임 프레임 루프 오케스트레이터.
 *
 * 매프레임(useGameClock) 물리 적분 + 스폰 스케줄링 + 충돌판정을 워클릿 안에서 처리하고,
 * 하트감소/점수갱신 같은 드문 이산 이벤트만 runOnJS로 JS스레드(zustand)에 반영한다.
 * 움직이는 스프라이트 경로는 shared value만 건드리고 React 리렌더를 유발하지 않는다.
 */
export function useDinoEngine({ phase, onHit, onScoreChange }: UseDinoEngineParams): DinoEngine {
  const playerY = useSharedValue(PLAYER_STAND_Y);
  const velocityY = useSharedValue(0);
  const isGrounded = useSharedValue(1);
  const isDucking = useSharedValue(0);
  const duckSquash = useSharedValue(0);

  const distance = useSharedValue(0);
  const spawnState = useSharedValue(createInitialSpawnState());

  // POOL_SIZE 는 컴파일타임 상수라 훅 개수가 렌더마다 바뀌지 않는다 — 고정 크기 풀의 안전한 관용구.
  // eslint-disable-next-line react-hooks/rules-of-hooks -- ESLint 도입 시 이 규칙이 걸리면 여기 남길 주석
  const xs = Array.from({ length: POOL_SIZE }, () => useSharedValue(0));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const kindFlags = Array.from({ length: POOL_SIZE }, () => useSharedValue(INACTIVE_KIND));
  const slots: ObstacleSlot[] = xs.map((x, i) => ({ x, kindFlag: kindFlags[i] }));

  // 반죽 종류 다양화: 스폰(=낮은 빈도 이벤트)마다만 갱신되는 React state라 매프레임 리렌더는 없다.
  const [doughTypes, setDoughTypes] = useState<BreadType[]>(() => {
    const types: BreadType[] = [];
    let prev: BreadType | null = null;
    for (let i = 0; i < POOL_SIZE; i++) {
      const picked = pickNextDoughType(prev);
      types.push(picked);
      prev = picked;
    }
    return types;
  });
  const lastDoughTypeRef = useRef<BreadType | null>(doughTypes[POOL_SIZE - 1] ?? null);

  const assignDoughType = (slotIndex: number) => {
    const picked = pickNextDoughType(lastDoughTypeRef.current);
    lastDoughTypeRef.current = picked;
    setDoughTypes((prev) => {
      const next = [...prev];
      next[slotIndex] = picked;
      return next;
    });
  };

  const triggerJump = () => {
    'worklet';
    if (isGrounded.value === 1 && isDucking.value === 0) {
      velocityY.value = JUMP_VELOCITY;
      isGrounded.value = 0;
    }
  };

  const setDucking = (active: boolean) => {
    'worklet';
    isDucking.value = active ? 1 : 0;
    duckSquash.value = active
      ? withTiming(1, { duration: 80 })
      : withSpring(0, DUCK_SPRING_CONFIG);
  };

  const tick = (dtSeconds: number) => {
    'worklet';
    const dtMs = dtSeconds * 1000;

    // 1) 플레이어 물리(중력/점프) 적분
    velocityY.value += GRAVITY * dtSeconds;
    playerY.value += velocityY.value * dtSeconds;
    if (playerY.value >= PLAYER_STAND_Y) {
      playerY.value = PLAYER_STAND_Y;
      velocityY.value = 0;
      isGrounded.value = 1;
    }

    // 2) 난이도(속도) 계산 — 스포너 상태의 elapsedMs 기준(1프레임 지연, 무시 가능)
    const currentSpeed = computeCurrentSpeed(spawnState.value.elapsedMs);

    // 3) 생존거리 누적 → 점수(표시용 정수)는 useAnimatedReaction에서 별도로 미러링
    distance.value += currentSpeed * dtSeconds;

    // 4) 장애물 이동 + 화면 밖 제거
    for (let i = 0; i < POOL_SIZE; i++) {
      if (kindFlags[i].value === INACTIVE_KIND) continue;
      xs[i].value -= currentSpeed * dtSeconds;
      if (xs[i].value < -OBSTACLE_WIDTH) {
        kindFlags[i].value = INACTIVE_KIND;
      }
    }

    // 5) 스폰 판정 — 공중 장애물은 기록 AIR_OBSTACLE_MIN_SCORE 이상부터 후보에 포함.
    const currentScore = Math.floor(distance.value / SCORE_UNIT_PX);
    const allowAir = currentScore >= AIR_OBSTACLE_MIN_SCORE;
    const decision = stepSpawnScheduler(spawnState.value, dtMs, currentSpeed, allowAir);
    spawnState.value = decision.nextState;
    if (decision.shouldSpawn) {
      const snapshot = kindFlags.map((f) => f.value);
      const idx = findInactiveSlotIndex(snapshot);
      if (idx !== -1) {
        kindFlags[idx].value = decision.kind === 'ground' ? GROUND_KIND : AIR_KIND;
        xs[idx].value = FRAME_WIDTH;
        runOnJS(assignDoughType)(idx);
      }
    }

    // 6) 충돌판정
    const height = isGrounded.value === 1 && isDucking.value === 1
      ? PLAYER_HEIGHT * DUCK_HEIGHT_RATIO
      : PLAYER_HEIGHT;
    const y = isGrounded.value === 1 ? GROUND_Y - height : playerY.value;
    const playerBox = shrinkAabb({ x: PLAYER_X, y, width: PLAYER_WIDTH, height }, PLAYER_HITBOX_SCALE);

    for (let i = 0; i < POOL_SIZE; i++) {
      const kind = kindFlags[i].value;
      if (kind === INACTIVE_KIND) continue;
      const obstacleBox = shrinkAabb(
        kind === GROUND_KIND
          ? { x: xs[i].value, y: GROUND_Y - GROUND_OBSTACLE_HEIGHT, width: OBSTACLE_WIDTH, height: GROUND_OBSTACLE_HEIGHT }
          : { x: xs[i].value, y: AIR_OBSTACLE_Y, width: OBSTACLE_WIDTH, height: AIR_OBSTACLE_HEIGHT },
        OBSTACLE_HITBOX_SCALE,
      );

      if (isAabbOverlap(playerBox, obstacleBox)) {
        kindFlags[i].value = INACTIVE_KIND;
        runOnJS(onHit)();
      }
    }
  };

  useGameClock(tick, phase === 'playing');

  useAnimatedReaction(
    () => Math.floor(distance.value / SCORE_UNIT_PX),
    (curr, prev) => {
      if (curr !== prev) runOnJS(onScoreChange)(curr);
    },
  );

  return { playerY, duckSquash, slots, doughTypes, triggerJump, setDucking };
}
