import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';

import AngleUpIcon from '@/src/assets/icons/AngleUpIcon';
import ProfileAvatarPhoto from '@/src/assets/images/ProfileAvatarPhoto';
import BottomNav from '@/src/components/bottom-nav';
import Button from '@/src/components/ui/button';
import Screen from '@/src/components/ui/screen';
import Text from '@/src/components/ui/text';
import useLogout from '@/src/features/auth/hooks/use-logout';
import { useBreadStore } from '@/src/features/bread/store/bread-store';
import { useInfernoStore } from '@/src/features/inferno/store/inferno-store';
import GenderSelectButton from '@/src/features/my-page/components/gender-select-button';
import NicknameEditField from '@/src/features/my-page/components/nickname-edit-field';
import { useProfileSettingsStore } from '@/src/features/my-page/store/profile-settings-store';
import type { Gender } from '@/src/features/my-page/types';
import { useSurveyStore } from '@/src/features/survey/store/survey-store';
import { useTokenStore } from '@/src/features/luvin-hell/store/token-store';
import useTokenBalance from '@/src/features/tokens/hooks/use-token-balance';
import useMyProfile from '@/src/features/user/hooks/use-my-profile';
import useUpdateProfile from '@/src/features/user/hooks/use-update-profile';
import queryClient from '@/src/lib/query-client';

/**
 * 내 정보 자세히 보기/수정. Figma "내 정보 수정-미수"(6300:8004).
 *
 * 마이페이지의 "내 정보 자세히 보기" 버튼 목적지.
 */
export default function MyPageEditScreen() {
  const balance = useTokenStore((state) => state.balance);
  const gender = useProfileSettingsStore((state) => state.gender);
  const setGender = useProfileSettingsStore((state) => state.setGender);
  const nickname = useProfileSettingsStore((state) => state.nickname);
  const setNickname = useProfileSettingsStore((state) => state.setNickname);
  const logoutMutation = useLogout();
  const myProfileQuery = useMyProfile();
  const updateProfileMutation = useUpdateProfile();
  useTokenBalance();

  // 로컬 닉네임 초안이 아직 없으면(한 번도 이 화면에서 수정 안 했으면) 서버 값으로 채운다 —
  // 그래야 필드가 빈 채로 뜨지 않는다.
  useEffect(() => {
    if (myProfileQuery.data && !nickname) {
      setNickname(myProfileQuery.data.nickname);
    }
  }, [myProfileQuery.data, nickname, setNickname]);

  // gender 는 nickname 과 달리 로컬 기본값(male)이 항상 있어서 "비어있으면 채운다" 방식을
  //못 쓴다 — 그래서 "이번에 화면 연 뒤 서버 값으로 한 번 채웠는지"를 ref 로 따로 추적한다.
  // 서버 값이 로컬 Gender('female'|'male')와 다른 포맷(예: 'MALE')이면 조용히 건너뛴다 —
  // 로컬 기본값이 남는 게 UI 를 못 그리는 것보다 낫다(§ UpdateUserProfileInput 주석 참고).
  const hasSyncedGenderRef = useRef(false);
  useEffect(() => {
    const serverGender = myProfileQuery.data?.gender;
    if (hasSyncedGenderRef.current || !serverGender) {
      return;
    }

    hasSyncedGenderRef.current = true;
    if (serverGender === 'female' || serverGender === 'male') {
      setGender(serverGender satisfies Gender);
    }
  }, [myProfileQuery.data, setGender]);

  function handleBackPress() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/my-page');
  }

  function handleFemaleSelect() {
    setGender('female');
  }

  function handleMaleSelect() {
    setGender('male');
  }

  function handleSaveInfoPress() {
    updateProfileMutation.mutate({ nickname, gender }, { onSuccess: handleBackPress });
  }

  function handleLogoutSettled() {
    router.replace('/onboarding');
  }

  function handleLogoutConfirm() {
    logoutMutation.mutate(undefined, { onSettled: handleLogoutSettled });
  }

  function handleLogoutPress() {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠어요?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: handleLogoutConfirm },
    ]);
  }

  function handleWithdrawPress() {
    Alert.alert('계정 탈퇴', '정말 계정을 탈퇴하시겠어요? 이 작업은 되돌릴 수 없어요.', [
      { text: '취소', style: 'cancel' },
      { text: '탈퇴', style: 'destructive', onPress: () => router.replace('/onboarding') },
    ]);
  }

  // TEMP DEBUG(러빈지옥 로컬 진행 상태 초기화 — 백엔드가 계정의 AI 시즌을 리셋해준 뒤,
  // 반죽 만드는 것부터 다시 테스트할 때 씀). 확인 끝나면 지울 것.
  function handleDebugResetInfernoProgress() {
    Alert.alert('[DEV] 러빈지옥 초기화', '완료 기록/이어보기 자리를 로컬에서 지워요. 계속할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '초기화',
        style: 'destructive',
        onPress: () => {
          useInfernoStore.getState().resetProgress();
          useBreadStore.getState().clear();
          useSurveyStore.getState().resetSurvey();
          queryClient.clear();
          router.replace('/');
        },
      },
    ]);
  }

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-col items-end gap-[80px] px-[30px] pb-[24px] pt-[26px]"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full flex-col items-start gap-[40px]">
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
              내 정보 자세히 보기
            </Text>
          </View>

          <View className="w-full flex-col items-center justify-center gap-[16px] rounded-[8px] border border-default-gray px-[30px] py-[12px]">
            <View className="w-full flex-row items-center gap-[20px]">
              <ProfileAvatarPhoto gender={gender} />
              <View className="flex-1 flex-col items-start justify-center gap-[4px]">
                <View className="flex-row items-center gap-[12px]">
                  {myProfileQuery.isPending ? (
                    <Text variant="heading-h4" className="text-text-primary">
                      불러오는 중...
                    </Text>
                  ) : myProfileQuery.isError ? (
                    <Pressable accessibilityRole="button" onPress={() => myProfileQuery.refetch()}>
                      <Text variant="body-s" className="text-state-error">
                        불러오지 못했어요. 다시 시도
                      </Text>
                    </Pressable>
                  ) : (
                    <Text variant="heading-h4" className="text-text-primary">
                      {myProfileQuery.data.nickname}
                    </Text>
                  )}
                </View>
                <Text variant="body-xs" className="text-default-black">
                  현재 보유 토큰: 🥐x{balance}
                </Text>
              </View>
            </View>
          </View>

          <View className="w-full flex-col items-start gap-[60px]">
            <View className="w-full flex-col items-start gap-[24px]">
              <View className="w-full flex-col items-start gap-[8px]">
                <Text variant="heading-h5" className="text-text-primary">
                  어떻게 불러드릴까요?
                </Text>
                <NicknameEditField />
              </View>

              <View className="w-full flex-col items-start gap-[12px]">
                <View className="flex-col items-start gap-[4px]">
                  <Text variant="heading-h5" className="text-text-primary">
                    성별을 알려주세요
                  </Text>
                  <Text variant="body-xs" className="text-text-muted">
                    캐릭터의 성별을 정할때 외에는 사용하지 않습니다
                  </Text>
                </View>
                <View className="flex-row items-start gap-[8px]">
                  <GenderSelectButton
                    label="여성"
                    selected={gender === 'female'}
                    onPress={handleFemaleSelect}
                  />
                  <GenderSelectButton
                    label="남성"
                    selected={gender === 'male'}
                    onPress={handleMaleSelect}
                  />
                </View>
              </View>
            </View>

            <Button
              label="내 정보 저장하기"
              variant="infoSave"
              disabled={updateProfileMutation.isPending}
              onPress={handleSaveInfoPress}
            />
          </View>
        </View>

        <View className="flex-row items-center gap-[12px]">
          <Pressable accessibilityRole="button" onPress={handleLogoutPress}>
            <Text variant="body-s" className="text-state-error">
              로그아웃
            </Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={handleWithdrawPress}>
            <Text variant="body-s" className="text-text-muted">
              계정 탈퇴
            </Text>
          </Pressable>
          {__DEV__ ? (
            <Pressable accessibilityRole="button" onPress={handleDebugResetInfernoProgress}>
              <Text variant="body-s" className="text-state-error">
                [DEV] 러빈지옥 초기화
              </Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>

      <View className="pb-[10px]">
        <BottomNav active="none" />
      </View>
    </Screen>
  );
}
