import { useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';

import { STEP_TRIGGER_DISTANCE } from '@/src/features/luvin-hell/games/bread-crossing/engine/constants';
import type { StepDirection } from '@/src/features/luvin-hell/games/bread-crossing/engine/types';

/**
 * 탭(전진) + 4방향 드래그(1회성 스텝) 합성 제스처.
 *
 * 공룡빵게임의 숙이기와 달리 **엣지 트리거**다: `fired` shared value 가드로 한 번의
 * 터치당 방향 판정이 정확히 1회만 발동하고, 드래그 거리에 비례해 계속 이동하지 않는다
 * (유저 스펙 "1입력=1스텝, 드래그거리 비례 이동 금지"). `onFinalize`에서 다음 터치를
 * 위해 리셋한다.
 *
 * `useMemo`는 React Compiler 자동 메모이제이션 예외(AGENTS.md §16) — Gesture 객체
 * identity가 GestureDetector 네이티브 핸들러 생명주기에 영향을 준다.
 */
export function useBreadCrossingGestures(commitStep: (direction: StepDirection) => void) {
  const fired = useSharedValue(false);

  return useMemo(() => {
    const swipeGesture = Gesture.Pan()
      .minDistance(STEP_TRIGGER_DISTANCE)
      .onUpdate((event) => {
        'worklet';
        if (fired.value) return;
        fired.value = true;
        const { translationX, translationY } = event;
        if (Math.abs(translationX) > Math.abs(translationY)) {
          runOnJS(commitStep)(translationX > 0 ? 'right' : 'left');
        } else if (translationY > 0) {
          runOnJS(commitStep)('back');
        }
      })
      .onFinalize(() => {
        'worklet';
        fired.value = false;
      });

    const tapGesture = Gesture.Tap().onEnd(() => {
      'worklet';
      runOnJS(commitStep)('forward');
    });

    return Gesture.Race(swipeGesture, tapGesture);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- commitStep은 ref만 참조하는 안정적 클로저, fired는 shared value
  }, []);
}
