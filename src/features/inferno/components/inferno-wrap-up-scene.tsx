import { View } from 'react-native';

import Button from '@/src/components/ui/button';
import Text from '@/src/components/ui/text';

interface InfernoWrapUpSceneProps {
  onEndSeasonPress: () => void;
  onNextSeasonPress: () => void;
}

/**
 * [DRAFT] ep5 4페이지 — 시즌 마무리.
 *
 * "시즌 끝내기"/"다음 시즌 시작하기" 두 버튼만 가로로 나란히 둔다 — 감정일기 공유 버튼은
 * 뺐다(제품 결정).
 */
export default function InfernoWrapUpScene({ onEndSeasonPress, onNextSeasonPress }: InfernoWrapUpSceneProps) {
  return (
    <View className="flex-1 flex-col items-center justify-center gap-[28px] px-[46px]">
      <Text variant="heading-h3" className="text-text-primary">
        시즌을 마무리할까요?
      </Text>
      <View className="w-full flex-row items-center justify-center gap-[12px]">
        <Button
          label="시즌 끝내기"
          variant="outline"
          textVariant="body-s"
          className="h-[34px] px-[14px] py-[4px]"
          onPress={onEndSeasonPress}
        />
        {/* secondary variant 는 w-full 이 박혀 있어 className="w-auto" 로 덮으려 했지만
            실기기에서 안 먹혔다(재확인 완료) — style 로 직접 덮어야 폭이 내용에 맞게 줄어든다. */}
        <Button
          label="다음 시즌 시작하기"
          variant="secondary"
          textVariant="body-s"
          className="h-[34px] px-[14px]"
          style={{ width: 'auto' }}
          onPress={onNextSeasonPress}
        />
      </View>
    </View>
  );
}
