import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';

const InteropImage = cssInterop(Image, { className: 'style' });

/** Figma 5735:3309를 회전·크롭까지 포함해 내보낸 실제 컵 에셋. */
export default function InfernoMiniGameCup() {
  return (
    <InteropImage
      source={require('@/src/assets/images/inferno-minigame-cup.png')}
      className="h-inferno-cup w-inferno-cup shrink-0"
      contentFit="contain"
      accessibilityLabel="뒤집힌 컵"
    />
  );
}
