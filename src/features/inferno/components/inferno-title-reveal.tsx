import { useEffect, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import InfernoTitle from '@/src/assets/images/InfernoTitle';
import {
  BOIL_FRAMES,
  BOIL_FRAME_MS,
  BOIL_INTENSITY,
  TITLE_REVEAL_MS,
} from '@/src/features/inferno/constants/animation';

const BOIL_CYCLE_MS = BOIL_FRAME_MS * BOIL_FRAMES.length;

/**
 * 타이틀 등장 + 지글거림.
 *
 * 1) 등장: 가리개 폭을 왼쪽에서 오른쪽으로 늘려 글자가 차례로 드러난다.
 * 2) 지글거림: 등장이 끝나면 아주 미세한 변형을 프레임 단위로 갈아 끼우며 계속 떤다.
 *
 * NOTE: 글자를 하나씩 따로 띄우지 못하는 이유 — 타이틀이 통짜 PNG 한 장인데 글로우가 글자들을
 * 이어 놓아서 글자 사이에 빈 열이 하나도 없다(알파 값을 열 단위로 훑어 확인했고, 글자 몸통만
 * 봐도 끊기는 지점이 없다). 그래서 자르는 대신 가리개의 폭을 일정한 속도로 늘렸다.
 * `Ok Mallang B` 폰트 파일이 생기면 진짜 글자 단위 연출로 바꿀 수 있다.
 *
 * 등장에 선형 이징을 쓰는 건 타자를 치듯 일정한 속도로 나와야 글자가 하나씩 나오는 것처럼
 * 읽히기 때문이다. ease-out 을 쓰면 뒷글자들이 한꺼번에 튀어나와 보인다.
 *
 * 가리개에 items-start 가 꼭 있어야 한다. 기본값인 stretch 로 두면 가리개가 좁아질 때 안의
 * 그림까지 같이 눌려서, 글자가 드러나는 게 아니라 타이틀이 통째로 작아진다.
 *
 * 지글거림은 가리개 바깥에 건다. 안쪽에 걸면 그림만 움직여서 가리개와 어긋난다.
 */
export default function InfernoTitleReveal() {
  const [width, setWidth] = useState(0);
  const progress = useSharedValue(0);
  const boil = useSharedValue(0);

  function handleLayout(event: LayoutChangeEvent) {
    setWidth(event.nativeEvent.layout.width);
  }

  useEffect(() => {
    if (width === 0) {
      return;
    }

    progress.value = withTiming(1, { duration: TITLE_REVEAL_MS, easing: Easing.linear });

    // 0 -> 프레임 수 를 선형으로 돌리고 아래에서 내림해서 쓴다.
    // 이러면 값 자체는 부드럽게 흐르지만 화면에는 프레임 단위로 뚝뚝 끊겨 보인다.
    boil.value = withDelay(
      TITLE_REVEAL_MS,
      withRepeat(
        withTiming(BOIL_FRAMES.length, { duration: BOIL_CYCLE_MS, easing: Easing.linear }),
        -1,
        false,
      ),
    );

    // 러빈지옥은 가로로 잠기는 화면이라 마운트 직후 방향이 정리되며 onLayout 이 한 번 더
    // 뜰 수 있다(width 가 다시 바뀜). 그때 이 effect 가 다시 돌면서 정리 없이 새 애니메이션을
    // 얹으면, 이전 체인이 끝나기 전에 겹쳐서 boil.value 가 BOIL_FRAMES 범위를 벗어난 값에
    // 잠깐 머무를 수 있다(실기기 Android 에서 "Cannot read property 'x' of undefined" 로
    // 확인됨). 새 애니메이션을 걸기 전에 이전 것부터 반드시 취소한다.
    return () => {
      cancelAnimation(progress);
      cancelAnimation(boil);
    };
  }, [width, progress, boil]);

  const clipStyle = useAnimatedStyle(() => ({ width: progress.value * width }));

  const boilStyle = useAnimatedStyle(() => {
    // 위 cancelAnimation 으로 대부분 막히지만, 혹시 모를 경계값(음수, length 이상)에도
    // 안전하게 프레임 하나를 고르도록 나머지 연산을 한 번 더 감싼다(방어적 이중 안전장치).
    const index =
      ((Math.floor(boil.value) % BOIL_FRAMES.length) + BOIL_FRAMES.length) % BOIL_FRAMES.length;
    const frame = BOIL_FRAMES[index] ?? BOIL_FRAMES[0];

    // 크기는 1 에서 얼마나 벗어났는지에 강도를 곱해야 한다. scale 자체에 곱하면 타이틀이 줄어든다.
    return {
      transform: [
        { translateX: frame.x * BOIL_INTENSITY },
        { translateY: frame.y * BOIL_INTENSITY },
        { rotate: `${frame.rotate * BOIL_INTENSITY}deg` },
        { scale: 1 + (frame.scale - 1) * BOIL_INTENSITY },
      ],
    };
  });

  return (
    <View className="w-full" onLayout={handleLayout}>
      {width > 0 ? (
        <Animated.View style={boilStyle}>
          <Animated.View className="items-start overflow-hidden" style={clipStyle}>
            <InfernoTitle width={width} />
          </Animated.View>
        </Animated.View>
      ) : null}
    </View>
  );
}
