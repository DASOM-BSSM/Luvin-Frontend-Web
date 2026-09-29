import { View } from 'react-native';

import Button from '@/src/components/ui/button';
import Text from '@/src/components/ui/text';

/** 아직 감정일기를 시작하지 않았을 때의 카드. */
export default function DiaryStartCard() {
  return (
    <View className="w-full flex-col items-center justify-center gap-[8px] rounded-[8px] border border-default-gray px-[30px] py-[20px]">
      <Text variant="body-s" className="text-text-primary">
        그룹 친구들과 질문에 대한 의견을 나눠요
      </Text>
      <Button label="감정일기 시작하기" />
    </View>
  );
}
