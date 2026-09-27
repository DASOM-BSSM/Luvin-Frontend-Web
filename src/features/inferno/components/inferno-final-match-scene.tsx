import { View } from 'react-native';

import HeartIcon from '@/src/assets/icons/HeartIcon';
import BreadCharacter from '@/src/assets/images/BreadCharacter';
import Text from '@/src/components/ui/text';
import theme from '@/src/constants/theme';
import { okMallangBTitleStyle } from '@/src/constants/typography';
import { findDoughFigure } from '@/src/features/inferno/constants/dough-figures';
import type { InfernoFinalMatchResult } from '@/src/features/inferno/types';
import type { BreadProfile } from '@/src/features/home/types';

const HEART_SIZE = 28;

interface InfernoFinalMatchSceneProps {
  result: InfernoFinalMatchResult;
  /** "내 분신" — 실제 러빈지옥 진입 조건과 같아서(§ ep5.tsx 가드) null 이 아니다. */
  myProfile: BreadProfile;
}

/**
 * [DRAFT] ep5 1페이지 — 최종 매칭 상대 공개.
 *
 * Figma 디자인이 아직 없어 다른 회차 쪽지의 타이틀 규칙(REPORT/HIGHLIGHT 와 같은 Ok
 * Mallang B 핑크 타이틀)을 빌려 "RESULT" 로 썼다. 내 반죽 → 하트 → 매칭 상대 반죽을
 * 가로로 나란히 잇는 "매칭 성사" 장면 — `InfernoPersonalChatSidebar`가 1:1 대화에서 둘을
 * personDough(팔다리 있는 반죽)로 나란히 세우는 것과 같은 이유로, 여기서도 항상
 * personDough 로 고정한다. 디자인이 나오면 다시 손볼 예정.
 *
 * 다음 페이지 이동은 상단 바 "다음화면"(InfernoTopBar)이 이미 있어 페이지 안에 따로
 * 버튼을 두지 않는다.
 */
export default function InfernoFinalMatchScene({ result, myProfile }: InfernoFinalMatchSceneProps) {
  return (
    <View className="flex-1 flex-col items-center justify-center gap-[16px]">
      <Text className="text-center text-pink-500" style={okMallangBTitleStyle}>
        RESULT
      </Text>

      <View className="flex-row items-center gap-[16px]">
        <BreadCharacter
          type={myProfile.type}
          state="personDough"
          className={findDoughFigure(myProfile.type).chatSizeClass}
          accessibilityLabel={myProfile.name}
        />
        <HeartIcon color={theme.heart.filled} size={HEART_SIZE} />
        <BreadCharacter
          type={result.profile.type}
          state="personDough"
          className={findDoughFigure(result.profile.type).chatSizeClass}
          accessibilityLabel={result.profile.name}
        />
      </View>

      <View className="flex-col items-center gap-[4px]">
        <Text variant="heading-h4" className="text-text-primary">
          {result.profile.name}
        </Text>
        <Text variant="body-m" className="text-center text-text-primary">
          {result.summaryLine}
        </Text>
      </View>
    </View>
  );
}
