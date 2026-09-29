import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { View } from 'react-native';

const InteropImage = cssInterop(Image, { className: 'style' });

/**
 * 러빈지옥 화면 배경의 분홍 물방울 무늬. Figma `ep0` 의 image 33~36 (6340:8356~8359).
 *
 * 원본은 1152x2048 세로 그림인데 가로 화면을 덮어야 해서 시안도 같은 그림을 가로로 이어 붙인다.
 * 폭 253 은 시안이 쓰는 배율(253/1152)을 그대로 따른 값이다. 이 배율을 바꾸면 점 크기가 달라진다.
 *
 * 모달 쪽지 테두리(5466:4551)는 같은 그림을 396 폭으로 늘려 써서 점이 1.5배쯤 크다.
 * 그래서 배율을 variant 로 나눠 둔다. 폭이 Tailwind 정적 클래스라 값마다 클래스를 따로 둔다
 * (NativeWind 는 변수로 만든 임의값 클래스를 읽지 못한다).
 *
 * NOTE: absolute 를 쓴다(§16 예외). 배경은 내용 뒤에 깔려야 하는데 flex 로는 겹칠 수 없다.
 * 예외를 이 컴포넌트 안에 가둬 둔다.
 */

/** 타일 한 장의 폭. 시안 배율(253/1152)에서 나온 값. */
const TILE_WIDTH = 253;

/** 쓰이는 곳. screen 은 화면 배경(6340:8356), modal 은 모달 쪽지 테두리(5466:4551). */
type InfernoDotVariant = 'screen' | 'modal';

/** 타일 폭 클래스. 위 TILE_WIDTH 와 모달 배율 396 을 그대로 쓴다. */
const TILE_CLASS: Record<InfernoDotVariant, string> = {
  screen: 'h-full w-[253px]',
  modal: 'h-full w-[396px]',
};

/** 화면은 가장 넓은 가로 화면(약 1000dp)까지, 모달은 쪽지 폭이 작아 두 장이면 충분하다. */
const TILE_COUNT: Record<InfernoDotVariant, number> = {
  screen: 5,
  modal: 2,
};

interface InfernoDotBackgroundProps {
  variant?: InfernoDotVariant;
}

export default function InfernoDotBackground({
  variant = 'screen',
}: InfernoDotBackgroundProps) {
  return (
    <View className="absolute inset-0 flex-row overflow-hidden">
      {Array.from({ length: TILE_COUNT[variant] }, (_, index) => (
        <InteropImage
          key={index}
          className={TILE_CLASS[variant]}
          source={require('@/src/assets/images/inferno-dot-pattern.png')}
          contentFit="cover"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      ))}
    </View>
  );
}

export { TILE_WIDTH };
