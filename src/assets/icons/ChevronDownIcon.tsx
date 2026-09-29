import Svg, { Path } from 'react-native-svg';

import theme from '@/src/constants/theme';

interface ChevronDownIconProps {
  color?: string;
  size?: number;
}

/**
 * Figma `Icon` (I5482:1894;90:646) — 드롭다운 오른쪽의 아래 꺾쇠.
 *
 * 원본 SVG 는 마스크 + 단색 사각형으로 칠해져 있는데(Figma 가 아이콘을 내보내는 방식),
 * 결과가 "path 를 그 색으로 채운 것"과 같아서 path 하나로 옮겼다.
 *
 * 이미 있는 AngleUpIcon 과는 다른 글리프다(획이 더 굵고 각이 넓다). 돌려 쓰지 말 것.
 */
export default function ChevronDownIcon({
  color = theme.text.muted,
  size = 12,
}: ChevronDownIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5301 2.72585C11.2372 2.42482 10.7624 2.42482 10.4695 2.72585L6.00001 7.31967L1.53051 2.72585C1.23763 2.42482 0.762777 2.42482 0.469895 2.72585C0.177013 3.02688 0.177013 3.51494 0.469895 3.81597L6.00001 9.49992L11.5301 3.81597C11.823 3.51494 11.823 3.02688 11.5301 2.72585Z"
        fill={color}
      />
    </Svg>
  );
}
