import { View } from 'react-native';

import Text from '@/src/components/ui/text';

interface BreadTraitListProps {
  /** "#" 없이 문구만 넘긴다. 앞의 "#" 은 이 컴포넌트가 붙인다. */
  traits: string[];
}

/** 내 반죽 성향을 한 줄씩 나열한다. Figma `내 성향-우린` (4949:810). */
export default function BreadTraitList({ traits }: BreadTraitListProps) {
  return (
    <View className="w-full flex-col items-start">
      {traits.map((trait) => (
        <Text key={trait} variant="body-s" className="text-text-primary">
          # {trait}
        </Text>
      ))}
    </View>
  );
}
