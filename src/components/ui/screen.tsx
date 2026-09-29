import { cssInterop } from 'nativewind';
import type { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const InteropSafeAreaView = cssInterop(SafeAreaView, { className: 'style' });

interface ScreenProps {
  children: ReactNode;
  className?: string;
}

/** 화면 최상위 컨테이너. 상/하단 SafeArea 를 먹고 기본 배경색을 깐다. */
export default function Screen({
  children,
  className = 'flex-1 bg-default-bg',
}: ScreenProps) {
  return (
    <InteropSafeAreaView className={className} edges={['top', 'bottom']}>
      {children}
    </InteropSafeAreaView>
  );
}
