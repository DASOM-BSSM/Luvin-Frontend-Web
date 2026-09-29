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
import BreadCrossingScene from '@/src/features/luvin-hell/games/bread-crossing/components/BreadCrossingScene';
import { MISSION_RANGE } from '@/src/features/luvin-hell/games/bread-crossing/engine/constants';
import { useBreadCrossingRunStore } from '@/src/features/luvin-hell/games/bread-crossing/store';
import useReportMinigameResult from '@/src/features/minigames/hooks/use-report-minigame-result';

/**
 * 빵건너친구들 화면. Ready/Playing(5726:2608)/Result를 하나의 화면에서 phase에 따라
 * 오버레이만 바꿔 보여준다(공룡빵게임과 동일 구조 — dino-runner/play.tsx 참고).
 */
export default function BreadCrossingPlayScreen() {
  const run = useMissionRun(useBreadCrossingRunStore);
  useReportMinigameResult('빵건너친구들', run.phase);

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
            <BreadCrossingScene
              phase={run.phase}
              hearts={run.hearts}
              onFail={run.registerHit}
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
          onPress={() => router.push('/luvin-hell/bread-crossing/about')}
        />
      </View>
    </View>
  );
}
