import Svg, { Path } from 'react-native-svg';

import theme from '@/src/constants/theme';

interface CloudSmallIconProps {
  color?: string;
  width?: number;
  height?: number;
}

/**
 * Figma: 공룡빵게임 배경의 구름 (미니게임1 `5913:5154`의 자식 `6219:4021`, 원본 너비 56 x 높이 36).
 * 세 구름 중 가장 작다.
 */
export default function CloudSmallIcon({ color = theme.default.white, width = 56, height = 36 }: CloudSmallIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 56 36" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M42.1334 5.27427C39.6961 3.08042 36.67 1.49057 33.3486 0.658927C30.0272 -0.172713 26.5233 -0.217907 23.1768 0.527727C19.8303 1.27336 16.7547 2.78452 14.2485 4.9146C11.7422 7.04469 9.89037 9.72141 8.87251 12.6851C5.91083 13.6325 3.41602 15.4903 1.82797 17.931C0.239922 20.3717 -0.339382 23.2385 0.192205 26.0259C0.723793 28.8134 2.33213 31.3424 4.73364 33.1672C7.13514 34.9919 10.1756 35.9951 13.3189 36H45.3262C47.9262 36.001 50.4371 35.1478 52.3872 33.6006C54.3373 32.0534 55.5924 29.9188 55.9167 27.5977C56.2409 25.2766 55.612 22.9289 54.1482 20.9956C52.6843 19.0623 50.4862 17.6765 47.9668 17.0985C47.7258 12.6412 45.6458 8.42505 42.1334 5.27427Z"
        fill={color}
      />
    </Svg>
  );
}
