import { View } from 'react-native';

import FolderIcon from '@/src/assets/icons/FolderIcon';
import RiseIn from '@/src/components/ui/rise-in';
import Text from '@/src/components/ui/text';
import {
  GUIDE_ITEM_FADE_MS,
  GUIDE_ITEM_RISE,
  GUIDE_ITEM_STAGGER_MS,
} from '@/src/features/inferno/constants/animation';

/** Figma 6376:8619. */
const HEADING = '시작하기 전에! 헷갈리지 않게 미리 알고가요';

/**
 * Figma 6376:8637, 6376:8632. 줄바꿈과 따옴표까지 시안 그대로.
 * 폭이 서로 다른 건 시안에 그렇게 잡혀 있어서다(288 / 272).
 */
const GUIDES = [
  {
    label: '다시 굽기',
    widthClass: 'w-[288px]',
    body: '“그때 다른 선택을 했다면?”\n시즌 중 딱 한번만 다시 구워볼 수 있어요',
  },
  {
    label: '나의 빵에게',
    widthClass: 'w-[272px]',
    body: '나의 반죽에게 피드백을 보내서\n좀 더 나 같은 분신으로 만들 수 있어요',
  },
];

/**
 * ep0 넷째 장면. Figma `ep0` (6376:8613) 의 6376:8651.
 *
 * 제목 아래에 기능 안내 두 개가 80 간격으로 선다. 각 안내는 폴더 아이콘과 이름이 한 줄,
 * 설명이 그 아래에 놓인다.
 *
 * 제목은 바로 떠 있고, 안내는 왼쪽부터 차례로 떠오른다. 기능을 하나씩 알아차리게 하려는
 * 화면이라 시선이 왼쪽에서 오른쪽으로 흐르도록 맞췄다.
 */
export default function InfernoGuideScene() {
  return (
    <View className="flex-1 items-center justify-center">
      <View className="w-[640px] flex-col items-start gap-[28px]">
        <Text variant="heading-h3" className="text-default-black">
          {HEADING}
        </Text>

        <View className="w-full flex-row items-start gap-[80px]">
          {GUIDES.map((guide, index) => (
            <RiseIn
              key={guide.label}
              delayMs={index * GUIDE_ITEM_STAGGER_MS}
              durationMs={GUIDE_ITEM_FADE_MS}
              riseDistance={GUIDE_ITEM_RISE}
              className={guide.widthClass}
            >
              <View className="flex-col gap-[8px]">
                <View className="flex-row items-center gap-[12px]">
                  <FolderIcon />
                  <Text variant="heading-h4" className="text-text-primary">
                    {guide.label}
                  </Text>
                </View>
                <Text variant="body-m" className="text-text-primary">
                  {guide.body}
                </Text>
              </View>
            </RiseIn>
          ))}
        </View>
      </View>
    </View>
  );
}
