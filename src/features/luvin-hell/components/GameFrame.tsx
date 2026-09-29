import type { ReactNode } from 'react';
import { View } from 'react-native';

interface GameFrameProps {
  children: ReactNode;
}

/**
 * 게임 화면 공통 카드 프레임. Figma 목업 크기(340x555)를 그대로 쓴다.
 * 배경(하늘 그라디언트/도로 등)은 게임별 Scene 컴포넌트가 채운다 — 이 컴포넌트는 테두리/
 * 라운딩/클리핑만 책임진다.
 *
 * 내부에서만 absolute 레이아웃을 쓰는 예외가 있다(AGENTS.md §16의 스코프 한정 예외 —
 * 계획 문서 "엔진 아키텍처" 1번 참고): 스프라이트는 flex로 표현할 수 없어 각 Scene이
 * `relative` 컨테이너 + `absolute` 자식으로 그린다.
 */
export default function GameFrame({ children }: GameFrameProps) {
  return (
    <View className="relative h-[555px] w-[340px] self-center overflow-hidden rounded-[12px] border-4 border-default-bg">
      {children}
    </View>
  );
}
