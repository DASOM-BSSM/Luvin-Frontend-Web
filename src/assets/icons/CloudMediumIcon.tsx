import Svg, { Path } from 'react-native-svg';

import theme from '@/src/constants/theme';

interface CloudMediumIconProps {
  color?: string;
  width?: number;
  height?: number;
}

/**
 * Figma: 공룡빵게임 배경의 구름 (미니게임1 `5913:5154`의 자식 `5913:5173`, 원본 너비 63.3728 x 높이 39.5665).
 * 세 구름 중 중간 크기.
 */
export default function CloudMediumIcon({
  color = theme.default.white,
  width = 63.3728,
  height = 39.5665,
}: CloudMediumIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 63.3728 39.5665" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M47.6806 5.79679C44.9224 3.38559 41.4978 1.63823 37.7391 0.724206C33.9805 -0.189823 30.0153 -0.239495 26.2282 0.580009C22.4411 1.39951 18.9606 3.06037 16.1244 5.40149C13.2882 7.7426 11.1925 10.6845 10.0406 13.9418C6.68904 14.9831 3.86577 17.0249 2.06864 19.7074C0.271509 22.3899 -0.384064 25.5407 0.217511 28.6043C0.819085 31.6679 2.63918 34.4475 5.35685 36.453C8.07453 38.4585 11.5153 39.5611 15.0724 39.5665H51.2937C54.236 39.5676 57.0775 38.6298 59.2843 36.9294C61.4912 35.2289 62.9115 32.8828 63.2785 30.3318C63.6454 27.7807 62.9338 25.2004 61.2771 23.0756C59.6205 20.9507 57.133 19.4276 54.2819 18.7924C54.0092 13.8936 51.6554 9.25971 47.6806 5.79679Z"
        fill={color}
      />
    </Svg>
  );
}
