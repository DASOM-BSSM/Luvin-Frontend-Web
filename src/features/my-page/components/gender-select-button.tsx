import { Pressable } from 'react-native';

import Text from '@/src/components/ui/text';

interface GenderSelectButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

/**
 * 성별 선택 칩. Figma "Button1"(6300:8074/6300:8077) — 선택 시 yellow/300 배경 + yellow/400
 * 테두리, 미선택 시 yellow/200 배경 + yellow/300 테두리.
 */
export default function GenderSelectButton({ label, selected, onPress }: GenderSelectButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`rounded-[8px] border px-[20px] py-[6px] ${
        selected ? 'border-yellow-400 bg-yellow-300' : 'border-yellow-300 bg-yellow-200'
      }`}
      onPress={onPress}
    >
      <Text variant="body-xs" className="text-text-primary">
        {label}
      </Text>
    </Pressable>
  );
}
