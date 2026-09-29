import { useEffect, useRef, useState } from 'react';

import {
  COLUMN_COUNT,
  LOOKAHEAD_LANES,
  START_COLUMN,
  START_LANE,
} from '@/src/features/luvin-hell/games/bread-crossing/engine/constants';
import { buildLanesForSegment } from '@/src/features/luvin-hell/games/bread-crossing/engine/laneFactory';
import { generateNextSegment } from '@/src/features/luvin-hell/games/bread-crossing/engine/terrainGenerator';
import { resolveStep } from '@/src/features/luvin-hell/games/bread-crossing/engine/stepResolver';
import type {
  LaneDefinition,
  PlayerGridPosition,
  StepDirection,
  TerrainType,
  WorldSnapshot,
} from '@/src/features/luvin-hell/games/bread-crossing/engine/types';
import type { GamePhase } from '@/src/features/luvin-hell/types';

const INITIAL_POSITION: PlayerGridPosition = { lane: START_LANE, column: START_COLUMN };

/** 시작 레인(0)은 항상 초원 — 안전 지대에서 출발한다. */
function seedLanes(): { lanes: Record<number, LaneDefinition>; history: TerrainType[] } {
  const lanes: Record<number, LaneDefinition> = {};
  const history: TerrainType[] = ['grass'];
  lanes[START_LANE] = buildLanesForSegment({ type: 'grass', length: 1 }, START_LANE)[0];

  let generatedUpTo = START_LANE;
  while (generatedUpTo < LOOKAHEAD_LANES) {
    const segment = generateNextSegment(history);
    history.push(segment.type);
    for (const lane of buildLanesForSegment(segment, generatedUpTo + 1)) {
      lanes[lane.laneIndex] = lane;
    }
    generatedUpTo += segment.length;
  }
  return { lanes, history: history.slice(-2) };
}

interface UseBreadCrossingEngineParams {
  phase: GamePhase;
  onFail: () => void;
  onScoreChange: (highestLaneReached: number) => void;
}

export interface BreadCrossingEngine {
  position: PlayerGridPosition;
  lanes: Record<number, LaneDefinition>;
  /** 제스처 → 이 함수 호출. React state 를 직접 읽지 않고 ref로만 최신 값을 참조해
   * 한 번만 만들어지는 제스처 클로저에서 호출해도 항상 최신 상태로 동작한다. */
  commitStep: (direction: StepDirection) => void;
}

/**
 * 빵건너친구들 엔진. 공룡빵게임과 달리 "이동할 때마다" 이산적으로만 판정하므로
 * useFrameCallback(매프레임 루프)이 필요 없다 — 레인 내부 시각 효과는 LaneSlotView가
 * 선언적 반복 애니메이션으로 따로 그린다(엔진 아키텍처 6번 참고).
 */
export function useBreadCrossingEngine({ phase, onFail, onScoreChange }: UseBreadCrossingEngineParams): BreadCrossingEngine {
  // lanes와 history는 같은 seedLanes() 호출 결과여야 서로 어긋나지 않는다 — 따로 호출하면
  // 각자 다른 난수 시퀀스로 생성돼 "동일 타입 연속 금지" 검사가 첫 경계에서 깨질 수 있다.
  const [initialSeed] = useState(() => seedLanes());
  const [position, setPosition] = useState<PlayerGridPosition>(INITIAL_POSITION);
  const [lanes, setLanes] = useState<Record<number, LaneDefinition>>(initialSeed.lanes);
  const [highestLaneReached, setHighestLaneReached] = useState(START_LANE);

  const runStartRef = useRef(Date.now());
  const historyRef = useRef<TerrainType[]>(initialSeed.history);
  const positionRef = useRef(position);
  const lanesRef = useRef(lanes);
  const highestLaneReachedRef = useRef(highestLaneReached);
  const phaseRef = useRef(phase);
  const onFailRef = useRef(onFail);
  const onScoreChangeRef = useRef(onScoreChange);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);
  useEffect(() => {
    lanesRef.current = lanes;
  }, [lanes]);
  useEffect(() => {
    highestLaneReachedRef.current = highestLaneReached;
  }, [highestLaneReached]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    onFailRef.current = onFail;
  }, [onFail]);
  useEffect(() => {
    onScoreChangeRef.current = onScoreChange;
  }, [onScoreChange]);

  // Ready 진입(재시작 포함) 시 완전 초기화.
  useEffect(() => {
    if (phase !== 'ready') return;
    const seeded = seedLanes();
    runStartRef.current = Date.now();
    historyRef.current = seeded.history;
    setPosition(INITIAL_POSITION);
    setHighestLaneReached(START_LANE);
    setLanes(seeded.lanes);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 재시작 트리거는 phase 전환 자체
  }, [phase]);

  function ensureLanesGenerated(uptoLaneIndex: number) {
    setLanes((prev) => {
      const generatedIndexes = Object.keys(prev).map(Number);
      let maxGenerated = generatedIndexes.length > 0 ? Math.max(...generatedIndexes) : -1;
      if (maxGenerated >= uptoLaneIndex) return prev;

      const next = { ...prev };
      while (maxGenerated < uptoLaneIndex) {
        const segment = generateNextSegment(historyRef.current);
        historyRef.current = [...historyRef.current, segment.type].slice(-2);
        for (const lane of buildLanesForSegment(segment, maxGenerated + 1)) {
          next[lane.laneIndex] = lane;
        }
        maxGenerated += segment.length;
      }
      return next;
    });
  }

  // commitStep 은 렌더 시점 값이 아니라 ref만 참조하므로, 한 번만 만들어지는(useMemo(...,[]))
  // 제스처 워클릿 안에서 이 함수를 그대로 캡처해 호출해도 항상 최신 상태로 동작한다.
  function commitStep(direction: StepDirection) {
    if (phaseRef.current !== 'playing') return;

    const elapsedMsSinceRunStart = Date.now() - runStartRef.current;
    const world: WorldSnapshot = {
      lanes: lanesRef.current,
      elapsedMsSinceRunStart,
      columnCount: COLUMN_COUNT,
    };
    const result = resolveStep(positionRef.current, direction, START_LANE, world, highestLaneReachedRef.current);

    setPosition(result.position);
    if (result.highestLaneReached !== highestLaneReachedRef.current) {
      setHighestLaneReached(result.highestLaneReached);
      onScoreChangeRef.current(result.highestLaneReached);
    }
    if (result.outcome !== 'safe') {
      onFailRef.current();
    }
    ensureLanesGenerated(result.position.lane + LOOKAHEAD_LANES);
  }

  return { position, lanes, commitStep };
}
