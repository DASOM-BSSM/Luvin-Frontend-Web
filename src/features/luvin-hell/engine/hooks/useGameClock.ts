import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useFrameCallback } from 'react-native-reanimated';

/** dt 상한(ms). 백그라운드 복귀·UI스레드 stall 직후의 급격한 dt 스파이크로 장애물이
 * 충돌판정 없이 플레이어를 "통과"하는 것을 막는다(엔진 아키텍처 1번 참고). */
const MAX_DT_MS = 50;

/**
 * 게임 프레임 루프 공용 훅. `useFrameCallback`(reanimated, UI스레드) 기반으로 매 vsync
 * 클램프된 dt(초 단위)를 워클릿 콜백으로 전달한다. `active`가 꺼지면(phase !== 'playing'
 * 또는 앱이 백그라운드로 감) 콜백을 멈춘다.
 *
 * dt를 그대로 적분하고 별도 setInterval 스로틀은 두지 않는다 — 오브젝트 풀 규모(10~20)
 * 에서는 매프레임 비용이 낮다.
 */
export function useGameClock(onTick: (dtSeconds: number) => void, active: boolean): void {
  const frameCallback = useFrameCallback((info) => {
    'worklet';
    const rawDtMs = info.timeSincePreviousFrame ?? 16.7;
    const dtMs = Math.min(rawDtMs, MAX_DT_MS);
    onTick(dtMs / 1000);
  }, false);

  const isForeground = useRef(true);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      isForeground.current = state === 'active';
      frameCallback.setActive(active && isForeground.current);
    });
    return () => subscription.remove();
  }, [active, frameCallback]);

  useEffect(() => {
    frameCallback.setActive(active && isForeground.current);
  }, [active, frameCallback]);
}
