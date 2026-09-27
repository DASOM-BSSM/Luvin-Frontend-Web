import { View } from 'react-native';

import Button from '@/src/components/ui/button';
import Text from '@/src/components/ui/text';
import { okMallangBTitleStyle } from '@/src/constants/typography';
import InfernoVoteOption from '@/src/features/inferno/components/inferno-vote-option';
import type { InfernoParticipant } from '@/src/features/inferno/types';

/** Figma 5452:2834 의 버튼 문구. */
const ACTION_LABEL = '투표하기';
/** 제출 요청이 오가는 동안 버튼에 보여줄 문구. 시안에 없는 상태라 최소한으로만 바꾼다. */
const SUBMITTING_LABEL = '투표하는 중...';

interface InfernoVoteSceneProps {
  /** 쪽지 맨 위 분홍 글자. 기본은 'VOTE'(Figma 5452:2750). 다시 굽기 투표지는 'REBAKE'. */
  title?: string;
  message: string;
  /** 고를 수 있는 반죽들. 내 분신은 호출부에서 빼고 넘긴다. */
  options: InfernoParticipant[];
  /** 아직 고르지 않았으면 undefined. */
  selectedId?: string;
  /** 제출 요청이 오가는 중인지. 버튼을 잠그고 문구를 바꾼다. */
  isSubmitting?: boolean;
  /** 마지막 제출이 실패했을 때 버튼 아래 보여줄 문구. */
  errorMessage?: string;
  onSelect: (participantId: string) => void;
  onSubmit: () => void;
}

/**
 * 투표지. Figma `ep1-투표지` (5452:1989), `다시굽기` 투표지 (5467:5840).
 *
 * 쪽지 안이 두 칸이다. 왼쪽이 문구와 투표 버튼(304), 오른쪽이 선택지(300), 사이 60.
 * 시안의 좌우 여백 59 는 두 칸 폭을 뺀 나머지를 반씩 나눈 값과 같아서 가운데 정렬로 맞춘다.
 *
 * NOTE: 제목 폰트는 style 로 넣는다(src/constants/typography.ts 주석 참고).
 */
export default function InfernoVoteScene({
  title = 'VOTE',
  message,
  options,
  selectedId,
  isSubmitting = false,
  errorMessage,
  onSelect,
  onSubmit,
}: InfernoVoteSceneProps) {
  return (
    <View className="flex-1 flex-row items-center justify-center gap-[60px]">
      <View className="w-[304px] flex-col items-center gap-[28px]">
        <View className="w-[222px] flex-col items-center">
          <Text className="w-full text-center text-pink-500" style={okMallangBTitleStyle}>
            {title}
          </Text>
          <Text variant="body-m" className="w-full text-center text-default-black">
            {message}
          </Text>
        </View>
        <View className="w-full flex-col items-center gap-[8px]">
          <Button
            label={isSubmitting ? SUBMITTING_LABEL : ACTION_LABEL}
            variant="notice"
            disabled={isSubmitting}
            onPress={onSubmit}
          />
          {errorMessage ? (
            <Text variant="body-xs" className="text-center text-state-error">
              {errorMessage}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="w-[300px] flex-col items-start gap-[24px]">
        {options.map((participant) => (
          <InfernoVoteOption
            key={participant.id}
            participant={participant}
            selected={participant.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </View>
    </View>
  );
}
