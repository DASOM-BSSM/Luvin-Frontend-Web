/**
 * 색상 토큰.
 *
 * 출처: Figma "Luvin-Design" 로컬 변수 컬렉션 `Color system`.
 * tailwind.config.js 가 이 파일을 require 해서 쓴다. 값은 여기서만 고칠 것.
 */

/** Figma: `brown color/*` */
export const brown = {
  100: '#F8F0EA',
  200: '#F4E8DF',
  300: '#E8CFBD',
  400: '#B6642A',
  500: '#A45A26',
  600: '#925022',
  700: '#894B20',
  800: '#6D3C19',
  900: '#522D13',
  1000: '#40230F',
};

/** Figma: `yellow color/*` */
export const yellow = {
  100: '#FFFDF5',
  200: '#FFFCF0',
  300: '#FFF9E1',
  400: '#FFED9E',
  500: '#E6D58E',
  600: '#CCBE7E',
  700: '#BFB277',
  800: '#998E5F',
  900: '#736B47',
  1000: '#595337',
};

/** Figma: `pink color/*` */
export const pink = {
  100: '#FFF6F8',
  200: '#FFF2F5',
  300: '#FFE4EA',
  400: '#FFBCCA',
  500: '#FFA8BA',
  600: '#E697A7',
  700: '#BF7E8C',
  800: '#996570',
  900: '#734C54',
  1000: '#593B41',
};

/** Figma: `state color/*` */
export const state = {
  error: '#FF0030',
  warning: '#FFBA00',
  success: '#00D55B',
};

/** Figma: `text color/*` */
export const text = {
  primary: '#1D1D1D',
  secondary: '#334655',
  muted: '#647F8B',
};

/** Figma: `default color/*` (black 은 순수 #000 이 아니라 #1D1D1D) */
export const defaultColor = {
  white: '#FFFFFF',
  black: '#1D1D1D',
  bg: '#FFFEFA',
  gray: '#D9D9D9',
};

/**
 * 하트 색. `Color system` 컬렉션에는 없는 값이라 Figma "미니게임2 Playing"
 * (5726:2608)의 하트 자산(Frame 107, 6219:4039)을 픽셀 샘플링해서 얻었다 — 채워진 하트는
 * `state.error`(#FF0030)와도 `pink.*`와도 다른 별도 톤(#FF5454)이고, 빈 하트는 `default.gray`
 * 와 정확히 같은 값이라 재사용한다.
 *
 * 러빈지옥 1:1 대화의 하트 배지(`ep2-대화 끝` 5467:5765)도 `filled` 를 같이 쓴다. 그쪽은 SVG
 * 에셋에 값이 그대로 박혀 있었는데(변수 바인딩 없음) 같은 #FF5454 라 토큰을 나눠 쓴다.
 */
export const heart = {
  filled: '#FF5454',
  empty: defaultColor.gray,
};

export const colors = {
  /** Figma 5726:3281은 text/primary가 아닌 순수 검정을 사용한다. */
  inferno: { instruction: '#000000' },
  brown,
  yellow,
  pink,
  heart,
  state,
  text,
  default: defaultColor,
};

export type Colors = typeof colors;
export type ColorShade = keyof typeof brown;
