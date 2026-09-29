import { View } from 'react-native';

import HeartIcon from '@/src/assets/icons/HeartIcon';
import Text from '@/src/components/ui/text';
import { heart } from '@/src/constants/colors';

interface MissionBannerProps {
  missionTarget: number;
  reward: number;
}

/** 프레임 위쪽 미션 배너: "오늘의 미션: 기록 OO 넘기" + "보상: 🥐 xN". Ready/Playing/Result 공용. */
export function MissionBanner({ missionTarget, reward }: MissionBannerProps) {
  return (
    <View className="w-full flex-col items-center">
      <Text variant="heading-h4" className="text-center text-default-black">
        오늘의 미션: 기록 {missionTarget} 넘기
      </Text>
      <Text variant="body-s" className="text-default-black">
        보상: 🥐 x{reward}
      </Text>
    </View>
  );
}

interface InGameStatsProps {
  score: number;
  hearts: number;
  maxHearts?: number;
}

/**
 * 게임 화면(프레임) 안쪽 좌상단 기록 카운터 / 우상단 하트. `GameFrame`의 자식으로 절대
 * 위치시켜, 스크롤/레인 배경 위에 오버레이되도록 쓴다(§16 스코프 한정 예외).
 *
 * 하트는 이모지(❤️/🤍) 대신 `HeartIcon` SVG를 쓴다 — Figma 하트 자산을 픽셀 샘플링해보니
 * 빈 하트가 흰색이 아니라 회색(`heart.empty`)이었는데, "♥" 이모지 글리프는 안드로이드에서
 * 시스템 컬러 이모지로 강제 대체되어 `color`를 지정해도 항상 고정된 빨강으로만 렌더링되는 걸
 * 실기기에서 확인했다(§8, 색 재검증 반영).
 */
export function InGameStats({ score, hearts, maxHearts = 3 }: InGameStatsProps) {
  return (
    <View className="absolute left-0 right-0 top-[20px] w-full flex-row items-start justify-between px-[16px]">
      <Text variant="display-score">
        {Math.floor(score)}
      </Text>
      <View className="flex-row gap-[4px]">
        {Array.from({ length: maxHearts }, (_, i) => (
          <HeartIcon key={i} color={i < hearts ? heart.filled : heart.empty} />
        ))}
      </View>
    </View>
  );
}
