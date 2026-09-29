import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import Text from '@/src/components/ui/text';
import useBreadProfile from '@/src/features/bread/hooks/use-bread-profile';
import InfernoAnalysisScene from '@/src/features/inferno/components/inferno-analysis-scene';
import InfernoEpisodeFrame from '@/src/features/inferno/components/inferno-episode-frame';
import InfernoFinalMatchScene from '@/src/features/inferno/components/inferno-final-match-scene';
import InfernoHighlightScene from '@/src/features/inferno/components/inferno-highlight-scene';
import InfernoWrapUpScene from '@/src/features/inferno/components/inferno-wrap-up-scene';
import useInfernoEp5Flow from '@/src/features/inferno/hooks/use-inferno-ep5-flow';
import useInfernoSeasonSummary from '@/src/features/inferno/hooks/use-inferno-season-summary';
import { useInfernoStore } from '@/src/features/inferno/store/inferno-store';
import type { InfernoSeasonSummary } from '@/src/features/inferno/types';
import { findInfernoEpisode } from '@/src/features/inferno/utils/episodes';
import type { BreadProfile } from '@/src/features/home/types';

const EPISODE_ORDER = 5;

/**
 * [DRAFT] 시즌 마무리. Figma 디자인이 아직 없는 상태에서 기능부터 먼저 만든 화면이다
 * (AGENTS.md §8 은 원래 디자인을 먼저 읽으라고 하지만, 이번엔 사용자 요청으로 예외).
 * 색상/자간/버튼 등은 전부 기존 토큰·컴포넌트를 그대로 조합한 임시 배치이니, 디자인이
 * 나오면 이 화면(과 아래 4개 씬 컴포넌트)을 다시 손봐야 한다는 걸 리뷰어가 알고 있을 것.
 *
 * ep3/ep4 와 같은 이유로 잠시 나가기 체크포인트를 두지 않는다 — 되돌릴 대화 상태가 없는
 * 단순 리포트라 다시 들어오면 1페이지부터 봐도 무방하다.
 *
 * FRONTEND_CHANGES.md §4: `SAMPLE_BREAD_PROFILE` 폴백을 걷어냈다 — 서버 결과 없이 가짜
 * 반죽으로 화면을 보여주지 않는다. 내 반죽은 `useBreadProfile`(서버 설문 결과가 원천)로
 * 받고, 아직 없거나(`isSurveyMissing`)/로딩/에러 상태면 리포트 로딩·에러와 같은 안내
 * 화면으로 합쳐서 처리한다(§11 — 빈 화면 금지).
 */
export default function InfernoEp5Screen() {
  const completeEpisode = useInfernoStore((state) => state.completeEpisode);
  const episode = findInfernoEpisode(EPISODE_ORDER);
  const breadProfile = useBreadProfile();
  const {
    summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    hasGenerationFailed,
    retryGeneration,
  } = useInfernoSeasonSummary(EPISODE_ORDER);
  const flow = useInfernoEp5Flow();

  // "잠시 나가기" 는 스킵과 다르다. 본 것으로 치지 않아서 다시 들어오면 처음부터다.
  function handleExitPress() {
    router.dismissTo('/');
  }

  const isLoading = isSummaryLoading || breadProfile.isLoading;
  const isError = isSummaryError || breadProfile.isError;
  const myProfile = breadProfile.profile;

  // AI가 아직 리포트를 안 만들었거나 실패했거나, 내 반죽(서버 설문 결과)이 아직 없으면
  // 빈 화면 대신 안내를 보여준다(§11, ep1~4 와 같은 이유).
  if (!episode || !summary || !myProfile) {
    return (
      <InfernoEpisodeFrame episode={episode ?? { order: EPISODE_ORDER, title: '' }} surface="note" skipLabel="잠시 나가기" onSkipPress={handleExitPress}>
        <View className="flex-1 items-center justify-center gap-[12px] px-[30px]">
          <Text variant="body-m" className="text-center text-default-black">
            {hasGenerationFailed
              ? '리포트를 만들지 못했어요'
              : isError
                ? '정보를 불러오지 못했어요'
                : breadProfile.isSurveyMissing
                  ? '설문을 먼저 완료해주세요'
                  : isLoading
                    ? 'AI가 리포트를 만들고 있어요...'
                    : '리포트가 아직 없어요'}
          </Text>
          {hasGenerationFailed ? (
            <Pressable accessibilityRole="button" accessibilityLabel="다시 시도" onPress={retryGeneration}>
              <Text variant="body-s" className="text-state-error">
                다시 시도
              </Text>
            </Pressable>
          ) : null}
        </View>
      </InfernoEpisodeFrame>
    );
  }

  // "다음 시즌 시작하기": 새 시즌의 첫 회차로 이어지는 동작이라 가이드(ep0)로 보낸다.
  function handleNextSeasonPress() {
    completeEpisode(EPISODE_ORDER);
    router.push('/inferno/ep0');
  }

  // "시즌 끝내기": 새로 시작하지 않고 허브(오븐 화면)로만 돌아간다.
  function handleEndSeasonPress() {
    completeEpisode(EPISODE_ORDER);
    router.push('/oven');
  }

  // summary/myProfile 을 매개변수로 받는 이유: 위 가드로 좁혀진 타입이 중첩 함수 클로저
  // 안에서는 유지되지 않는다(TS18048) — 인자로 넘기면 호출부의 좁혀진 타입이 그대로 전달된다.
  function renderPage(summary: InfernoSeasonSummary, myProfile: BreadProfile) {
    switch (flow.pageIndex) {
      case 0:
        return <InfernoFinalMatchScene result={summary.finalMatch} myProfile={myProfile} />;
      case 1:
        return <InfernoAnalysisScene report={summary.report} />;
      case 2:
        return <InfernoHighlightScene highlights={summary.highlights} />;
      default:
        return (
          <InfernoWrapUpScene
            onEndSeasonPress={handleEndSeasonPress}
            onNextSeasonPress={handleNextSeasonPress}
          />
        );
    }
  }

  return (
    <InfernoEpisodeFrame
      episode={episode}
      surface="note"
      skipLabel="잠시 나가기"
      onPreviousPress={flow.goPrevious}
      onNextPress={flow.goNext}
      onSkipPress={handleExitPress}
    >
      {renderPage(summary, myProfile)}
    </InfernoEpisodeFrame>
  );
}
