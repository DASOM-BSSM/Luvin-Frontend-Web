import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';

import AngleUpIcon from '@/src/assets/icons/AngleUpIcon';
import Button from '@/src/components/ui/button';
import Text from '@/src/components/ui/text';
import { MissionBanner } from '@/src/features/luvin-hell/components/GameHud';
import GameFrame from '@/src/features/luvin-hell/components/GameFrame';
import ReadyOverlay from '@/src/features/luvin-hell/components/ReadyOverlay';
import ResultOverlay from '@/src/features/luvin-hell/components/ResultOverlay';
import { useMissionRun } from '@/src/features/luvin-hell/engine/hooks/useMissionRun';
import DinoRunnerScene from '@/src/features/luvin-hell/games/dino-runner/components/DinoRunnerScene';
import { MISSION_RANGE } from '@/src/features/luvin-hell/games/dino-runner/engine/constants';
import { useDinoRunStore } from '@/src/features/luvin-hell/games/dino-runner/store';
import useReportMinigameResult from '@/src/features/minigames/hooks/use-report-minigame-result';

/**
 * 공룡빵게임 화면. Ready(6285:7061)/Playing(5913:5154)/Result(6263:6311, 6307:8123)를
 * 하나의 화면에서 phase에 따라 오버레이만 바꿔 보여준다 — 세 Figma 목업이 실제로는
 * 같은 GameFrame 크롬 위에 얹힌 오버레이 차이일 뿐이라 별도 라우트로 쪼개지 않았다.
 */
export default function DinoRunnerPlayScreen() {
  const run = useMissionRun(useDinoRunStore);
  useReportMinigameResult('공룡빵게임', run.phase);

  useEffect(() => {
    run.begin(MISSION_RANGE);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 화면 진입 시 1회만 미션을 뽑는다
  }, []);

  return (
    <View className="flex-1 bg-default-bg">
      <View className="h-[70px]" />

      <View className="flex-col items-center gap-[40px] px-[31px]">
        <View className="w-full flex-col items-center gap-[16px]">
          <View className="w-full flex-col gap-[8px]">
            <Pressable
              accessibilityRole="button"
              className="w-full flex-row items-center"
              onPress={() => router.back()}
            >
              <View className="-rotate-90">
                <AngleUpIcon />
              </View>
              <Text variant="body-s" className="text-default-black">
                게임 나가기
              </Text>
            </Pressable>
            <MissionBanner missionTarget={run.missionTarget} reward={run.reward} />
          </View>

          <GameFrame>
            <DinoRunnerScene
              phase={run.phase}
              score={run.score}
              hearts={run.hearts}
              onHit={run.registerHit}
              onScoreChange={run.setScore}
            />
            {run.phase === 'ready' && <ReadyOverlay onPress={run.startPlaying} />}
            {(run.phase === 'success' || run.phase === 'fail') && (
              <ResultOverlay success={run.phase === 'success'} onPress={run.restart} />
            )}
          </GameFrame>
        </View>

        <Button
          label="게임 설명"
          variant="gameInfo"
          className="w-full"
          onPress={() => router.push('/luvin-hell/dino-runner/about')}
        />
      </View>
    </View>
  );
}
