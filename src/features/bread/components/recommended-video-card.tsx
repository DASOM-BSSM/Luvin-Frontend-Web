import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { View } from 'react-native';

import Text from '@/src/components/ui/text';
import type { RecommendedVideo } from '@/src/features/bread/types';
import { youtubeThumbnailUrl } from '@/src/features/bread/utils/youtube';

const InteropImage = cssInterop(Image, { className: 'style' });

interface RecommendedVideoCardProps {
  video: RecommendedVideo;
}

/**
 * 추천 영상 썸네일 + 제목. Figma `내 성향-우린` (5748:4287).
 *
 * 썸네일은 원격에서 불러온다. 못 불러와도 회색 자리가 남아 레이아웃이 흔들리지 않는다.
 *
 * NOTE: Figma 에는 눌렀을 때의 동작(영상 열기)이 정의돼 있지 않아 표시만 한다.
 */
export default function RecommendedVideoCard({ video }: RecommendedVideoCardProps) {
  return (
    <View className="w-full flex-col items-start justify-center gap-[8px]">
      <View className="h-[147px] w-[263px] overflow-hidden rounded-[24px] bg-default-gray">
        <InteropImage
          className="h-full w-full"
          source={{ uri: youtubeThumbnailUrl(video.youtubeId) }}
          contentFit="cover"
          accessibilityLabel={video.title}
        />
      </View>
      <Text variant="body-s" className="text-text-muted">
        {video.title}
      </Text>
    </View>
  );
}
