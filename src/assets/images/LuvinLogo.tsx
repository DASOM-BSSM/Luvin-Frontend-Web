import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';

const InteropImage = cssInterop(Image, { className: 'style' });

interface LuvinLogoProps {
  className?: string;
}

/** Luvin 워드마크. 기본 표시 크기는 77x32. */
export default function LuvinLogo({ className = 'h-[32px] w-[77px]' }: LuvinLogoProps) {
  return (
    <InteropImage
      className={className}
      source={require('@/src/assets/images/logo.png')}
      contentFit="contain"
      accessibilityLabel="Luvin"
    />
  );
}
