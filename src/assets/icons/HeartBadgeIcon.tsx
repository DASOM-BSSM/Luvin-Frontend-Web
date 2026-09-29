import Svg, { Path, Rect } from 'react-native-svg';

import theme from '@/src/constants/theme';

interface HeartBadgeIconProps {
  /** 알약 배경 색. */
  backgroundColor?: string;
  /** 알약 테두리 색. */
  borderColor?: string;
  /** 하트 글리프 색. */
  heartColor?: string;
  width?: number;
  height?: number;
}

/**
 * Figma `heart` (I5467:5765;5370:2580, I5467:5693;5370:2580) — 대화 말풍선에 붙는
 * 하트 알약 배지.
 *
 * `ep2-대화 끝`(5467:5765), `ep4-끝`(5467:5675)에서 대화의 결정적인 한 줄에만 붙는 장식.
 * 하트 글리프 색은 Figma `Color system` 컬렉션에 없는 값이라 `theme.heart.filled` 로
 * 옮겨 뒀다. 미니게임 HUD 하트와 같은 값이라 토큰을 나눠 쓴다(colors.ts 주석 참고).
 */
export default function HeartBadgeIcon({
  backgroundColor = theme.pink[200],
  borderColor = theme.default.white,
  heartColor = theme.heart.filled,
  width = 36,
  height = 24,
}: HeartBadgeIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 36 24" fill="none">
      <Rect x={1} y={1} width={34} height={22} rx={11} fill={backgroundColor} />
      <Rect x={1} y={1} width={34} height={22} rx={11} stroke={borderColor} strokeWidth={2} />
      <Path
        d="M20.6897 8C18.7034 8 17.5862 9.524 17.5862 10.2857C17.5862 9.524 16.469 8 14.4828 8C12.4966 8 12 9.524 12 10.2857C12 14.2857 17.5862 17.1429 17.5862 17.1429C17.5862 17.1429 23.1724 14.2857 23.1724 10.2857C23.1724 9.524 22.6759 8 20.6897 8Z"
        fill={heartColor}
        stroke={heartColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
