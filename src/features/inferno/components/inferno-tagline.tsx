import { View } from 'react-native';

import Text from '@/src/components/ui/text';

interface InfernoTaglineProps {
  text: string;
}

/**
 * 타이틀 위 알약형 문구. Figma `Button1` (6159:3325).
 *
 * NOTE: Figma 이름은 Button 이지만 누르는 곳이 아니라 장식 문구라 Pressable 로 만들지 않았다.
 */
export default function InfernoTagline({ text }: InfernoTaglineProps) {
  return (
    <View className="flex-row items-center justify-center overflow-hidden rounded-[20px] border-2 border-pink-300 bg-pink-200 px-[30px] py-[6px]">
      <Text variant="body-s" className="text-text-primary">
        {text}
      </Text>
    </View>
  );
}
