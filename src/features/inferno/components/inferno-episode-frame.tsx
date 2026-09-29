import type { ReactNode } from 'react';
import { View } from 'react-native';

import InfernoBottomBar from '@/src/features/inferno/components/inferno-bottom-bar';
import InfernoDotBackground from '@/src/features/inferno/components/inferno-dot-background';
import InfernoNoteCard from '@/src/features/inferno/components/inferno-note-card';
import InfernoTopBar from '@/src/features/inferno/components/inferno-top-bar';
import type { InfernoEpisode } from '@/src/features/inferno/types';
import { formatIntroLabel } from '@/src/features/inferno/utils/format';

/**
 * 본문이 올라가는 바탕.
 *
 * - note: 물방울 배경 위에 흰 쪽지. ep0(6340:8355).
 * - plain: 흰 바탕만. ep1 대화(5425:886)처럼 쪽지 없이 화면을 그대로 쓰는 회차.
 */
type InfernoSurface = 'note' | 'plain';

interface InfernoEpisodeFrameProps {
  episode: InfernoEpisode;
  titleVariant?: 'image' | 'text';
  /** 넘기지 않으면 note. 회차 대부분이 쪽지 위에 놓인다. */
  surface?: InfernoSurface;
  /** 하단 바 오른쪽 문구. 회차마다 다르다(inferno-bottom-bar 주석 참고). */
  skipLabel?: string;
  /** 넘기지 않으면 해당 버튼이 연해지고 눌리지 않는다. */
  onPreviousPress?: () => void;
  onNextPress?: () => void;
  onSkipPress?: () => void;
  children: ReactNode;
}

/**
 * 러빈지옥 본문 화면의 공통 껍데기. Figma `ep0` (6340:8355, 6340:8388).
 *
 * 회차가 바뀌어도 상하 바는 그대로라서 한 곳에 모았다. 위아래 바가 51 씩 차지하고
 * 그 사이를 본문이 채운다. 쪽지를 쓰는 회차는 좌우 여백으로 배경이 비친다.
 */
export default function InfernoEpisodeFrame({
  episode,
  titleVariant,
  surface = 'note',
  skipLabel,
  onPreviousPress,
  onNextPress,
  onSkipPress,
  children,
}: InfernoEpisodeFrameProps) {
  const isNote = surface === 'note';

  return (
    <View className="flex-1 bg-default-white">
      {isNote ? <InfernoDotBackground /> : null}
      <InfernoTopBar
        titleVariant={titleVariant}
        onPreviousPress={onPreviousPress}
        onNextPress={onNextPress}
      />
      {isNote ? (
        <View className="flex-1 px-[46px]">
          <InfernoNoteCard>{children}</InfernoNoteCard>
        </View>
      ) : (
        <View className="flex-1">{children}</View>
      )}
      <InfernoBottomBar
        label={formatIntroLabel(episode.order, episode.title)}
        skipLabel={skipLabel}
        onSkipPress={onSkipPress}
      />
    </View>
  );
}
