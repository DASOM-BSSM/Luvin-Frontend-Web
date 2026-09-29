import Svg, { Path } from 'react-native-svg';

import theme from '@/src/constants/theme';

interface CommentNavIconProps {
  color?: string;
  size?: number;
}

export default function CommentNavIcon({ color = theme.brown[300], size = 24 }: CommentNavIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3.0009C7.0293 3.0009 3 7.03015 3 12.0008C2.99924 13.3268 3.29151 14.6366 3.8559 15.8365L3.0189 19.9198C2.9891 20.0656 2.99592 20.2165 3.03874 20.359C3.08156 20.5015 3.15905 20.6312 3.26427 20.7364C3.3695 20.8416 3.49917 20.9191 3.64168 20.9619C3.7842 21.0048 3.93511 21.0116 4.0809 20.9818L8.1642 20.1448C9.3288 20.6938 10.6302 20.9998 12 20.9998C16.9707 20.9998 21 16.9714 21 11.9999C21 7.03015 16.9707 3 12 3"
        fill={color}
      />
    </Svg>
  );
}
