import { View } from 'react-native';

import Button from '@/src/components/ui/button';
import Dropdown, { type DropdownOption } from '@/src/components/ui/dropdown';
import Text from '@/src/components/ui/text';
import TextArea from '@/src/components/ui/text-area';
import { okMallangBTitleStyle } from '@/src/constants/typography';
import type { InfernoFeedbackTopic } from '@/src/features/inferno/types';

/** 쪽지 맨 위 분홍 글자. Figma 5482:1892. */
const TITLE = 'TO.ME';

/** 대화를 고르는 단계의 문구. Figma 5482:1893, 5482:1894, 5482:1895, 5482:1897, 5482:1900. */
const PICK_MESSAGE = '피드백 하고 싶은 대화를 찾아주세요';
const PICK_PLACEHOLDER = '대화를 찾아주세요...';
const PICK_ACTION = '대화 찾기';
const REASON_TITLE = '나의 AI가 이렇게 대답한 이유는?';
const REASON_EMPTY = '...';
const WRITE_ACTION = '나의 반죽 피드백 하기';

/** 피드백을 쓰는 단계의 문구. Figma 5482:1933, 5482:1935. */
const WRITE_MESSAGE = '나의 반죽에게 피드백을 남겨주세요';
const SUBMIT_ACTION = '피드백 하기';

/** 어느 단계를 보여줄지. pick 은 대화를 고르는 화면, write 는 피드백을 쓰는 화면. */
export type InfernoFeedbackStep = 'pick' | 'write';

interface InfernoFeedbackSceneProps {
  step: InfernoFeedbackStep;
  topics: InfernoFeedbackTopic[];
  /** 아직 고르지 않았으면 undefined. */
  selectedMessageId?: string;
  /** "대화 찾기" 를 눌러 이유를 펼친 줄. 고른 것과 다를 수 있다(고르기만 하고 안 누른 경우). */
  shownTopic?: InfernoFeedbackTopic;
  feedback: string;
  onSelectTopic: (messageId: string) => void;
  onFindPress: () => void;
  onWriteStartPress: () => void;
  onFeedbackChange: (value: string) => void;
  onSubmitPress: () => void;
}

/**
 * "나의 빵에게" 피드백 쪽지. Figma `나의 빵에게` (5482:1883, 5467:6203, 5482:1923).
 *
 * 쪽지 안이 좌우 두 칸이다. 단계에 따라 양쪽 내용이 같이 바뀐다.
 * - pick : 왼쪽은 대화 고르기(드롭다운 + 대화 찾기), 오른쪽은 고른 줄의 이유.
 *          "대화 찾기" 를 누르기 전에는 오른쪽이 "..." 이고 다음 버튼도 눌리지 않는다.
 * - write: 왼쪽은 안내와 보내기 버튼, 오른쪽은 입력칸.
 *
 * 이유 문구가 없는 줄을 고르면 "대화 찾기" 를 눌러도 오른쪽이 "..." 인 채로 남는다.
 * 시안에 문구가 한 줄분만 있어서 나머지를 지어내지 않은 결과다(types 의 reason 주석 참고).
 */
export default function InfernoFeedbackScene({
  step,
  topics,
  selectedMessageId,
  shownTopic,
  feedback,
  onSelectTopic,
  onFindPress,
  onWriteStartPress,
  onFeedbackChange,
  onSubmitPress,
}: InfernoFeedbackSceneProps) {
  const options: DropdownOption[] = topics.map(({ messageId, message }) => ({
    id: messageId,
    label: message,
  }));

  const isPick = step === 'pick';

  return (
    <View className="flex-1 flex-row items-center justify-center gap-[60px]">
      <View className="w-[304px] flex-col items-center gap-[20px]">
        <View className="flex-col items-center">
          <Text className="w-full text-center text-pink-500" style={okMallangBTitleStyle}>
            {TITLE}
          </Text>
          <Text variant="body-m" className="text-default-black">
            {isPick ? PICK_MESSAGE : WRITE_MESSAGE}
          </Text>
        </View>

        {isPick ? (
          <>
            <Dropdown
              options={options}
              selectedId={selectedMessageId}
              placeholder={PICK_PLACEHOLDER}
              onSelect={onSelectTopic}
            />
            <Button
              label={PICK_ACTION}
              variant={selectedMessageId ? 'notice' : 'noticeSoft'}
              disabled={!selectedMessageId}
              onPress={onFindPress}
            />
          </>
        ) : (
          <Button label={SUBMIT_ACTION} variant="notice" onPress={onSubmitPress} />
        )}
      </View>

      <View className="w-[304px] flex-col items-center gap-[20px]">
        {isPick ? (
          <>
            <View className="w-full flex-col items-start gap-[8px]">
              <Text variant="heading-h4" className="text-default-black">
                {REASON_TITLE}
              </Text>
              <Text variant="body-m" className="text-default-black">
                {shownTopic?.reason ?? REASON_EMPTY}
              </Text>
            </View>
            <Button
              label={WRITE_ACTION}
              variant="noticeSoft"
              disabled={!shownTopic?.reason}
              onPress={onWriteStartPress}
            />
          </>
        ) : (
          <TextArea
            value={feedback}
            onChangeText={onFeedbackChange}
            accessibilityLabel={WRITE_MESSAGE}
          />
        )}
      </View>
    </View>
  );
}
