import { Text as RNText, View } from 'react-native';

import HeartIcon from '@/src/assets/icons/HeartIcon';
import Text from '@/src/components/ui/text';
import { heart } from '@/src/constants/colors';
import { okMallangBTitleStyle } from '@/src/constants/typography';
import InfernoFlipCard from '@/src/features/inferno/components/inferno-flip-card';
import InfernoNoteModal from '@/src/features/inferno/components/inferno-note-modal';
import { CARDFLIP_LIVES } from '@/src/features/inferno/constants/animation';
import useInfernoCardFlipGame from '@/src/features/inferno/hooks/use-inferno-cardflip-game';

interface InfernoCardFlipSceneProps {
  /** 성공 쪽지의 "투표하기". */
  onVotePress: () => void;
  /** 실패 쪽지의 "에피소드 끝내기". */
  onExitPress: () => void;
}

/**
 * Episode 03 카드 뒤집기. Figma `6478:3834`, 성공 `5744:3829`, 실패 `5744:3914`.
 *
 * 카드 16장은 8장씩 두 줄로 고정 배치한다(Figma 의 카드 폭·줄 나눔이 그대로다).
 */
export default function InfernoCardFlipScene({
  onVotePress,
  onExitPress,
}: InfernoCardFlipSceneProps) {
  const game = useInfernoCardFlipGame();
  const isSuccess = game.phase === 'success';
  const isFailure = game.phase === 'failure';
  const isResultVisible = isSuccess || isFailure;
  const isCardDisabled = game.phase !== 'playing' || game.isResolving;
  const firstRow = game.cards.slice(0, 8);
  const secondRow = game.cards.slice(8);

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
        <View className="w-full flex-row items-start justify-between">
          <View className="w-inferno-hud-side" />
          <View className="flex-1 items-center">
            <RNText
              accessibilityRole="header"
              className="text-center text-pink-500"
              style={okMallangBTitleStyle}
            >
              MINI GAME
            </RNText>
            <Text variant="body-m" className="text-center text-inferno-instruction">
              같은 짝끼리 카드를 뒤집어주세요!
            </Text>
          </View>
          <View className="w-inferno-hud-side flex-row items-center justify-end gap-[8px]">
            {Array.from({ length: CARDFLIP_LIVES }, (_, index) => (
              <HeartIcon key={index} color={index < game.lives ? heart.filled : heart.empty} />
            ))}
          </View>
        </View>
        <View className="h-inferno-game-gap shrink-0" />
        <View className="items-center gap-[16px]">
          <View className="flex-row gap-[14px]">
            {firstRow.map((card) => (
              <InfernoFlipCard
                key={card.id}
                card={card}
                disabled={isCardDisabled}
                onPress={game.handleCardPress}
              />
            ))}
          </View>
          <View className="flex-row gap-[14px]">
            {secondRow.map((card) => (
              <InfernoFlipCard
                key={card.id}
                card={card}
                disabled={isCardDisabled}
                onPress={game.handleCardPress}
              />
            ))}
          </View>
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
        onClose={game.handleReset}
      />
    </View>
  );
}
