import { Modal, Pressable, View } from 'react-native';

import Button from '@/src/components/ui/button';
import Text from '@/src/components/ui/text';
import { okMallangBTitleStyle } from '@/src/constants/typography';

const TITLE = 'NOTICE';
const DEFAULT_CANCEL_LABEL = '취소';

interface ConfirmModalProps {
  visible: boolean;
  message: string;
  /** 오른쪽(노란) 버튼 문구. 예: "로그아웃", "탈퇴". */
  confirmLabel: string;
  cancelLabel?: string;
  /** 확인 동작이 진행 중이면 true — 확인 버튼을 비활성으로 둔다(§11). */
  isConfirmDisabled?: boolean;
  onConfirm: () => void;
  /** "취소", 바깥 누르기, 안드로이드 뒤로가기 모두 이걸 부른다. */
  onCancel: () => void;
}

/**
 * 되돌리기 어려운 동작 전에 묻는 확인 모달. Figma 로그아웃 `모달`(7062:4518),
 * 계정 탈퇴 `모달`(7062:4503) — 두 시안은 문구만 다르다.
 *
 * `Alert.alert` 대신 이걸 쓰는 이유: react-native-web 의 `Alert.alert` 는 아무것도 띄우지
 * 않아서, 앱과 웹에서 같은 디자인의 모달이 뜨도록 직접 그린다.
 *
 * NOTE: 제목은 Tailwind 클래스가 아니라 style 로 폰트를 넣는다. `font-ok-mallang-b` 는
 * 실기기에서 폰트가 깨진다(src/constants/typography.ts 주석 참고). 시안의 NOTICE 에는
 * 테두리(stroke)가 없다.
 *
 * NOTE: 쪽지는 시안 폭(342)을 넘지 않게 한다 — 웹 PC 화면에서는 `Modal` 이 앱 영역이 아니라
 * 브라우저 창 전체에 깔려서, 폭을 막지 않으면 쪽지가 창 너비만큼 늘어난다.
 */
export default function ConfirmModal({
  visible,
  message,
  confirmLabel,
  cancelLabel = DEFAULT_CANCEL_LABEL,
  isConfirmDisabled = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      {/* 바깥 배경에는 accessibilityRole="button" 을 주지 않는다 — 웹에서 <button> 으로 그려져
          안쪽 취소/확인 버튼이 <button> 안의 <button> 이 된다(잘못된 HTML, 개발 모드 경고). */}
      <Pressable
        className="flex-1 items-center justify-center bg-default-black/30 px-[30px]"
        onPress={onCancel}
      >
        {/* 안쪽을 눌렀을 때 닫히지 않도록 이벤트를 여기서 멈춘다. */}
        <Pressable className="w-full max-w-[342px] overflow-hidden rounded-[8px] bg-default-white px-[24px] py-[28px]">
          <View className="w-full flex-col items-center gap-[20px]">
            <View className="w-full flex-col items-center gap-[4px]">
              <Text className="w-full text-center text-pink-500" style={okMallangBTitleStyle}>
                {TITLE}
              </Text>
              <Text variant="body-m" className="w-full text-center text-default-black">
                {message}
              </Text>
            </View>
            <View className="w-full flex-row items-center justify-center gap-[20px]">
              <View className="w-[110px]">
                <Button
                  label={cancelLabel}
                  variant="outline"
                  textVariant="body-m"
                  className="w-full"
                  onPress={onCancel}
                />
              </View>
              <View className="w-[110px]">
                <Button
                  label={confirmLabel}
                  variant="notice"
                  disabled={isConfirmDisabled}
                  onPress={onConfirm}
                />
              </View>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
