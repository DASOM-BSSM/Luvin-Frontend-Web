import Svg, { Path } from 'react-native-svg';

import theme from '@/src/constants/theme';

interface CloudLargeIconProps {
  color?: string;
  width?: number;
  height?: number;
}

/**
 * Figma: 공룡빵게임 배경의 구름 (미니게임1 `5913:5154`의 자식 `5913:5174`, 원본 너비 71.4201 x 높이 45.9827).
 * 세 구름 중 가장 크다.
 */
export default function CloudLargeIcon({
  color = theme.default.white,
  width = 71.4201,
  height = 45.9827,
}: CloudLargeIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 71.4201 45.9827" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M53.7353 6.73681C50.6268 3.93461 46.7674 1.90389 42.5314 0.841644C38.2955 -0.220605 33.8267 -0.278332 29.5587 0.674064C25.2907 1.62646 21.3683 3.55665 18.1719 6.2774C14.9756 8.99816 12.6138 12.4171 11.3156 16.2026C7.53844 17.4127 4.35666 19.7857 2.33132 22.9032C0.305987 26.0207 -0.432834 29.6824 0.245131 33.2428C0.923096 36.8032 2.97431 40.0335 6.03709 42.3643C9.09987 44.695 12.9775 45.9765 16.9863 45.9827H57.8072C61.1231 45.984 64.3254 44.8941 66.8125 42.9179C69.2996 40.9417 70.9003 38.2151 71.3138 35.2504C71.7274 32.2857 70.9253 29.287 69.0584 26.8176C67.1914 24.3482 64.388 22.5781 61.1749 21.8399C60.8675 16.1466 58.2148 10.7613 53.7353 6.73681Z"
        fill={color}
      />
    </Svg>
  );
}
