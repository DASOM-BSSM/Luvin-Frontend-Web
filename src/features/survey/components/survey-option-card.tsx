import { Pressable } from 'react-native';

import Text from '@/src/components/ui/text';
import { formatQuestionNumber } from '@/src/features/survey/utils/format';

export interface SurveyOptionCardProps {
  answerId: string;
  /** 카드에 보이는 보기 번호(1부터). */
  number: number;
  label: string;
  /** 뒤로 돌아왔을 때 이전에 고른 보기인지. Figma에 아직 전용 시각 상태가 없어
   *  접근성 상태로만 반영한다(§8 — 없는 디자인을 지어내지 않는다). */
  selected?: boolean;
  /** 제출 중처럼 더 이상 고를 수 없는 동안. */
  disabled?: boolean;
  onSelect: (answerId: string) => void;
}

/**
 * 문항의 보기 카드. Figma `설문-우린` (5659:2295).
 *
 * NOTE: Figma 에 선택됨 / 눌림 상태가 아직 없어서 기본 상태만 있다. `selected`/`disabled`는
 * `accessibilityState`로만 반영하고 시각적으로는 바꾸지 않는다 — 상태 디자인이 나오면
 * 여기에 추가할 것.
 */
export default function SurveyOptionCard({
  answerId,
  number,
  label,
  selected = false,
  disabled = false,
  onSelect,
}: SurveyOptionCardProps) {
  function handlePress() {
    if (disabled) {
      return;
    }
    onSelect(answerId);
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      className="w-full gap-[2px] rounded-[8px] bg-yellow-300 px-[30px] py-[16px]"
      onPress={handlePress}
    >
      <Text variant="body-xs" className="text-text-primary">
        {formatQuestionNumber(number)}
      </Text>
      <Text variant="heading-h4" className="text-text-primary">
        {label}
      </Text>
    </Pressable>
  );
}
