import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import BreadNavIcon from '@/src/assets/icons/BreadNavIcon';
import HomeNavIcon from '@/src/assets/icons/HomeNavIcon';
import OvenNavIcon from '@/src/assets/icons/OvenNavIcon';
import SentimentNavIcon from '@/src/assets/icons/SentimentNavIcon';
import theme from '@/src/constants/theme';

/** 'none' 은 마이페이지처럼 탭 바에 없는 화면에서 쓴다 — 네 아이콘 다 비활성 색으로 보인다. */
export type BottomNavItem = 'home' | 'oven' | 'diary' | 'bread' | 'none';

/** 선택된 항목은 brown 900, 나머지는 brown 300 을 쓴다. */
const ACTIVE_COLOR = theme.brown[900];
const INACTIVE_COLOR = theme.brown[300];

function iconColor(item: BottomNavItem, active: BottomNavItem): string {
  return item === active ? ACTIVE_COLOR : INACTIVE_COLOR;
}

interface BottomNavProps {
  active?: BottomNavItem;
}

/** 하단 알약형 내비게이션. 탭 이동은 이 컴포넌트가 직접 처리한다(bread-survey-prompt-card 등과 같은 패턴). */
export default function BottomNav({ active = 'home' }: BottomNavProps) {
  function handleHomeTabPress() {
    if (active === 'home') return;
    router.push('/');
  }

  function handleOvenTabPress() {
    if (active === 'oven') return;
    router.push('/oven');
  }

  function handleBreadTabPress() {
    if (active === 'bread') return;
    router.push('/bread');
  }

  return (
    <View className="flex-row items-center justify-center gap-[64px] self-center rounded-[24px] bg-yellow-200 px-[30px] py-[16px]">
      <Pressable accessibilityRole="button" onPress={handleHomeTabPress}>
        <HomeNavIcon color={iconColor('home', active)} />
      </Pressable>
      <Pressable accessibilityRole="button" onPress={handleOvenTabPress}>
        <OvenNavIcon color={iconColor('oven', active)} />
      </Pressable>
      {/* 감정일기 탭은 아직 목적지 화면이 없다 — 제품 결정에 따라 탭은 그대로 두고 눌러도 아무 동작을 하지 않는다. */}
      <SentimentNavIcon color={iconColor('diary', active)} />
      <Pressable accessibilityRole="button" onPress={handleBreadTabPress}>
        <BreadNavIcon color={iconColor('bread', active)} />
      </Pressable>
    </View>
  );
}
