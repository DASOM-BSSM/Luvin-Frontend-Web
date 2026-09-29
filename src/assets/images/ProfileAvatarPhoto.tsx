import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';

import type { Gender } from '@/src/features/my-page/types';

const InteropImage = cssInterop(Image, { className: 'style' });

/**
 * 마이페이지 아바타 사진. Figma "마이페이지"(6263:5785)/"내 정보 수정"(6300:8004)의 "내 프로필"
 * 카드 사진이 성별에 따라 다른 인물이라(여성=6271:6644, 남성=6310:8345 — 재확인 완료), 스토어의
 * `gender`(§ profile-settings-store)로 바로 매핑한다.
 */
const SOURCES: Record<Gender, number> = {
  female: require('@/src/assets/images/profile_avatar_female.png'),
  male: require('@/src/assets/images/profile_avatar_male.png'),
};

interface ProfileAvatarPhotoProps {
  gender: Gender;
}

export default function ProfileAvatarPhoto({ gender }: ProfileAvatarPhotoProps) {
  return (
    <InteropImage
      className="h-[84px] w-[84px] rounded-full"
      source={SOURCES[gender]}
      contentFit="cover"
      accessibilityLabel="내 프로필 사진"
    />
  );
}
