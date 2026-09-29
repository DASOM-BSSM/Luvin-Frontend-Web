import { Text as RNText, View } from 'react-native';

import Text from '@/src/components/ui/text';
import { okMallangBTitleStyle } from '@/src/constants/typography';
import InfernoNoteModal from '@/src/features/inferno/components/inferno-note-modal';
import InfernoShellCup from '@/src/features/inferno/components/inferno-shell-cup';
import useInfernoShellGame from '@/src/features/inferno/hooks/use-inferno-shell-game';

interface InfernoMiniGameSceneProps {
  /** 성공 쪽지의 "투표하기". */
  onVotePress: () => void;
  /** 실패 쪽지의 "에피소드 끝내기". */
  onExitPress: () => void;
}

/** Episode 03 야바위. Figma 5726:3271, 성공 6689:4266, 실패 6689:4303. */
export default function InfernoMiniGameScene({
  onVotePress,
  onExitPress,
}: InfernoMiniGameSceneProps) {
  const game = useInfernoShellGame();
  const isChoosing = game.phase === 'choosing';
  const isSuccess = game.phase === 'success';
  const isFailure = game.phase === 'failure';
  const isResultVisible = isSuccess || isFailure;

  // 결과 쪽지의 "투표하기"/"에피소드 끝내기".
  function handleResultAction() {
    if (isSuccess) {
      onVotePress();
      return;
    }

    onExitPress();
  }

  return (
    <View className="flex-1">
      <View className="flex-1 justify-end">
        <View className="items-center">
          <RNText
            accessibilityRole="header"
            className="text-center text-pink-500"
            style={okMallangBTitleStyle}
          >
            MINI GAME
          </RNText>
          <Text variant="body-m" className="text-center text-inferno-instruction">
            프레첼이 어디있는지 기억해서 골라주세요!
          </Text>
        </View>
        <View className="h-inferno-game-gap shrink-0" />
        <View className="h-[130px] shrink-0 flex-row justify-center gap-inferno-cup-gap overflow-visible">
          {game.cups.map((cup) => (
            <InfernoShellCup
              key={cup.id}
              cup={cup}
              disabled={!isChoosing}
              onPress={game.handleCupPress}
            />
          ))}
        </View>
      </View>
      <View className="h-inferno-table shrink-0 border-t border-text-primary bg-default-white" />

      <InfernoNoteModal
        visible={isResultVisible}
        widthClass={isSuccess ? 'w-[366px]' : 'w-[344px]'}
        title={isSuccess ? 'SUCCESS!' : 'FAIL!'}
        message={
          isSuccess ? '더 알아가고 싶은 반죽을 골라주세요' : '랜덤으로 상대가 정해져요ㅠㅠ'
        }
        actionLabel={isSuccess ? '투표하기' : '에피소드 끝내기'}
        onActionPress={handleResultAction}
        onClose={game.handleResultClose}
      />
    </View>
  );
}
