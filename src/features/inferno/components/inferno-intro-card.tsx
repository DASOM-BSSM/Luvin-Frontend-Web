import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import RecBadge from '@/src/components/ui/rec-badge';
import InfernoEpisodeBar from '@/src/features/inferno/components/inferno-episode-bar';
import InfernoTagline from '@/src/features/inferno/components/inferno-tagline';
import InfernoTitleReveal from '@/src/features/inferno/components/inferno-title-reveal';
import {
  EPISODE_BAR_DELAY_MS,
  EPISODE_BAR_FADE_MS,
} from '@/src/features/inferno/constants/animation';
import { INFERNO_TAGLINE } from '@/src/features/inferno/constants/episodes';
import type { InfernoEpisode } from '@/src/features/inferno/types';
import { formatIntroLabel } from '@/src/features/inferno/utils/format';

interface InfernoIntroCardProps {
  episode: InfernoEpisode;
}

/**
 * 러빈지옥 에피소드 시작 카드. Figma `ep0-시작` 의 `Frame 2` (6159:3316).
 *
 * 시안은 816x358 고정이지만 기기 폭에 맞춰 늘어나도록 flex 로 짰다.
 * 알약 문구는 회차와 무관하게 늘 같아서 상수에서 바로 가져다 쓴다.
 *
 * 등장 순서: 타이틀이 좌에서 우로 차오른 뒤 에피소드 바가 따라 나온다(constants/animation.ts).
 * 에피소드 바는 처음부터 자리를 차지한 채 투명도만 올라오므로 레이아웃이 밀리지 않는다.
 */
export default function InfernoIntroCard({ episode }: InfernoIntroCardProps) {
  return (
    <View className="flex-1 overflow-hidden rounded-[12px] border-2 border-dashed border-pink-500 pl-[22px] pt-[15px]">
      <RecBadge size="lg" />
      {/*
        본문 묶음이 시안에서 카드 정중앙보다 살짝 위(y=90)에 놓여 있어 아래쪽을 조금 더 비운다.
        위쪽은 REC 줄이 이미 차지하므로 pb 로만 맞춘다.
      */}
      <View className="flex-1 flex-col items-center justify-center gap-[15px] px-[55px] pb-[28px] pr-[77px]">
        <View className="w-full flex-col items-center gap-[12px]">
          <InfernoTagline text={INFERNO_TAGLINE} />
          <InfernoTitleReveal />
        </View>
        <Animated.View
          className="w-full"
          entering={FadeIn.delay(EPISODE_BAR_DELAY_MS).duration(EPISODE_BAR_FADE_MS)}
        >
          <InfernoEpisodeBar label={formatIntroLabel(episode.order, episode.title)} />
        </Animated.View>
      </View>
    </View>
  );
}
