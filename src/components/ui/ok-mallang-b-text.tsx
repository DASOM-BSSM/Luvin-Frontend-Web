import { Text as RNText, View, type TextStyle, type ViewProps } from 'react-native';

import { fontFamily } from '@/src/constants/typography';

/**
 * 8방향으로 살짝 어긋난 테두리색 텍스트를 본문색 텍스트 아래 겹쳐 쌓아 외곽선처럼 보이게
 * 한다. RN Text에는 stroke 속성이 없고, 이 폰트가 여러 줄(`Choose\nYour Mode`)로도 쓰이는데
 * react-native-svg의 Text는 줄바꿈을 직접 계산해줘야 해서 다루기 번거롭다 — 8겹 복제 방식은
 * RN의 기본 줄바꿈/정렬을 그대로 재사용할 수 있어 이 프로젝트엔 이 방식이 더 맞는다.
 */
const STROKE_DIRECTIONS: ReadonlyArray<[number, number]> = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

interface OkMallangBTextProps extends ViewProps {
  children: string;
  fontSize: number;
  lineHeight: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  textAlign?: TextStyle['textAlign'];
}

/** Figma에서 테두리(stroke)가 있는 Ok Mallang B 텍스트 전용 — §8 Typography 예외. */
export default function OkMallangBText({
  children,
  fontSize,
  lineHeight,
  fill,
  stroke,
  strokeWidth,
  textAlign,
  className,
  ...rest
}: OkMallangBTextProps) {
  const baseStyle: TextStyle = {
    fontFamily: fontFamily.okMallangB,
    fontSize,
    lineHeight,
    textAlign,
  };

  return (
    <View className={className} {...rest}>
      {STROKE_DIRECTIONS.map(([dx, dy]) => (
        <RNText
          key={`${dx}-${dy}`}
          style={[
            baseStyle,
            { position: 'absolute', left: dx * strokeWidth, top: dy * strokeWidth, color: stroke },
          ]}
        >
          {children}
        </RNText>
      ))}
      <RNText style={[baseStyle, { color: fill }]}>{children}</RNText>
    </View>
  );
}
