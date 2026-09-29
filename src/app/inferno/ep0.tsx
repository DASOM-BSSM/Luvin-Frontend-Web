import { router } from 'expo-router';
import { useState } from 'react';

import InfernoEpisodeFrame from '@/src/features/inferno/components/inferno-episode-frame';
import { EP0_SCENES } from '@/src/features/inferno/constants/scenes';
import { useInfernoStore } from '@/src/features/inferno/store/inferno-store';
import { findInfernoEpisode } from '@/src/features/inferno/utils/episodes';

/** 이 화면이 보여주는 회차. */
const EPISODE_ORDER = 0;

/**
 * 러빈지옥 ep0 본문. Figma `ep0` (6340:8355, 6340:8388).
 *
 * 장면을 라우트로 쪼개지 않고 한 화면이 순서대로 넘긴다. 상단 바의 이전/다음이 그 순서를
 * 따라가고, 장면을 추가할 때 라우트 파일을 늘리지 않아도 된다.
 *
 * 첫 장면에서는 돌아갈 곳이 없어 이전 버튼이 흐려진다. 마지막 장면의 다음 버튼은 흐려지지
 * 않고 에피소드를 끝내며 홈으로 보낸다.
 *
 * 시안처럼 바가 네 방향 모두 화면 끝까지 닿아야 해서 SafeArea 를 쓰지 않는다.
 * 가로 잠금과 상태바 숨김은 묶음 레이아웃(_layout.tsx)이 맡는다.
 */
export default function InfernoEp0Screen() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const completeEpisode = useInfernoStore((state) => state.completeEpisode);

  const episode = findInfernoEpisode(EPISODE_ORDER);

  // 상수 목록에서 찾는 것이라 실제로는 비어 있을 수 없다. 타입을 좁히기 위한 처리.
  if (!episode) {
    return null;
  }

  const Scene = EP0_SCENES[sceneIndex];
  const hasPrevious = sceneIndex > 0;
  const isLastScene = sceneIndex === EP0_SCENES.length - 1;

  function handlePreviousPress() {
    setSceneIndex((index) => index - 1);
  }

  // 끝까지 보든 건너뛰든 이 회차는 본 것으로 친다. ep0 은 안내라서 굳이 붙잡아 둘 이유가 없다.
  function finishEpisode() {
    completeEpisode(EPISODE_ORDER);
    router.dismissTo('/');
  }

  function handleNextPress() {
    if (isLastScene) {
      finishEpisode();
      return;
    }

    setSceneIndex((index) => index + 1);
  }

  function handleSkipPress() {
    finishEpisode();
  }

  return (
    <InfernoEpisodeFrame
      episode={episode}
      onPreviousPress={hasPrevious ? handlePreviousPress : undefined}
      onNextPress={handleNextPress}
      onSkipPress={handleSkipPress}
    >
      <Scene />
    </InfernoEpisodeFrame>
  );
}
