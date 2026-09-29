import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import AngleUpIcon from '@/src/assets/icons/AngleUpIcon';
import ProfileAvatarPhoto from '@/src/assets/images/ProfileAvatarPhoto';
import BottomNav from '@/src/components/bottom-nav';
import Button from '@/src/components/ui/button';
import Screen from '@/src/components/ui/screen';
import Text from '@/src/components/ui/text';
import useBreadProfile from '@/src/features/bread/hooks/use-bread-profile';
import BreadSurveyPromptCard from '@/src/features/home/components/bread-survey-prompt-card';
import MyProfileCard from '@/src/features/home/components/my-profile-card';
import { useTokenStore } from '@/src/features/luvin-hell/store/token-store';
import useTokenBalance from '@/src/features/tokens/hooks/use-token-balance';
import { useProfileSettingsStore } from '@/src/features/my-page/store/profile-settings-store';
import useMyProfile from '@/src/features/user/hooks/use-my-profile';

/**
 * 마이페이지. Figma "마이페이지-미수"(6263:5785).
 *
 * 홈 화면 우상단 분홍 프로필 아이콘(§ ProfileIcon)의 목적지 — 탭 바에는 없는 화면이라
 * BottomNav 는 어떤 탭도 선택 표시하지 않는다.
 */
export default function MyPageScreen() {
  const { profile } = useBreadProfile();
  const balance = useTokenStore((state) => state.balance);
  const gender = useProfileSettingsStore((state) => state.gender);
  const myProfileQuery = useMyProfile();
  useTokenBalance();

  function handleBackPress() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  }

  function handleProfileDetailPress() {
    router.push('/my-page/edit');
  }

  function handleEarnTokenPress() {
    router.push('/luvin-hell');
  }

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-col gap-[40px] px-[30px] pb-[24px] pt-[26px]"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full flex-row items-end gap-[12px]">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="뒤로가기"
            className="size-[24px] items-center justify-center"
            onPress={handleBackPress}
          >
            <View className="-rotate-90">
              <AngleUpIcon />
            </View>
          </Pressable>
          <Text variant="heading-h4" className="text-text-primary">
            마이페이지
          </Text>
        </View>

        <View className="w-full flex-col items-start gap-[12px]">
          <Text variant="heading-h5" className="text-text-primary">
            내 프로필
          </Text>
          <View className="w-full flex-col items-center justify-center gap-[16px] rounded-[8px] border border-default-gray px-[30px] py-[20px]">
            <View className="w-full flex-row items-center gap-[20px]">
              <ProfileAvatarPhoto gender={gender} />
              <View className="flex-1 flex-col items-start justify-center gap-[8px]">
                <View className="flex-row items-center gap-[12px]">
                  {myProfileQuery.isPending ? (
                    <Text variant="heading-h4" className="text-text-primary">
                      불러오는 중...
                    </Text>
                  ) : myProfileQuery.isError ? (
                    <Pressable accessibilityRole="button" onPress={() => myProfileQuery.refetch()}>
                      <Text variant="body-s" className="text-state-error">
                        프로필을 불러오지 못했어요. 다시 시도
                      </Text>
                    </Pressable>
                  ) : (
                    // "내 프로필"엔 닉네임만 — 반죽 이름은 아래 "내 분신" 카드에서만 보여준다
                    // (사용자 확인: 여기 중복 노출 금지).
                    <Text variant="heading-h4" className="text-text-primary">
                      {myProfileQuery.data.nickname}
                    </Text>
                  )}
                </View>
                <Button
                  label="내 정보 자세히 보기"
                  variant="outline"
                  onPress={handleProfileDetailPress}
                />
              </View>
            </View>
          </View>
        </View>

        <View className="w-full flex-col items-start gap-[12px]">
          <Text variant="heading-h5" className="text-text-primary">
            내 분신
          </Text>
          {profile ? <MyProfileCard profile={profile} /> : <BreadSurveyPromptCard />}
        </View>

        <View className="w-full flex-col items-start gap-[12px]">
          <Text variant="heading-h5" className="text-text-primary">
            현재 보유 토큰
          </Text>
          <View className="w-full flex-col items-center gap-[12px] rounded-[8px] bg-brown-100 px-[30px] py-[20px]">
            <View className="w-full flex-row items-center justify-between">
              <Text variant="heading-h4" className="text-text-primary">
                Bread_Token
              </Text>
              <Text variant="body-s" className="text-text-primary">
                {balance} 🥐
              </Text>
            </View>
            <Button
              label="토큰 벌기"
              variant="outline"
              className="w-full"
              onPress={handleEarnTokenPress}
            />
          </View>
        </View>
      </ScrollView>

      <View className="pb-[10px]">
        <BottomNav active="none" />
      </View>
    </Screen>
  );
}
