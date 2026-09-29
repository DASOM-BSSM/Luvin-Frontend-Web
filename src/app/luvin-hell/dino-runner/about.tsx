import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import AngleUpIcon from '@/src/assets/icons/AngleUpIcon';
import CloudLargeIcon from '@/src/assets/icons/CloudLargeIcon';
import CloudMediumIcon from '@/src/assets/icons/CloudMediumIcon';
import CloudSmallIcon from '@/src/assets/icons/CloudSmallIcon';
import BreadCharacter from '@/src/assets/images/BreadCharacter';
import PlayerAvatar from '@/src/assets/images/PlayerAvatar';
import Text from '@/src/components/ui/text';
import GameFrame from '@/src/features/luvin-hell/components/GameFrame';
import { sceneColors } from '@/src/features/luvin-hell/constants/scene-colors';
import DinoGround from '@/src/features/luvin-hell/games/dino-runner/components/DinoGround';

/** 공룡빵게임 설명. Figma "게임설명1" (6263:6225). */
export default function DinoRunnerAboutScreen() {
  return (
    <View className="flex-1 bg-default-bg">
      <View className="h-[70px]" />

      <View className="flex-col items-center gap-[20px] px-[31px]">
        <View className="w-full flex-col items-start gap-[20px]">
          <Pressable
            accessibilityRole="button"
            className="flex-row items-center"
            onPress={() => router.back()}
          >
            <View className="-rotate-90">
              <AngleUpIcon />
            </View>
            <Text variant="body-s" className="text-default-black">
              돌아가기
            </Text>
          </Pressable>
          <Text variant="heading-h2" className="w-full text-center text-default-black">
            공룡빵게임 설명
          </Text>
        </View>

        <GameFrame>
          <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            <Defs>
              <LinearGradient id="dinoAboutSky" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={sceneColors.sky} />
                <Stop offset="1" stopColor={sceneColors.skyFade} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#dinoAboutSky)" />
          </Svg>
          <View className="absolute left-[37px] top-[99px]">
            <CloudMediumIcon />
          </View>
          <View className="absolute left-[226px] top-[129px]">
            <CloudLargeIcon />
          </View>
          <View className="absolute left-[119px] top-[137px]">
            <CloudSmallIcon />
          </View>

          <DinoGround />

          <Text variant="display-score" className="absolute left-[16px] top-[20px]">
            40
          </Text>

          <View className="absolute bottom-[13px] left-[13px] h-[42px] w-[50px]">
            <BreadCharacter type="donut" state="dough" className="h-full w-full" />
          </View>
          <View className="absolute bottom-[13px] left-[157px] h-[42px] w-[50px]">
            <BreadCharacter type="pretzel" state="dough" className="h-full w-full" />
          </View>
          <View className="absolute bottom-[13px] left-[286px] h-[42px] w-[50px]">
            <BreadCharacter type="castella" state="dough" className="h-full w-full" />
          </View>
          <View className="absolute inset-0 bg-[rgba(29,29,29,0.5)]">
            <View className="absolute left-[45px] top-[264px] max-w-[280px] rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px] bg-yellow-200 px-[20px] py-[10px]">
              <Text variant="body-s" className="text-text-primary">
                빵을 넘어서 피하는 게임이에요!
              </Text>
            </View>
            <View className="absolute left-[102px] top-[324px] max-w-[280px] rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px] bg-yellow-200 px-[20px] py-[10px]">
              <Text variant="body-s" className="text-text-primary">
                하늘에서 날아오는 빵들은{'\n'}아래로 내려 드래그하고,{'\n'}땅에 있는 빵들은{'\n'}탭하여 뛰어넘어요
              </Text>
            </View>
          </View>

          <View className="absolute bottom-[113px] left-[33px] h-[118px] w-[53px]">
            <PlayerAvatar facing="front" className="h-full w-full" />
          </View>
        </GameFrame>

        <Text variant="body-m" className="text-center text-text-primary">
          하트가 닳기 전에 미션을 완료해야해요!!
        </Text>
      </View>
    </View>
  );
}
