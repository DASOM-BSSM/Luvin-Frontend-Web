import { useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';

import {
  DUCK_HORIZONTAL_TOLERANCE,
  DUCK_TRIGGER_OFFSET,
} from '@/src/features/luvin-hell/games/dino-runner/engine/constants';
import type { DinoEngine } from '@/src/features/luvin-hell/games/dino-runner/hooks/useDinoEngine';

/**
 * 탭(점프) + 아래드래그(숙이기, 누르는 동안 유지) 합성 제스처.
 * `Gesture.Race` — 먼저 활성화되는 쪽이 이기고 나머지를 취소하므로 짧은 탭과 실제
 * 드래그가 자연히 구분된다. 숙이기는 레벨 트리거(누르는 동안 계속 반영, 뗄 때 해제).
 *
 * `useMemo`는 React Compiler 자동 메모이제이션 예외(AGENTS.md §16) — 합성된 Gesture
 * 객체의 identity가 GestureDetector의 네이티브 핸들러 생명주기에 영향을 준다.
 */
export function useDinoGestures({ triggerJump, setDucking }: Pick<DinoEngine, 'triggerJump' | 'setDucking'>) {
  return useMemo(() => {
    const tapGesture = Gesture.Tap().onEnd(() => {
      'worklet';
      triggerJump();
    });

    const duckGesture = Gesture.Pan()
      .activeOffsetY(DUCK_TRIGGER_OFFSET)
      .failOffsetX([-DUCK_HORIZONTAL_TOLERANCE, DUCK_HORIZONTAL_TOLERANCE])
      .onUpdate((event) => {
        'worklet';
        setDucking(event.translationY > 0);
      })
      .onFinalize(() => {
        'worklet';
        setDucking(false);
      });

    return Gesture.Race(duckGesture, tapGesture);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- triggerJump/setDucking는 shared value만 닫아 두는 안정적 워클릿
  }, []);
}
