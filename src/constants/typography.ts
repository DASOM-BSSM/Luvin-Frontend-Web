/**
 * 타이포그래피 토큰.
 *
 * 출처: Figma "Luvin-Design" 의 로컬 텍스트 스타일 (`Heading/H1`~`H5`, `Body/XL`~`XXS`).
 * tailwind.config.js 가 이 파일을 require 해서 쓴다. 값은 여기서만 고칠 것.
 */

import { defaultColor, pink } from './colors';

/**
 * Heading = "Yde street B", Body = "Yde street L" 로 서로 다른 패밀리를 쓴다.
 * RN 은 정적 폰트 파일 간 굵기 합성을 못 하므로 fontWeight 대신 패밀리를 나눈다.
 * 값 = ttf 의 PostScript 이름 = src/app/_layout.tsx 의 useFonts 키.
 *
 * okMallangB 폰트 파일은 "OkMallangB-Regular.ttf" (Calligraphr 제작, 원본 파일명
 * "Ok Mallang B.ttf"에서 공백 제거하여 리네임 — Android에서 Metro가 공백 포함 파일명의 폰트
 * asset을 정상 로드하지 못해 커스텀 폰트가 조용히 시스템 기본 폰트로 폴백되는 문제가 있었음).
 *
 * 등록 키(useFonts)와 이 값은 ttf의 실제 PostScript 이름("OkMallangB-Regular")과 달리
 * "OkMallangBRegular"를 쓴다 — expo-font의 Android 커스텀 폰트 레지스트리는 useFonts에 넘긴
 * 키 문자열 그대로 등록/조회하므로 ttf 내부 이름과 달라도 무방하다.
 *
 * 실기기(Android) 확인된 별도 버그: 이 값을 `font-ok-mallang-b` Tailwind 클래스(NativeWind
 * className 경로)로 적용하면 하이픈 유무와 무관하게 항상 시스템 기본 폰트로 조용히 폴백된다
 * (raw `style={{ fontFamily: fontFamily.okMallangB }}`는 정상 렌더 — RN/폰트 등록 자체는
 * 문제없고, NativeWind v4의 CSS→RN 스타일 변환 파이프라인에서만 이 패밀리가 깨짐. 원인을
 * 하이픈으로 의심해 제거해봤지만 재현됨 — NativeWind 자체의 한계로 결론). 그래서 이 폰트는
 * className(`font-ok-mallang-b`)이 아니라 항상 `style` prop으로 직접 적용한다 — §16 인라인
 * 스타일 금지의 예외(측정된 이유 있음, Reanimated 예외와 동급). 테두리가 있는 텍스트는
 * `OkMallangBText`(아래 `display.*`/§8 참고)로, 테두리 없는 단순 텍스트는 아래
 * `okMallangBStyle`/`okMallangBTitleStyle`을 `style` prop으로 직접 적용한다.
 */
export const fontFamily = {
  ydeStreetB: 'YdestreetB',
  ydeStreetL: 'YdestreetL',
  okMallangB: 'OkMallangBRegular',
};

/**
 * className(`font-ok-mallang-b`)이 실기기에서 깨지는 문제의 우회로 남겨둔 style 객체 —
 * 테두리 없는 단순 Ok Mallang B 텍스트(예: `okMallangBTitleStyle`)에 쓴다. 테두리가 있는
 * 텍스트는 `OkMallangBText`(위 주석 참고)를 쓸 것.
 */
export const okMallangBStyle = { fontFamily: fontFamily.okMallangB };

/** Figma 텍스트 스타일 공통 line-height (160%) */
export const lineHeightRatio = 1.6;

/**
 * Ok Mallang B 로 쓰는 한 줄짜리 강조 제목. Figma 모달의 "NOTICE" (6602:3955).
 *
 * Figma 에 이름 붙은 텍스트 스타일이 아니라 그 자리에서만 쓰는 22px 값이라 Heading/Body
 * 척도에는 넣지 않았다. 같은 크기가 다른 화면에도 나오면 그때 정식 토큰으로 올릴 것.
 * Episode 03의 "MINI GAME"(5726:3280)도 동일한 22px/160%여서 이 토큰을 공유한다.
 */
export const okMallangBTitleStyle = {
  ...okMallangBStyle,
  fontSize: 22,
  lineHeight: 22 * lineHeightRatio,
};

/** Figma 5726:3271: 781×300 쪽지 안의 컵·테이블 배치. */
export const infernoMiniGameLayout = {
  width: {
    'inferno-cup': '100px',
    // 카드 뒤집기 HUD 좌우 칸. 오른쪽 하트 4개 폭(6219:4039)만큼 왼쪽에도 빈 칸을 둬서
    // "MINI GAME" 제목이 가운데 오게 한다.
    'inferno-hud-side': '88px',
  },
  height: {
    'inferno-cup': '114px',
    // 테이블은 쪽지 상단에서 256px. 제목 60.8 + 간격 44 + 상단 여백 48을 뺀다.
    'inferno-cup-visible': '103.2px',
    'inferno-game-gap': '44px',
    'inferno-table': '44px',
  },
  spacing: { 'inferno-cup-gap': '70px' },
};

/** Figma: `Heading/H1` ~ `Heading/H5` */
export const heading = {
  h1: {
    fontFamily: fontFamily.ydeStreetB,
    fontSize: 24,
    lineHeight: 24 * lineHeightRatio,
  },
  h2: {
    fontFamily: fontFamily.ydeStreetB,
    fontSize: 20,
    lineHeight: 20 * lineHeightRatio,
  },
  h3: {
    fontFamily: fontFamily.ydeStreetB,
    fontSize: 18,
    lineHeight: 18 * lineHeightRatio,
  },
  h4: {
    fontFamily: fontFamily.ydeStreetB,
    fontSize: 16,
    lineHeight: 16 * lineHeightRatio,
  },
  h5: {
    fontFamily: fontFamily.ydeStreetB,
    fontSize: 14,
    lineHeight: 14 * lineHeightRatio,
  },
};

/** Figma: `Body/XL` ~ `Body/XXS` */
export const body = {
  xl: {
    fontFamily: fontFamily.ydeStreetL,
    fontSize: 20,
    lineHeight: 20 * lineHeightRatio,
  },
  l: {
    fontFamily: fontFamily.ydeStreetL,
    fontSize: 18,
    lineHeight: 18 * lineHeightRatio,
  },
  m: {
    fontFamily: fontFamily.ydeStreetL,
    fontSize: 16,
    lineHeight: 16 * lineHeightRatio,
  },
  s: {
    fontFamily: fontFamily.ydeStreetL,
    fontSize: 14,
    lineHeight: 14 * lineHeightRatio,
  },
  xs: {
    fontFamily: fontFamily.ydeStreetL,
    fontSize: 12,
    lineHeight: 12 * lineHeightRatio,
  },
  xxs: {
    fontFamily: fontFamily.ydeStreetL,
    fontSize: 10,
    lineHeight: 10 * lineHeightRatio,
  },
};

/** `Ok Mallang B` 표시용 텍스트의 line-height 비율. Figma: `leading-[1.1]` (Heading/Body 의 1.6 과 다름). */
const DISPLAY_LINE_HEIGHT_RATIO = 1.1;

/**
 * `Ok Mallang B` 전용 사이즈. Figma 에 Heading/Body 처럼 정식 텍스트 스타일이 없어서
 * (§8 "OK Mallang B has no registered font-size scale") 인라인 값이 원칙이지만,
 * 러빈지옥 미니게임 화면에서 2곳 이상 재사용되는 값만 여기 토큰으로 올린다.
 *
 * `fill`/`stroke`도 Figma에 인스턴스별로 박혀 있는 실제 값이다(코드젠 도구가 텍스트 stroke를
 * CSS로 뽑아주지 않아 스크린샷을 픽셀 단위로 확인해 값을 구했다 — Figma 인스펙터의 정확한 px
 * 값과 다를 수 있으니 추후 실제 값을 알게 되면 여기만 고치면 된다). 이 색/두께는 텍스트마다
 * 다를 수 있어(§8) 절대 서로 재사용하지 않는다 — title은 pink-200 얇은 테두리, score는 진한
 * 검정 두꺼운 테두리로 서로 다르다.
 */
export const display = {
  /** "Ready?" / "Game Over" 오버레이 타이틀. Figma: 6285:6955, 6263:6495 등 40px, pink-500 위 pink-200 stroke ~2px. */
  title: {
    fontFamily: fontFamily.okMallangB,
    fontSize: 40,
    lineHeight: 40 * DISPLAY_LINE_HEIGHT_RATIO,
    fill: pink[500],
    stroke: { color: pink[200], width: 2 },
  },
  /** 게임 프레임 좌상단 기록 카운터. Figma: 6285:7097, 6263:6384 등 28px, white 위 black(#1D1D1D) stroke ~3px. */
  score: {
    fontFamily: fontFamily.okMallangB,
    fontSize: 28,
    lineHeight: 28 * DISPLAY_LINE_HEIGHT_RATIO,
    fill: defaultColor.white,
    stroke: { color: defaultColor.black, width: 3 },
  },
};

export const typography = { fontFamily, heading, body, display };

// --- 아래는 tailwind.config.js 가 그대로 쓰는 형태로 위 값에서 파생시킨 것 ---

/** tailwind.config.js 의 fontSize 항목 형태: [크기, { lineHeight }] */
type TailwindFontSize = [string, { lineHeight: string }];

const toTailwindFontSize = (size: number, ratio: number = lineHeightRatio): TailwindFontSize => [
  `${size}px`,
  // '160%' 로 쓰면 react-native-css-interop 이 버리므로 단위 없는 숫자 문자열을 쓴다.
  { lineHeight: String(ratio) },
];

/**
 * `font-yde-street-b` / `font-yde-street-l`. Ok Mallang B는 여기 없다 — `font-ok-mallang-b`
 * Tailwind 클래스는 실기기에서 항상 폰트가 깨진다(위 `fontFamily.okMallangB` 주석 참고).
 * display-*는 테두리(stroke)까지 있어 애초에 Tailwind 클래스가 아니라 `OkMallangBText`
 * 컴포넌트가 `display.title`/`display.score` 토큰을 style로 직접 읽어 그린다.
 */
export const tailwindFontFamily = {
  'yde-street-b': [fontFamily.ydeStreetB],
  'yde-street-l': [fontFamily.ydeStreetL],
};

/** `text-heading-h1` / `text-body-m` 등 */
export const tailwindFontSize: Record<string, TailwindFontSize> =
  Object.fromEntries([
    ...Object.entries(heading).map(([key, v]): [string, TailwindFontSize] => [
      `heading-${key}`,
      toTailwindFontSize(v.fontSize),
    ]),
    ...Object.entries(body).map(([key, v]): [string, TailwindFontSize] => [
      `body-${key}`,
      toTailwindFontSize(v.fontSize),
    ]),
  ]);

export type Typography = typeof typography;
export type HeadingLevel = keyof typeof heading;
export type BodySize = keyof typeof body;
export type DisplaySize = keyof typeof display;
