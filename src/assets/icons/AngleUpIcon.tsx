import Svg, { Path } from 'react-native-svg';

import theme from '@/src/constants/theme';

interface AngleUpIconProps {
  color?: string;
  size?: number;
}

/**
 * Figma: `uit:angle-up` (6248:5473).
 *
 * 위를 향한 꺾쇠다. 설문 화면의 "나가기" 처럼 뒤로가기로 쓸 때는 Figma 와 똑같이
 * 호출부에서 -90도 돌려서 왼쪽을 보게 한다.
 */
export default function AngleUpIcon({ color = theme.default.black, size = 24 }: AngleUpIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.854 13.647L12.354 9.147C12.2602 9.05326 12.1331 9.00061 12.0005 9.00061C11.8679 9.00061 11.7408 9.05326 11.647 9.147L7.147 13.647C7.05592 13.7413 7.00552 13.8676 7.00666 13.9987C7.0078 14.1298 7.06039 14.2552 7.15309 14.3479C7.24579 14.4406 7.3712 14.4932 7.5023 14.4943C7.6334 14.4955 7.7597 14.4451 7.854 14.354L12 10.207L16.146 14.354C16.2398 14.4477 16.3669 14.5004 16.4995 14.5004C16.6321 14.5004 16.7592 14.4477 16.853 14.354C16.9467 14.2602 16.9994 14.1331 16.9994 14.0005C16.9994 13.8679 16.9477 13.7408 16.854 13.647Z"
        fill={color}
      />
    </Svg>
  );
}
