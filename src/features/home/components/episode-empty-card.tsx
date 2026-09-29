import { View } from 'react-native';

import Button from '@/src/components/ui/button';
import RecBadge from '@/src/components/ui/rec-badge';
import Text from '@/src/components/ui/text';

interface EpisodeEmptyCardProps {
  onStartPress: () => void;
}

/**
 * 진행 중인 에피소드가 없을 때의 썸네일 카드.
 *
 * 러빈지옥에 바로 들어갈 수 있는지는 반죽 유무에 달려 있는데 그 판단은 홈 화면이 하므로,
 * 여기서는 이동을 직접 하지 않고 눌렸다는 사실만 알린다.
 */
export default function EpisodeEmptyCard({ onStartPress }: EpisodeEmptyCardProps) {
  return (
    <View className="h-[144px] w-full overflow-hidden rounded-[12px] border-2 border-dashed border-pink-500 p-[11px]">
      <RecBadge />
      <View className="h-[10px]" />
      <View className="w-full flex-col items-center justify-center gap-[8px]">
        <Text variant="body-s" className="text-text-primary">
          진행 중인 에피소드가 없어요
        </Text>
        <Button label="러빈지옥 시작하기" onPress={onStartPress} />
      </View>
    </View>
  );
}
