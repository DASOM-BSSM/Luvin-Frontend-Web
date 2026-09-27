import { router, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import ProfileIcon from '@/src/assets/icons/ProfileIcon';
import LuvinLogo from '@/src/assets/images/LuvinLogo';
import BottomNav from '@/src/components/bottom-nav';
import Screen from '@/src/components/ui/screen';
import SectionHeader from '@/src/components/ui/section-header';
import Text from '@/src/components/ui/text';
import BreadSurveyPromptCard from '@/src/features/home/components/bread-survey-prompt-card';
import CreateQuestionCard from '@/src/features/home/components/create-question-card';
import DiaryPreviewCard from '@/src/features/home/components/diary-preview-card';
import DiaryStartCard from '@/src/features/home/components/diary-start-card';
import EpisodeEmptyCard from '@/src/features/home/components/episode-empty-card';
import EpisodeThumbnailCard from '@/src/features/home/components/episode-thumbnail-card';
import MyProfileCard from '@/src/features/home/components/my-profile-card';
import { useAuthStore } from '@/src/features/auth/store/auth-store';
import useBreadProfile from '@/src/features/bread/hooks/use-bread-profile';
import InfernoNoticeModal from '@/src/features/inferno/components/inferno-notice-modal';
import {
  INFERNO_EPISODE_HREFS,
  infernoIntroHref,
} from '@/src/features/inferno/constants/routes';
import useCreateSeason from '@/src/features/inferno/hooks/use-create-season';
import { useInfernoStore } from '@/src/features/inferno/store/inferno-store';
import { findNextInfernoEpisode } from '@/src/features/inferno/utils/progress';
import type { DiaryPreview } from '@/src/features/home/types';
import useMySurveyResult from '@/src/features/survey/hooks/use-my-survey-result';

// API 연동 전. 이 상수를 값으로 채우면 감정일기가 쌓인 상태가 된다.
// 내 반죽은 useBreadStore, 이번주 에피소드는 useInfernoStore 에서 나온다.
const DIARY_PREVIEW: DiaryPreview | null = null;

export default function HomeScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const { profile } = useBreadProfile();
  const hasBread = profile !== null;
  const [isNoticeVisible, setIsNoticeVisible] = useState(false);
  const completedOrders = useInfernoStore((state) => state.completedOrders);
  const surveyResultQuery = useMySurveyResult();
  const createSeasonMutation = useCreateSeason();

  // 로그인 안 된 채로 홈에 들어오면(딥링크 등) 온보딩으로 돌려보낸다. hydrate 가 끝나기
  // 전에는 아직 모르는 상태이므로 판단하지 않는다.
  useEffect(() => {
    if (!isHydrating && !isAuthenticated) {
      router.replace('/onboarding');
    }
  }, [isHydrating, isAuthenticated]);

  // ep0 을 끝내기 전에는 보여줄 회차가 없다. 끝내면 다음 회차가 이번주 에피소드가 된다.
  const hasStartedInferno = completedOrders.length > 0;
  const weeklyEpisode = hasStartedInferno ? findNextInfernoEpisode(completedOrders) : undefined;

  if (__DEV__) {
    // 홈 카드가 잘못된 회차를 보여준다는 신고를 조사하려고 실제 로컬 진행 기록을 찍는다 —
    // completedOrders 가 비어있지 않은데 잘못된 값이면 useInfernoStore.resetProgress 가
    // 실제로 안 먹은 것이고, [0,1]이 정말 들어있으면 로그인 이후 이 계정에서 0/1화를
    // 진짜로 완료 처리한 것이다(버그가 아니라 정상 진행).
    console.log(
      `[HomeScreen] completedOrders=${JSON.stringify(completedOrders)} weeklyEpisode=${weeklyEpisode?.order}`,
    );
  }

  // 본문이 아직 없는 회차는 눌러도 갈 곳이 없다. 그런 회차는 카드를 누르지 못하게 둔다.
  const canOpenWeeklyEpisode =
    weeklyEpisode !== undefined && INFERNO_EPISODE_HREFS[weeklyEpisode.order] !== undefined;

  /**
   * 러빈지옥으로 들어가는 유일한 문.
   *
   * 반죽이 없으면 시작할 수 없다. 막기만 하지 않고 설문으로 갈 길을 열어 준다.
   * 시작 버튼이든 이번주 에피소드 카드든 반드시 여기를 지나게 해서, 들어가는 입구가 늘어도
   * 검사를 빠뜨리지 않게 한다.
   */
  function openInferno(href: Href) {
    if (!hasBread) {
      setIsNoticeVisible(true);
      return;
    }

    // 시즌이 이미 있으면 서버가 그대로 돌려주므로(SHARED_API_CONTRACT.md §7) 매번 불러도
    // 안전하다 — 처음 들어가는 사람만 실제로 새로 만들어진다.
    const surveyResultId = surveyResultQuery.data?.resultId;
    if (!surveyResultId) {
      return;
    }

    createSeasonMutation.mutate(surveyResultId, {
      onSuccess: () => router.push(href),
    });
  }

  function handleInfernoStartPress() {
    openInferno('/inferno');
  }

  // 이번주 에피소드는 시작 화면부터 본다. 본문으로 바로 뛰지 않는 건 ep0 과 같은 흐름이다.
  function handleWeeklyEpisodePress() {
    if (!weeklyEpisode) {
      return;
    }

    openInferno(infernoIntroHref(weeklyEpisode.order));
  }

  function handleNoticeClose() {
    setIsNoticeVisible(false);
  }

  function handleNoticeSurveyPress() {
    setIsNoticeVisible(false);
    router.push('/survey');
  }

  function handleOvenNavigate() {
    router.push('/oven');
  }

  function handleProfilePress() {
    router.push('/my-page');
  }

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-col gap-[40px] px-[30px] pb-[24px] pt-[26px]"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full flex-col items-start gap-[28px]">
          <View className="w-full flex-col items-start gap-[24px]">
            <View className="w-full flex-row items-start justify-between">
              <LuvinLogo />
              <Pressable accessibilityRole="button" accessibilityLabel="마이페이지" onPress={handleProfilePress}>
                <ProfileIcon />
              </Pressable>
            </View>
            <View className="w-full flex-col items-start px-[4px]">
              <Text variant="heading-h2" className="text-default-black">
                타이밍을 놓치기 전에,
              </Text>
              <Text variant="body-m" className="text-default-black">
                러빈과 함께 가장 따뜻한 사랑을 만들어요
              </Text>
            </View>
          </View>
          {profile ? <MyProfileCard profile={profile} /> : <BreadSurveyPromptCard />}
        </View>

        <View className="w-full flex-col items-start gap-[12px]">
          <SectionHeader
            title="이번주 에피소드"
            actionLabel={hasBread ? '러빈지옥 바로가기→' : undefined}
            onActionPress={hasBread ? handleOvenNavigate : undefined}
          />
          {weeklyEpisode ? (
            <EpisodeThumbnailCard
              episode={weeklyEpisode}
              onPress={canOpenWeeklyEpisode ? handleWeeklyEpisodePress : undefined}
            />
          ) : (
            <EpisodeEmptyCard onStartPress={handleInfernoStartPress} />
          )}
        </View>

        <View className="w-full flex-col items-start gap-[12px]">
          <SectionHeader
            title={hasBread ? '쫀쫀한 조합들' : '감정일기'}
            actionLabel={hasBread ? '감정일기 바로가기→' : undefined}
          />
          {DIARY_PREVIEW ? (
            <>
              <DiaryPreviewCard diary={DIARY_PREVIEW} />
              <CreateQuestionCard />
            </>
          ) : (
            <DiaryStartCard />
          )}
        </View>
      </ScrollView>

      <View className="pb-[10px]">
        <BottomNav active="home" />
      </View>

      <InfernoNoticeModal
        visible={isNoticeVisible}
        onClose={handleNoticeClose}
        onSurveyPress={handleNoticeSurveyPress}
      />
    </Screen>
  );
}
