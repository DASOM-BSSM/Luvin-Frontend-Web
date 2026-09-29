import { View } from 'react-native';

import Text from '@/src/components/ui/text';
import TypewriterText from '@/src/components/ui/typewriter-text';

/** Figma 6340:8394. */
const HEADING = '러빈지옥은 이렇게 구성되어 있어요';

/** Figma 6341:8571. 줄바꿈까지 시안 그대로. */
const BODY = [
  '나를 포함해서 총 4개의 반죽이 이번 러빈지옥에 들어와요',
  '나머지 셋은 매번 다른 성향으로 랜덤 배정돼요!',
  '이번엔 또 어떤 반죽을 만나게 될지 직접 확인해보세요',
].join('\n');

/**
 * ep0 둘째 장면. Figma `ep0` (6340:8388) 의 6376:8669.
 *
 * 인사말 장면과 달리 쪽지 좌상단에 붙는다(왼쪽 67, 위 86).
 * 제목은 바로 떠 있고 본문만 한 글자씩 쳐진다.
 */
export default function InfernoStructureScene() {
  return (
    <View className="flex-1 flex-col items-start gap-[20px] pl-[67px] pt-[86px]">
      <Text variant="heading-h3" className="text-default-black">
        {HEADING}
      </Text>
      <TypewriterText text={BODY} variant="body-m" className="text-default-black" />
    </View>
  );
}
