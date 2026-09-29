import type { ReactNode } from 'react';
import { View } from 'react-native';

interface InfernoNoteCardProps {
  children: ReactNode;
}

/**
 * 러빈지옥 본문이 올라가는 흰 쪽지. Figma `쪽지` (6340:8360).
 *
 * 시안에서 781x300 인데, 300 은 상하 바(각 51)를 뺀 높이와 정확히 같고 781 은 좌우로
 * 46.5 씩 남긴 값이다. 그래서 고정 크기 대신 위아래를 꽉 채우고 좌우 여백만 준다.
 * 그 여백으로 뒤의 물방울 무늬가 비친다.
 *
 * 안쪽 정렬은 장면마다 달라서(인사말은 가운데, 안내문은 좌상단) 여기서 정하지 않는다.
 */
export default function InfernoNoteCard({ children }: InfernoNoteCardProps) {
  return (
    <View className="flex-1 overflow-hidden rounded-[8px] bg-default-white">{children}</View>
  );
}
