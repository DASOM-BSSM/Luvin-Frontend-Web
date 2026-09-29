import { Pressable, type PressableProps } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import Text, { type TextVariant } from '@/src/components/ui/text';
import { defaultColor, yellow } from '@/src/constants/colors';

/**
 * Figma 에 Button 컴포넌트가 따로 없어서(전부 일반 프레임) 화면별 인스턴스에서 뽑았다.
 * - `outline`         : 밝은 배경 + 검은 테두리 (홈 카드 안의 작은 버튼)
 * - `filled`          : 노란 배경 + 노란 테두리 (홈 카드 안의 작은 버튼)
 * - `primary`         : 온보딩 로그인 버튼 (6031:2839) — yellow/400, 높이 38, 가로 꽉
 * - `secondary`       : 설문 시작하기 버튼 (6248:5304) — yellow/300, 높이 42, 가로 꽉
 * - `modeSelectPrimary`/`modeSelectSecondary` : 러빈지옥 "Choose Your Mode" 화면(5916:5300)의
 *   두 게임 버튼 — `outline`/`filled`와 다르게 py-8, 라벨 16px, 테두리 gray. 공용 `outline`/
 *   `filled`를 재사용하면 다른 화면(홈 카드 등)까지 같이 바뀌므로 전용 variant로 분리했다.
 *   기본은 흰색이고 누르는 동안만 yellow/300으로 바뀐다 — 아래 `PRESS_HIGHLIGHT_VARIANTS` 참고.
 * - `gameInfo`        : 미니게임 Ready/Result 화면의 "게임 설명" 버튼(6285:7061 등) — bg white,
 *   테두리 gray, py-6, 라벨 14px. `outline`과 border/폰트 크기가 달라 분리했다.
 * - `notice`          : 안내 모달 버튼 (6602:3957) — yellow/300 바탕에 yellow/400 테두리, 가로 꽉
 * - `noticeSoft`      : `notice` 의 한 단계 연한 짝 (5482:1895) — yellow/200 바탕에 yellow/300
 *   테두리. Figma `button2` 의 `status=activate, hover=off` 에 해당하고, `notice` 가 그
 *   `hover=on` 이다. "나의 빵에게" 피드백 화면처럼 두 버튼이 한 화면에 같이 놓일 때 쓴다.
 * - `infoSave`        : 마이페이지 "내 정보 저장하기" 버튼 (6300:8070) — yellow/300, 테두리 없음,
 *   px10/py8, 라벨 14px, 가로 꽉. `secondary`(16px, 높이 42, px20)와 달라 분리했다.
 *
 * 이름은 Figma 가 아니라 이쪽에서 붙인 것이라, 디자인에 정식 Button 이 생기면 맞출 것.
 *
 * 비활성은 variant 가 아니라 `disabled` prop 이다 — Figma `button2` 도 색을 따로 둔 게 아니라
 * `status=deactivate`(5760:4346, default/gray) 라는 상태로 정의해 뒀다.
 */
export type ButtonVariant =
  | 'outline'
  | 'filled'
  | 'primary'
  | 'secondary'
  | 'modeSelectPrimary'
  | 'modeSelectSecondary'
  | 'gameInfo'
  | 'notice'
  | 'noticeSoft'
  | 'infoSave';

const VARIANT_CONTAINER: Record<ButtonVariant, string> = {
  outline: 'border border-default-black bg-default-bg px-[20px] py-[6px]',
  filled: 'border border-yellow-300 bg-yellow-200 px-[20px] py-[6px]',
  primary: 'h-[38px] w-full bg-yellow-400 px-[10px]',
  secondary: 'h-[42px] w-full bg-yellow-300 px-[20px]',
  modeSelectPrimary: 'border border-default-gray',
  modeSelectSecondary: 'border border-default-gray',
  gameInfo: 'border border-default-gray bg-default-bg px-[20px] py-[6px]',
  notice: 'w-full border border-yellow-400 bg-yellow-300 px-[16px] py-[6px]',
  noticeSoft: 'w-full border border-yellow-300 bg-yellow-200 px-[16px] py-[6px]',
  infoSave: 'w-full bg-yellow-300 px-[10px] py-[8px]',
};

/** 비활성일 때 덮어쓰는 바탕. Figma `status=deactivate` (5760:4346) 는 테두리 없이 회색이다. */
const DISABLED_CONTAINER = 'w-full border border-default-gray bg-default-gray px-[16px] py-[6px]';

/** 대부분 #1D1D1D 지만 Figma 가 서로 다른 토큰을 물려 놨다. */
const VARIANT_LABEL: Record<ButtonVariant, string> = {
  outline: 'text-default-black',
  filled: 'text-text-primary',
  primary: 'text-text-primary',
  secondary: 'text-default-black',
  modeSelectPrimary: 'text-default-black',
  modeSelectSecondary: 'text-default-black',
  gameInfo: 'text-text-primary',
  notice: 'text-text-primary',
  noticeSoft: 'text-text-primary',
  infoSave: 'text-text-primary',
};

const VARIANT_TEXT: Record<ButtonVariant, TextVariant> = {
  outline: 'body-xs',
  filled: 'body-xs',
  primary: 'body-m',
  secondary: 'body-m',
  modeSelectPrimary: 'body-m',
  modeSelectSecondary: 'body-m',
  gameInfo: 'body-s',
  notice: 'body-m',
  noticeSoft: 'body-m',
  infoSave: 'body-s',
};

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  /**
   * variant 가 정하는 기본 글자 크기를 덮어쓴다. variant 가 다른 두 버튼을 나란히 놓고
   * 글자 크기만 맞춰야 할 때 쓴다(예: outline=body-xs 옆에 secondary=body-m을 두면
   * 크기가 달라 보인다).
   */
  textVariant?: TextVariant;
}

const PRESS_ANIMATION_DURATION_MS = 150;

/**
 * Figma "Choose Your Mode"(5916:5300)는 두 버튼(공룡빵게임=yellow/300 고정, 빵건너친구들=흰색
 * 고정)을 정적으로 다르게 그려놨고 press 상태를 따로 정의하지 않았다 — 재확인 완료. 그런데 이
 * 정적 노랑이 "안 눌렀는데 눌린 것처럼 보인다"는 버그로 인식되어, 사용자 결정으로 두 버튼 다
 * 기본은 흰색(default-bg)으로 통일하고 눌리는 동안만 yellow/300 으로 애니메이션하도록 바꿨다
 * (Figma 정적 값과는 다른, 확인된 의도적 이탈).
 */
const PRESS_HIGHLIGHT_VARIANTS: readonly ButtonVariant[] = ['modeSelectPrimary', 'modeSelectSecondary'];

function hasPressHighlight(variant: ButtonVariant): boolean {
  return PRESS_HIGHLIGHT_VARIANTS.includes(variant);
}

interface PressHighlightButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant: ButtonVariant;
  textVariant?: TextVariant;
  className?: string;
}

/** 기본 흰색 → 누르는 동안 yellow/300 으로 배경을 애니메이션하는 버튼(EpisodeHistoryRow와 동일 패턴). */
function PressHighlightButton({ label, variant, textVariant, className, ...rest }: PressHighlightButtonProps) {
  const pressProgress = useSharedValue(0);

  function handlePressIn() {
    pressProgress.value = withTiming(1, { duration: PRESS_ANIMATION_DURATION_MS });
  }

  function handlePressOut() {
    pressProgress.value = withTiming(0, { duration: PRESS_ANIMATION_DURATION_MS });
  }

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(pressProgress.value, [0, 1], [defaultColor.bg, yellow[300]]),
  }));

  return (
    <Animated.View
      className={`rounded-[8px] ${VARIANT_CONTAINER[variant]} ${className ?? ''}`}
      style={animatedStyle}
    >
      <Pressable
        accessibilityRole="button"
        className="flex-row items-center justify-center px-[20px] py-[8px]"
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...rest}
      >
        <Text variant={textVariant ?? VARIANT_TEXT[variant]} className={VARIANT_LABEL[variant]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function Button({
  label,
  variant = 'outline',
  textVariant,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  if (hasPressHighlight(variant)) {
    return (
      <PressHighlightButton
        label={label}
        variant={variant}
        textVariant={textVariant}
        className={className}
        {...rest}
      />
    );
  }

  const containerClass = disabled ? DISABLED_CONTAINER : VARIANT_CONTAINER[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      className={`flex-row items-center justify-center rounded-[8px] ${containerClass} ${className ?? ''}`}
      {...rest}
    >
      <Text variant={textVariant ?? VARIANT_TEXT[variant]} className={VARIANT_LABEL[variant]}>
        {label}
      </Text>
    </Pressable>
  );
}
