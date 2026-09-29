import Svg, { Path } from 'react-native-svg';

interface HeartIconProps {
  color: string;
  size?: number;
}

/**
 * 미니게임 HUD 하트. Figma의 하트 자산(Frame 107, 6219:4039)이 3개 하트를 하나로 합쳐
 * 굽거나 화면 다른 곳에서 재사용 못 하는 플랫 이미지라, 표준 하트 실루엣을 직접 SVG로
 * 그린다 — "♥" 유니코드 글리프는 안드로이드에서 시스템 컬러 이모지로 강제 대체되어 `color`
 * 스타일이 먹지 않는 걸 실기기에서 확인했다(§8, 색 재검증 반영).
 */
export default function HeartIcon({ color, size = 20 }: HeartIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={color}
      />
    </Svg>
  );
}
