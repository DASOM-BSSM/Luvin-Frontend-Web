import { router } from 'expo-router';
import { View } from 'react-native';

import Button from '@/src/components/ui/button';
import Text from '@/src/components/ui/text';

/**
 * 아직 설문을 하지 않아 분신(빵)이 없을 때 프로필 카드 자리에 들어간다.
 */
export default function BreadSurveyPromptCard() {
  function handleSurveyButtonPress() {
    router.push('/survey');
  }

  return (
    <View className="w-full flex-col items-center justify-center gap-[8px] rounded-[8px] bg-yellow-200 px-[30px] py-[16px]">
      <Text variant="body-s" className="text-center text-text-primary">
        설문을 진행하고 나만의 반죽을 만들어요
      </Text>
      <Button label="설문 바로가기" onPress={handleSurveyButtonPress} />
    </View>
  );
}
