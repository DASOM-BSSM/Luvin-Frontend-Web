import { Modal, Pressable, View } from 'react-native';

import Button from '@/src/components/ui/button';
import Text from '@/src/components/ui/text';
import { okMallangBTitleStyle } from '@/src/constants/typography';

/** Figma 6602:3956. */
const MESSAGE = '러빈지옥을 시작하려면 반죽이 필요해요!';

/** Figma 6602:3957 의 버튼 문구. */
const ACTION_LABEL = '나만의 반죽을 만들어요';

interface InfernoNoticeModalProps {
  visible: boolean;
  /** 바깥을 누르거나 뒤로가기를 했을 때. */
  onClose: () => void;
  /** "나만의 반죽을 만들어요" 를 눌렀을 때. */
  onSurveyPress: () => void;
}

/**
 * 반죽 없이 러빈지옥에 들어가려 할 때 뜨는 안내. Figma `모달` (6602:3711).
 *
 * 설문을 먼저 해야 러빈지옥을 시작할 수 있어서, 진입을 막는 대신 설문으로 보낸다.
 *
 * NOTE: 제목은 Tailwind 클래스가 아니라 style 로 폰트를 넣는다. `font-ok-mallang-b` 는
 * 실기기에서 폰트가 깨진다(src/constants/typography.ts 주석 참고).
 *
 * NOTE: 시안에 닫기 버튼이 없어서 바깥을 누르면 닫히게 했다. 안드로이드 뒤로가기도 같다.
 */
export default function InfernoNoticeModal({
  visible,
  onClose,
  onSurveyPress,
}: InfernoNoticeModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="안내 닫기"
        className="flex-1 items-center justify-center bg-default-black/30 px-[32px]"
        onPress={onClose}
      >
        {/* 안쪽을 눌렀을 때 닫히지 않도록 이벤트를 여기서 멈춘다. */}
        <Pressable className="w-full overflow-hidden rounded-[8px] bg-default-white px-[24px] py-[28px]">
          <View className="w-full flex-col items-center gap-[20px]">
            <View className="w-full flex-col items-start gap-[4px]">
              <Text className="w-full text-center text-pink-500" style={okMallangBTitleStyle}>
                NOTICE
              </Text>
              <Text variant="body-m" className="w-full text-center text-default-black">
                {MESSAGE}
              </Text>
            </View>
            <Button label={ACTION_LABEL} variant="notice" onPress={onSurveyPress} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
