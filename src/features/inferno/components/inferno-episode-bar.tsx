import { View } from 'react-native';

import Text from '@/src/components/ui/text';

interface InfernoEpisodeBarProps {
  label: string;
}

/** 카드 아래쪽의 에피소드 제목 바. Figma `Frame 121` (6159:3327). */
export default function InfernoEpisodeBar({ label }: InfernoEpisodeBarProps) {
  return (
    <View className="w-full flex-row items-center justify-center overflow-hidden rounded-[8px] bg-yellow-200 py-[10px]">
      <Text variant="heading-h4" className="text-text-primary">
        {label}
      </Text>
    </View>
  );
}
