import { View } from 'react-native';

import { sceneColors } from '@/src/features/luvin-hell/constants/scene-colors';

interface GroundPatch {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Figma 미니게임1(`5913:5154`)의 흙바닥 패치 8개. 화면마다(플레이/준비/설명) 동일한 좌표라
 * 랜덤 생성 대신 고정 배열로 둔다 — 흙바닥(dirt base) 자신의 좌상단 기준 좌표.
 */
const GROUND_PATCHES: readonly GroundPatch[] = [
  { left: 3, top: 24, width: 52, height: 12 },
  { left: 43, top: 45, width: 43, height: 12 },
  { left: 254, top: 24, width: 36, height: 12 },
  { left: 86, top: 27, width: 33, height: 12 },
  { left: 124, top: 45, width: 52, height: 12 },
  { left: 170, top: 18, width: 43, height: 12 },
  { left: 206, top: 42, width: 38, height: 12 },
  { left: 281, top: 51, width: 62, height: 12 },
];

/**
 * 전체 땅 스택(밝은 잔디+어두운 잔디+흙바닥)의 높이. Figma 미니게임1 기준 잔디 상단(y=443)에서
 * 프레임 하단(y=555)까지의 실측치 — `밝은 잔디 7 + 어두운 잔디 18` 다음에 오는 흙바닥은 이
 * 값에서 앞의 둘을 뺀 나머지를 채우는 flex-1 이라, 개별 밴드 높이 합(7+18+83=108)과
 * 4px 차이가 나는 게 정상이다(엔진 `GROUND_Y`가 밝은/어두운 잔디 경계와 일치하도록 맞춘 값).
 */
const GROUND_STACK_HEIGHT = 112;

/**
 * 공룡빵게임 배경의 땅: 밝은 잔디 / 어두운 잔디 / 흙바닥(+흙바닥 위 패치 8개), 위에서
 * 아래 순서로 4겹. `DinoRunnerScene`과 `about.tsx` 미리보기가 공유한다.
 * 부모가 `relative` 컨테이너여야 한다(GameFrame / DinoRunnerScene 루트가 이미 그렇다).
 */
export default function DinoGround() {
  return (
    <View className="absolute bottom-0 left-0 right-0" style={{ height: GROUND_STACK_HEIGHT }}>
      <View className="h-[7px] w-full" style={{ backgroundColor: sceneColors.grass }} />
      <View className="h-[18px] w-full" style={{ backgroundColor: sceneColors.grassDark }} />
      <View className="relative flex-1 w-full overflow-hidden" style={{ backgroundColor: sceneColors.ground }}>
        {GROUND_PATCHES.map((patch, index) => (
          <View
            key={index}
            className="absolute"
            style={{
              left: patch.left,
              top: patch.top,
              width: patch.width,
              height: patch.height,
              backgroundColor: sceneColors.groundDark,
            }}
          />
        ))}
      </View>
    </View>
  );
}
