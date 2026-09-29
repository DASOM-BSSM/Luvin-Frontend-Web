import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';

const InteropImage = cssInterop(Image, { className: 'style' });

export type PlayerAvatarFacing = 'front' | 'back';

const SOURCES: Record<PlayerAvatarFacing, number> = {
  front: require('@/src/assets/images/avatar_girl_front.png'),
  back: require('@/src/assets/images/avatar_girl_back.png'),
};

interface PlayerAvatarProps {
  /** 공룡빵게임(옆에서 달려오는 걸 마주보는 화면)은 front, 빵건너친구들(위로 전진)은 back. */
  facing?: PlayerAvatarFacing;
  className?: string;
}

/** 러빈지옥 미니게임 플레이어 캐릭터 스프라이트. */
export default function PlayerAvatar({ facing = 'front', className = 'h-[90px] w-[60px]' }: PlayerAvatarProps) {
  return (
    <InteropImage
      className={className}
      source={SOURCES[facing]}
      contentFit="contain"
      accessibilityLabel="플레이어 캐릭터"
    />
  );
}
