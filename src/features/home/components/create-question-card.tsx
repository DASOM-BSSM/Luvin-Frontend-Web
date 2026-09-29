import { View } from 'react-native';

import Button from '@/src/components/ui/button';
import Text from '@/src/components/ui/text';

/**
 * 일기 미리보기 아래에 붙는 질문 생성 유도 카드.
 */
export default function CreateQuestionCard() {
  return (
    <View className="w-full flex-col items-center justify-center gap-[8px] rounded-[8px] border border-default-gray p-[12px]">
      <Text variant="body-xs" className="text-text-primary">
        질문을 생성하여 친구들과 의견을 공유해요
      </Text>
      <Button label="질문 생성하기" variant="filled" />
    </View>
  );
}
