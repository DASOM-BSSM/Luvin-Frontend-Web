/**
 * 디자인 토큰 통합 진입점.
 *
 * 값의 실제 정의는 colors.ts / typography.ts 에 있고, 여기서는 그것들을 하나로 묶어
 * default export 만 한다. 값을 고칠 일이 있으면 이 파일이 아니라 원본 파일을 고칠 것.
 *
 * 사용 예:
 *   import theme from '@/src/constants/theme';
 *   theme.colors.pink[500]
 *   theme.typography.heading.h1
 */

import { brown, colors, defaultColor, heart, pink, state, text, yellow } from './colors';
import { body, display, fontFamily, heading, lineHeightRatio, typography } from './typography';

const theme = {
  colors,
  typography,

  // 자주 쓰는 것들은 한 단계 줄여서 바로 꺼낼 수 있게 둔다.
  brown,
  yellow,
  pink,
  heart,
  state,
  text,
  default: defaultColor,
  fontFamily,
  heading,
  body,
  display,
  lineHeightRatio,
} as const;

export default theme;

export type Theme = typeof theme;
