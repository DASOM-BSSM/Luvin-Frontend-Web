import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import AngleUpIcon from '@/src/assets/icons/AngleUpIcon';
import BreadCharacter from '@/src/assets/images/BreadCharacter';
import PlayerAvatar from '@/src/assets/images/PlayerAvatar';
import Text from '@/src/components/ui/text';
import GameFrame from '@/src/features/luvin-hell/components/GameFrame';
import { sceneColors } from '@/src/features/luvin-hell/constants/scene-colors';
import {
  LANE_ROTATION_DEG,
  RAIL_TRAIN_CAR_COUNT,
  RAIL_TRAIN_CAR_OVERLAP,
  RAIL_TRAIN_ROTATION_DEG,
} from '@/src/features/luvin-hell/games/bread-crossing/engine/constants';

/** 5줄 정적 프리뷰: 기찻길(바게트 기차) / 초원 / 도로 / 강(뗏목) / 초원. */
const LANE_ROWS = [
  { color: sceneColors.trackBase, isTrack: true },
  { color: sceneColors.grass, isTrack: false },
  { color: sceneColors.trackBase, isTrack: true },
  { color: sceneColors.river, isTrack: false },
  { color: sceneColors.grass, isTrack: false },
];

/** 빵건너친구들 설명. Figma "게임설명2" (6285:7219). */
export default function BreadCrossingAboutScreen() {
  return (
    <View className="flex-1 bg-default-bg">
      <View className="h-[70px]" />

      <View className="flex-col items-center gap-[20px] px-[31px]">
        <View className="w-full flex-col items-start gap-[20px]">
          <Pressable accessibilityRole="button" className="flex-row items-center" onPress={() => router.back()}>
            <View className="-rotate-90">
              <AngleUpIcon />
            </View>
            <Text variant="body-s" className="text-default-black">
              돌아가기
            </Text>
          </Pressable>
          <Text variant="heading-h2" className="w-full text-center text-default-black">
            빵건너친구들 설명
          </Text>
        </View>

        <GameFrame>
          <View className="absolute inset-0 flex-col overflow-hidden">
            {LANE_ROWS.map((row, i) => (
              <View key={i} className="w-full flex-1 items-center justify-center overflow-hidden">
                <View
                  className="h-[80px] w-[420px]"
                  style={{ backgroundColor: row.color, transform: [{ rotate: `${LANE_ROTATION_DEG}deg` }] }}
                />
              </View>
            ))}
          </View>

          {/* 기찻길 — 바게트 4개 연결된 전용 기차, 전체 -43.02도 회전(다른 장애물과 다양화 풀을 공유하지 않음). */}
          <View
            className="absolute left-[70px] top-[50px]"
            style={{ transform: [{ rotate: `${RAIL_TRAIN_ROTATION_DEG}deg` }] }}
          >
            <View className="flex-row">
              {Array.from({ length: RAIL_TRAIN_CAR_COUNT }, (_, i) => (
                <View key={i} className="h-[36px] w-[36px]" style={{ marginLeft: i === 0 ? 0 : -RAIL_TRAIN_CAR_OVERLAP }}>
                  <BreadCharacter type="baguette" state="dough" className="h-full w-full" />
                </View>
              ))}
            </View>
          </View>
          {/* 도로 차량 빵 */}
          <View className="absolute right-[40px] top-[220px] h-[40px] w-[40px]">
            <BreadCharacter type="pretzel" state="dough" className="h-full w-full" />
          </View>
          {/* 강 뗏목 + 빵 */}
          <View className="absolute left-[40px] top-[290px] h-[48px] w-[48px] rounded-[6px]" style={{ backgroundColor: sceneColors.woodAccent }}>
            <View className="absolute inset-[6px]">
              <BreadCharacter type="donut" state="dough" className="h-full w-full" />
            </View>
          </View>

          <Text variant="display-score" className="absolute left-[16px] top-[20px]">
            40
          </Text>

          <View className="absolute inset-0 bg-[rgba(29,29,29,0.5)]">
            <View className="absolute left-[34px] top-[276px] max-w-[280px] rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px] bg-yellow-200 px-[20px] py-[10px]">
              <Text variant="body-s" className="text-text-primary">
                자동차처럼 굴러오는 빵을 피해야해요!
              </Text>
            </View>
            <View className="absolute left-[97px] top-[338px] max-w-[280px] rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px] bg-yellow-200 px-[20px] py-[10px]">
              <Text variant="body-s" className="text-text-primary">
                기차처럼 달려오는 빵과{'\n'}자동차처럼 굴러오는 빵들을{'\n'}피해 앞뒤좌우로 드래그해요
              </Text>
            </View>
          </View>

          <View className="absolute bottom-[113px] left-[33px] h-[118px] w-[53px]">
            <PlayerAvatar facing="back" className="h-full w-full" />
          </View>
        </GameFrame>

        <Text variant="body-m" className="text-center text-text-primary">
          하트가 닳기 전에 미션을 완료해야해요!!
        </Text>
      </View>
    </View>
  );
}
