import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import AngleUpIcon from '@/src/assets/icons/AngleUpIcon';
import Text from '@/src/components/ui/text';
import { useTokenStore } from '@/src/features/luvin-hell/store/token-store';

const RULES = [
  '01. 오늘의 미션을 완료하면 보상 토큰을 받아요',
  '02. 모은 토큰으로 다음 에피소드를 오픈해요',
  '03. 난이도에 따라 토큰 양이 달라져요',
];

/** 미니게임 공통 설명. Figma "미니게임 설명" (6041:2962). */
export default function LuvinHellAboutScreen() {
  const balance = useTokenStore((state) => state.balance);

  return (
    <View className="flex-1 bg-default-bg">
      <View className="h-[70px]" />

      <View className="flex-col items-center gap-[60px] px-[30px]">
        <Pressable
          accessibilityRole="button"
          className="w-full flex-row items-center"
          onPress={() => router.back()}
        >
          <View className="-rotate-90">
            <AngleUpIcon />
          </View>
          <Text variant="body-s" className="text-default-black">
            미니게임 하러가기
          </Text>
        </Pressable>

        <View className="w-full flex-col items-center gap-[60px]">
          <View className="w-full flex-col items-center gap-[28px]">
            <View className="items-center gap-[8px]">
              <Text variant="heading-h2" className="text-center text-default-black">
                토큰 없인 러빈지옥도 없어요...
              </Text>
              <Text variant="body-m" className="text-default-black">
                현재 보유 토큰: 🥐x{balance}
              </Text>
            </View>

            <View className="w-full flex-col gap-[8px] rounded-[8px] border border-default-gray bg-yellow-200 p-[20px]">
              <Text variant="body-s" className="text-default-black">
                토큰: 🥐
              </Text>
              <Text variant="body-s" className="text-text-primary">
                미니게임을 통해 토큰을 모아{'\n'}나만의 러빈지옥을 계속 진행 할 수 있어요
              </Text>
            </View>
          </View>

          <View className="w-full flex-col gap-[16px]">
            {RULES.map((rule) => (
              <View key={rule} className="w-full rounded-[8px] border border-default-gray px-[20px] py-[12px]">
                <Text variant="body-s" className="text-text-primary">
                  {rule}
                </Text>
              </View>
            ))}
          </View>

          <Text variant="body-m" className="text-center text-text-primary">
            게임 화면 상단에 뜨는 미션을 성공하고{'\n'}보상을 받아가세요!
          </Text>
        </View>
      </View>
    </View>
  );
}
