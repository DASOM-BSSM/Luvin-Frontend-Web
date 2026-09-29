import Svg, { Path, Rect } from 'react-native-svg';

import theme from '@/src/constants/theme';

interface ProfileIconProps {
  /** 사람 모양 글리프 색 (pink 400) */
  color?: string;
  /** 원형 배경 색 (pink 100) */
  backgroundColor?: string;
  size?: number;
}

export default function ProfileIcon({
  color = theme.pink[400],
  backgroundColor = theme.pink[100],
  size = 32,
}: ProfileIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Rect width={32} height={32} rx={16} fill={backgroundColor} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9365 10.9206C11.9365 9.84293 12.3646 8.80936 13.1267 8.04731C13.8887 7.28526 14.9223 6.85714 16 6.85714C17.0777 6.85714 18.1113 7.28526 18.8733 8.04731C19.6354 8.80936 20.0635 9.84293 20.0635 10.9206C20.0635 11.9983 19.6354 13.0319 18.8733 13.794C18.1113 14.556 17.0777 14.9841 16 14.9841C14.9223 14.9841 13.8887 14.556 13.1267 13.794C12.3646 13.0319 11.9365 11.9983 11.9365 10.9206ZM11.9365 17.0159C10.5894 17.0159 9.29742 17.551 8.34485 18.5036C7.39229 19.4562 6.85714 20.7481 6.85714 22.0952C6.85714 22.9035 7.17823 23.6787 7.74977 24.2502C8.32131 24.8218 9.09648 25.1429 9.90476 25.1429H22.0952C22.9035 25.1429 23.6787 24.8218 24.2502 24.2502C24.8218 23.6787 25.1429 22.9035 25.1429 22.0952C25.1429 20.7481 24.6077 19.4562 23.6551 18.5036C22.7026 17.551 21.4106 17.0159 20.0635 17.0159H11.9365Z"
        fill={color}
      />
    </Svg>
  );
}
