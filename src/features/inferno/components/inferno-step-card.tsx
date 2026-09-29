import { View } from 'react-native';

import RiseIn from '@/src/components/ui/rise-in';
import Text from '@/src/components/ui/text';
import { STEP_CARD_FADE_MS, STEP_CARD_RISE } from '@/src/features/inferno/constants/animation';

interface InfernoStepCardProps {
  label: string;
  /** true 가 되는 순간부터 delayMs 를 세기 시작한다. */
  start: boolean;
  /** start 이후 이 카드가 나오기까지 기다리는 시간(ms). */
  delayMs: number;
}

/** 러빈지옥 진행 단계 한 칸. Figma 6376:8652 외. */
export default function InfernoStepCard({ label, start, delayMs }: InfernoStepCardProps) {
  return (
    <RiseIn
      start={start}
      delayMs={delayMs}
      durationMs={STEP_CARD_FADE_MS}
      riseDistance={STEP_CARD_RISE}
      className="w-full"
    >
      <View className="w-full rounded-[8px] border border-default-gray px-[20px] py-[12px]">
        <Text variant="body-s" className="text-text-primary">
          {label}
        </Text>
      </View>
    </RiseIn>
  );
}
