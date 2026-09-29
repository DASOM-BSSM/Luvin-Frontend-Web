import { View } from 'react-native';

import BreadCharacter from '@/src/assets/images/BreadCharacter';
import Text from '@/src/components/ui/text';
import type { BreadProfile } from '@/src/features/home/types';

interface MyProfileCardProps {
  profile: BreadProfile;
}

/** 내 분신 빵 프로필 카드. */
export default function MyProfileCard({ profile }: MyProfileCardProps) {
  return (
    <View className="w-full flex-row items-center gap-[16px] rounded-[8px] bg-yellow-200 p-[20px]">
      <BreadCharacter
        type={profile.type}
        state={profile.state}
        className="h-[45px] w-[76px]"
        accessibilityLabel={profile.name}
      />
      <View className="flex-1 flex-col items-start gap-[4px]">
        <Text variant="heading-h4" className="text-default-black">
          {profile.name}
        </Text>
        {profile.description ? (
          <Text variant="body-xs" className="text-default-black">
            {profile.description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
