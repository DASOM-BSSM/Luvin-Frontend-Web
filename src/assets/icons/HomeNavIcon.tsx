import Svg, { Path } from 'react-native-svg';

import theme from '@/src/constants/theme';

interface HomeNavIconProps {
  color?: string;
  size?: number;
}

export default function HomeNavIcon({ color = theme.brown[300], size = 24 }: HomeNavIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"
        fill={color}
      />
    </Svg>
  );
}
