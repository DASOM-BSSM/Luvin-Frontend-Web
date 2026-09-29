import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';

const InteropImage = cssInterop(Image, { className: 'style' });

/** 빵 종류. 에셋 파일명과 1:1 로 대응한다. */
export type BreadType =
  | 'salt'
  | 'castella'
  | 'madeleine'
  | 'redbean'
  | 'baguette'
  | 'cream'
  | 'donut'
  | 'pretzel';

/**
 * 반죽 그림 두 종류 + 완성(구운 후) 상태.
 *
 * - `dough`       : 팔다리 없이 몸통만 있는 반죽. 오븐·설문·미니게임 소개처럼 반죽이
 *   장식으로만 등장하는 화면에서 쓴다.
 * - `personDough` : 팔다리가 붙어 사람처럼 서 있는 반죽. Figma `Dough` 컴포넌트의
 *   `isperson=true` 변형(예: `ep2-대화` 5379:3570 의 `Dough`)에 대응한다. 러빈지옥은
 *   반죽이 대화하고 투표하는 화면이라 처음부터 이 변형만 썼어야 했는데, 팔다리를 SVG로
 *   따로 그리는 대신 팔다리가 이미 합성된 이미지가 나와서 이걸로 교체한다(ep1 부터).
 * - `baked`       : 다 구워진 완성 빵.
 */
export type BreadState = 'dough' | 'personDough' | 'baked';

/**
 * `personDough` 에는 `salt` 전용 파일이 없다 — 소금빵의 사람 버전 에셋 이름이
 * `person_dough_croissant.png` 다(생김새가 크루아상이라 그렇게 이름 붙었을 뿐, 가리키는
 * 반죽은 salt 하나뿐이다). 나머지 일곱 종류는 이름이 그대로 대응한다.
 */
const BREAD_SOURCES: Record<BreadState, Record<BreadType, number>> = {
  dough: {
    salt: require('@/src/assets/images/dough_salt.png'),
    castella: require('@/src/assets/images/dough_castella.png'),
    madeleine: require('@/src/assets/images/dough_madeleine.png'),
    redbean: require('@/src/assets/images/dough_redbean.png'),
    baguette: require('@/src/assets/images/dough_baguette.png'),
    cream: require('@/src/assets/images/dough_cream.png'),
    donut: require('@/src/assets/images/dough_donut.png'),
    pretzel: require('@/src/assets/images/dough_pretzel.png'),
  },
  personDough: {
    salt: require('@/src/assets/images/person_dough_croissant.png'),
    castella: require('@/src/assets/images/person_dough_castella.png'),
    madeleine: require('@/src/assets/images/person_dough_madeleine.png'),
    redbean: require('@/src/assets/images/person_dough_redbean.png'),
    baguette: require('@/src/assets/images/person_dough_baguette.png'),
    cream: require('@/src/assets/images/person_dough_cream.png'),
    donut: require('@/src/assets/images/person_dough_donut.png'),
    pretzel: require('@/src/assets/images/person_dough_pretzel.png'),
  },
  baked: {
    salt: require('@/src/assets/images/baked_salt.png'),
    castella: require('@/src/assets/images/baked_castella.png'),
    madeleine: require('@/src/assets/images/baked_madeleine.png'),
    redbean: require('@/src/assets/images/baked_redbeen.png'),
    baguette: require('@/src/assets/images/baked_baguette.png'),
    cream: require('@/src/assets/images/baked_cream.png'),
    donut: require('@/src/assets/images/baked_donut.png'),
    pretzel: require('@/src/assets/images/baked_pretzel.png'),
  },
};

interface BreadCharacterProps {
  type: BreadType;
  state: BreadState;
  className?: string;
  accessibilityLabel?: string;
}

/** 빵 캐릭터 이미지. */
export default function BreadCharacter({
  type,
  state,
  className = 'h-[45px] w-[76px]',
  accessibilityLabel,
}: BreadCharacterProps) {
  return (
    <InteropImage
      className={className}
      source={BREAD_SOURCES[state][type]}
      contentFit="contain"
      accessibilityLabel={accessibilityLabel}
    />
  );
}
