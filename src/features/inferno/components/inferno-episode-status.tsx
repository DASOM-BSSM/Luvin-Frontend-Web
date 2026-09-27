import { Pressable, View } from 'react-native';

import Text from '@/src/components/ui/text';

const LOAD_ERROR_MESSAGE = '대화를 불러오지 못했어요';
const GENERATING_MESSAGE = 'AI가 대화를 만들고 있어요...';
const GENERATION_FAILED_MESSAGE = '대화를 만들지 못했어요';
const EMPTY_MESSAGE = '대화가 아직 없어요';
const RETRY_LABEL = '다시 시도';

interface InfernoEpisodeStatusProps {
  isError: boolean;
  isLoading: boolean;
  /** AI 생성 요청 자체가 실패로 응답한 상태(use-ai-episode-messages 주석 참고). */
  hasGenerationFailed?: boolean;
  /** 생성 실패일 때만 "다시 시도"를 보여준다. 안 넘기면 버튼 없이 문구만 뜬다. */
  onRetry?: () => void;
}

/**
 * 회차 대화가 아직 준비되지 않았을 때(로딩/불러오기 실패/생성 실패) 보여주는 안내.
 *
 * ep1~4 화면이 이 문구를 각자 똑같이 들고 있었는데, "AI 생성 요청 자체가 실패로 응답하면
 * 폴링이 멈춘 채로 남는다"는 문제를 고치면서(use-ai-episode-messages 주석 참고) 재시도
 * 버튼을 네 곳에 따로 붙이는 대신 한 곳으로 모았다.
 */
export default function InfernoEpisodeStatus({
  isError,
  isLoading,
  hasGenerationFailed = false,
  onRetry,
}: InfernoEpisodeStatusProps) {
  const message = hasGenerationFailed
    ? GENERATION_FAILED_MESSAGE
    : isError
      ? LOAD_ERROR_MESSAGE
      : isLoading
        ? GENERATING_MESSAGE
        : EMPTY_MESSAGE;

  return (
    <View className="flex-1 items-center justify-center gap-[12px] px-[30px]">
      <Text variant="body-m" className="text-center text-default-black">
        {message}
      </Text>
      {hasGenerationFailed && onRetry ? (
        <Pressable accessibilityRole="button" accessibilityLabel={RETRY_LABEL} onPress={onRetry}>
          <Text variant="body-s" className="text-state-error">
            {RETRY_LABEL}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
