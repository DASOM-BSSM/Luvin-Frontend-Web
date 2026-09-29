import { View } from 'react-native';

import BreadCluster from '@/src/components/bread-cluster';
import Text from '@/src/components/ui/text';

/** 빵 묶음 크기. Figma `Group 1` (6340:8406) 의 276 x 197.87. */
const CLUSTER_CLASS = 'h-[198px] w-[276px]';

/** Figma 6340:8362. 줄바꿈까지 시안 그대로. */
const MESSAGE = '안녕하세요\n러빈지옥에 오신걸 환영해요!';

/**
 * ep0 첫 장면. Figma `Frame 570` (6340:8570).
 *
 * 인사말과 빵 묶음이 100 간격으로 나란히 서서 쪽지 가운데에 놓인다.
 * 빵은 온보딩/설문과 같은 배열이라 기존 BreadCluster 를 그대로 쓴다(§10 중복 금지).
 * 여기서는 jumping 을 켜서 반죽들이 제각각 통통 뛴다.
 */
export default function InfernoGreetingScene() {
  return (
    <View className="flex-1 flex-row items-center justify-center gap-[100px]">
      <Text variant="heading-h2" className="text-default-black">
        {MESSAGE}
      </Text>
      <BreadCluster state="dough" jumping className={CLUSTER_CLASS} />
    </View>
  );
}
