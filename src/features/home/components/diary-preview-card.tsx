import { View } from 'react-native';

import BreadCharacter from '@/src/assets/images/BreadCharacter';
import Text from '@/src/components/ui/text';
import type { DiaryPreview } from '@/src/features/home/types';

interface DiaryPreviewCardProps {
  diary: DiaryPreview;
}

/** 감정일기 미리보기 카드. */
export default function DiaryPreviewCard({ diary }: DiaryPreviewCardProps) {
  return (
    <View className="w-full flex-col items-start gap-[8px] rounded-[8px] border border-default-gray p-[12px]">
      <View className="flex-row items-center gap-[4px]">
        <BreadCharacter
          type={diary.authorType}
          state={diary.authorState}
          className="h-[17px] w-[22px]"
          accessibilityLabel={diary.authorName}
        />
        <Text variant="body-xxs" className="text-text-primary">
          {diary.authorName}
        </Text>
        <Text variant="body-xxs" className="text-text-muted">
          {diary.relativeTime}
        </Text>
      </View>
      <Text variant="body-xs" className="w-full text-text-primary">
        {diary.message}
      </Text>
    </View>
  );
}
