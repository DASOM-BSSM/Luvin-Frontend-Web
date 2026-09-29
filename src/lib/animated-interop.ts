/**
 * 네이티브에서는 할 일이 없다 — 웹 전용 보정은 `animated-interop.web.ts` 참고.
 *
 * 네이티브는 지금 그대로 reanimated `Animated.View` 의 className 이 동작하고, 여기서 cssInterop 을 걸면
 * useAnimatedStyle 과의 스타일 병합이 깨진다(`PlayerSprite.tsx` 주석).
 */
export {};
