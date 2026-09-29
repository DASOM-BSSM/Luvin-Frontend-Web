import { Modal, Pressable, View } from 'react-native';

import Button from '@/src/components/ui/button';
import Text from '@/src/components/ui/text';
import { okMallangBTitleStyle } from '@/src/constants/typography';
import InfernoDotBackground from '@/src/features/inferno/components/inferno-dot-background';

interface InfernoNoteModalProps {
  visible: boolean;
  /**
   * 쪽지 폭 클래스. 시안 값을 그대로 넘긴다(VOTE 366, NOTICE 344).
   *
   * 시안은 글에 맞춰 늘어나는 상자지만, 폭을 비워 두면 안쪽의 `w-full` 들이 기댈 곳이 없어
   * 화면 폭 기준으로 퍼져 버린다. 그래서 폭은 부르는 쪽이 정한다.
   */
  widthClass: string;
  /** 쪽지 맨 위 분홍 글자. 예: "VOTE", "NOTICE" */
  title: string;
  message: string;
  actionLabel: string;
  onActionPress: () => void;
  /** 바깥을 누르거나 안드로이드 뒤로가기를 했을 때. */
  onClose: () => void;
}

/**
 * 러빈지옥 화면 위에 뜨는 쪽지 모달. Figma `ep1-투표` (5466:4550), `ep1-끝` (5467:5645).
 *
 * 물방울 무늬 종이 위에 흰 쪽지가 한 겹 얹힌 모양이라 두 겹으로 짠다. 바깥이 무늬(반경 12),
 * 안쪽이 흰 쪽지(반경 8)다. 폭은 쪽지마다 달라서 부르는 쪽이 넘긴다(widthClass).
 *
 * NOTE: 제목은 Tailwind 클래스가 아니라 style 로 폰트를 넣는다. `font-ok-mallang-b` 는
 * 실기기에서 폰트가 깨진다(src/constants/typography.ts 주석 참고).
 *
 * NOTE: 시안에 닫기 버튼이 없어서 바깥을 누르면 닫히게 했다. 안드로이드 뒤로가기도 같다.
 *
 * 홈의 InfernoNoticeModal 과 생김새가 비슷하지만 그쪽 시안(6602:3711)에는 무늬 테두리가 없고
 * 여백도 다르다. 시안이 하나로 합쳐지면 그때 합칠 것.
 */
export default function InfernoNoteModal({
  visible,
  widthClass,
  title,
  message,
  actionLabel,
  onActionPress,
  onClose,
}: InfernoNoteModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      // iOS 는 모달을 별도 뷰컨트롤러로 띄우는데 이 값의 기본이 세로뿐이라, 가로로 잠긴
      // 러빈지옥에서 그대로 띄우면 "지원 방향이 겹치지 않는다"며 앱이 죽는다(시뮬레이터에서
      // 실제로 죽는 것을 확인했다. 안드로이드에는 없는 제약이라 그쪽만 보면 놓친다).
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${title} 닫기`}
        className="flex-1 items-center justify-center bg-default-black/30"
        onPress={onClose}
      >
        {/* 안쪽을 눌렀을 때 닫히지 않도록 이벤트를 여기서 멈춘다. */}
        <Pressable
          className={`overflow-hidden rounded-[12px] bg-default-white px-[24px] py-[20px] ${widthClass}`}
        >
          <InfernoDotBackground variant="modal" />
          <View className="rounded-[8px] bg-default-white px-[30px] py-[20px]">
            <View className="w-full flex-col items-center gap-[20px]">
              <View className="w-full flex-col items-start gap-[4px]">
                <Text className="w-full text-center text-pink-500" style={okMallangBTitleStyle}>
                  {title}
                </Text>
                <Text variant="body-m" className="w-full text-center text-default-black">
                  {message}
                </Text>
              </View>
              <Button label={actionLabel} variant="notice" onPress={onActionPress} />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
