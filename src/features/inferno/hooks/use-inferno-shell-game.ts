import { useEffect, useState } from 'react';
import { useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';

import {
  SHELL_LIFT_DISTANCE,
  SHELL_LIFT_MS,
  SHELL_REVEAL_DELAY_MS,
  SHELL_REVEAL_HOLD_MS,
  SHELL_SWAP_COUNT,
  SHELL_SWAP_MS,
} from '@/src/features/inferno/constants/animation';

const CUP_COUNT = 3;
const SLOT_STEP = 170;

export type InfernoShellPhase = 'revealing' | 'shuffling' | 'choosing' | 'success' | 'failure';

export interface InfernoShellCupState {
  id: number;
  isTarget: boolean;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
}

interface InfernoShellGame {
  phase: InfernoShellPhase;
  cups: InfernoShellCupState[];
  handleCupPress: (cupId: number) => void;
  handleResultClose: () => void;
}

function pickSwapPair(previousPair: string): [number, number] {
  const pairs: [number, number][] = [
    [0, 1],
    [1, 2],
    [0, 2],
  ];
  const candidates = pairs.filter(([left, right]) => `${left}-${right}` !== previousPair);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/** Episode 03 야바위의 공개 → 섞기 → 선택 흐름. */
export default function useInfernoShellGame(): InfernoShellGame {
  const [phase, setPhase] = useState<InfernoShellPhase>('revealing');
  const [targetCupId] = useState(() => Math.floor(Math.random() * CUP_COUNT));

  // 컵 수는 컴파일타임 상수다. 각 컵의 이동값은 렌더 사이에도 같은 shared value를 유지한다.
  // eslint-disable-next-line react-hooks/rules-of-hooks -- CUP_COUNT가 고정이라 훅 순서가 바뀌지 않는다.
  const cupX0 = useSharedValue(0);
  const cupX1 = useSharedValue(0);
  const cupX2 = useSharedValue(0);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const cupY0 = useSharedValue(0);
  const cupY1 = useSharedValue(0);
  const cupY2 = useSharedValue(0);
  const cupXs = [cupX0, cupX1, cupX2];
  const cupYs = [cupY0, cupY1, cupY2];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const positions = [0, 1, 2];

    function schedule(callback: () => void, delayMs: number) {
      timers.push(setTimeout(callback, delayMs));
    }

    schedule(() => {
      cupYs[targetCupId].value = withTiming(-SHELL_LIFT_DISTANCE, { duration: SHELL_LIFT_MS });
    }, SHELL_REVEAL_DELAY_MS);

    const coverAt = SHELL_REVEAL_DELAY_MS + SHELL_LIFT_MS + SHELL_REVEAL_HOLD_MS;
    schedule(() => {
      cupYs[targetCupId].value = withTiming(0, { duration: SHELL_LIFT_MS });
      setPhase('shuffling');
    }, coverAt);

    let previousPair = '';
    for (let index = 0; index < SHELL_SWAP_COUNT; index += 1) {
      const pair = pickSwapPair(previousPair);
      previousPair = `${pair[0]}-${pair[1]}`;
      const swapAt = coverAt + SHELL_LIFT_MS + index * SHELL_SWAP_MS;

      schedule(() => {
        const [firstCupId, secondCupId] = pair;
        [positions[firstCupId], positions[secondCupId]] = [
          positions[secondCupId],
          positions[firstCupId],
        ];
        cupXs[firstCupId].value = withTiming((positions[firstCupId] - firstCupId) * SLOT_STEP, {
          duration: SHELL_SWAP_MS,
        });
        cupXs[secondCupId].value = withTiming((positions[secondCupId] - secondCupId) * SLOT_STEP, {
          duration: SHELL_SWAP_MS,
        });
      }, swapAt);
    }

    const chooseAt = coverAt + SHELL_LIFT_MS + SHELL_SWAP_COUNT * SHELL_SWAP_MS;
    schedule(() => setPhase('choosing'), chooseAt);

    return () => timers.forEach(clearTimeout);
  }, [cupX0, cupX1, cupX2, cupY0, cupY1, cupY2, targetCupId]);

  function handleCupPress(cupId: number) {
    if (phase !== 'choosing') return;

    cupYs[cupId].value = withTiming(-SHELL_LIFT_DISTANCE, { duration: SHELL_LIFT_MS });
    setTimeout(() => setPhase(cupId === targetCupId ? 'success' : 'failure'), SHELL_LIFT_MS);
  }

  function handleResultClose() {
    cupYs.forEach((translateY) => {
      translateY.value = withTiming(0, { duration: SHELL_LIFT_MS });
    });
    setPhase('choosing');
  }

  return {
    phase,
    cups: cupXs.map((translateX, id) => ({
      id,
      isTarget: id === targetCupId,
      translateX,
      translateY: cupYs[id],
    })),
    handleCupPress,
    handleResultClose,
  };
}
