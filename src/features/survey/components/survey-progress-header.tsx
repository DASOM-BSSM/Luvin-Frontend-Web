import { Pressable, View } from 'react-native';

import AngleUpIcon from '@/src/assets/icons/AngleUpIcon';
import Text from '@/src/components/ui/text';
import { formatQuestionNumber } from '@/src/features/survey/utils/format';

export interface SurveyProgressHeaderProps {
  /** 지금 문항 번호(1부터). */
  current: number;
  total: number;
  onBackPress: () => void;
}

/**
 * 문항 화면 맨 위의 뒤로가기 + 진행 표시. Figma `설문-우린` (5659:2285).
 *
 * 꺾쇠는 설문 시작 화면의 "나가기" 와 같은 `uit:angle-up` 을 -90도 돌려 쓴다.
 */
export default function SurveyProgressHeader({
  current,
  total,
  onBackPress,
}: SurveyProgressHeaderProps) {
  return (
    <View className="w-full flex-row items-center justify-between">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="이전 문항"
        className="size-[24px] items-center justify-center"
        onPress={onBackPress}
      >
        <View className="-rotate-90">
          <AngleUpIcon />
        </View>
      </Pressable>

      <Text variant="body-s" className="text-default-black">
        {formatQuestionNumber(current)} / {formatQuestionNumber(total)}
      </Text>
    </View>
  );
}
