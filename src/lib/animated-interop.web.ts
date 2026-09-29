import { cssInterop } from 'nativewind';
import Animated from 'react-native-reanimated';

/**
 * 웹에서 reanimated `Animated.View` 의 `className` 을 살린다(AGENTS.md §1). 네이티브는 `animated-interop.ts`(빈 모듈).
 *
 * NativeWind 는 웹에서 `cssInterop` 으로 등록된 컴포넌트만 `className` 을 CSS 클래스로 바꿔 준다. RN 기본
 * `View` 는 등록돼 있지만 reanimated 의 `Animated.View` 는 아니라서, 웹에서는 className 이 통째로 버려진다 —
 * 온보딩 빵 묶음(`bread-cluster.tsx`)의 absolute 배치가 사라져 이미지가 0 크기로 안 보이고, `button.tsx`
 * 의 둥근 모서리·배경색·폭도 사라진 게 실제 증상이었다.
 *
 * 웹의 `cssInterop` 은 컴포넌트를 전역으로 등록하므로(이후 모든 `<Animated.View className>` 에 적용)
 * `_layout.tsx` 에서 한 번만 import 한다. 네이티브에는 적용하지 않는다 — 네이티브의 cssInterop 스타일
 * 병합이 useAnimatedStyle 결과와 섞이면 크기/위치가 깨지는 게 실기기에서 확인됐다(`PlayerSprite.tsx` 주석).
 */
cssInterop(Animated.View, { className: 'style' });
