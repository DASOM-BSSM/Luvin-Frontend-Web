/**
 * 게임 씬(플레이필드) 전용 색상.
 *
 * `src/constants/colors.ts`는 Figma "Color system" 변수 컬렉션만 담는 곳인데,
 * 아래 값들은 미니게임 목업 일러스트에만 쓰인 로컬 값이라 그 컬렉션에 바인딩되어 있지
 * 않다(get_variable_defs로 확인). 디자인 시스템 토큰을 오염시키지 않기 위해 이 파일에
 * 따로 둔다 — HUD/버튼/텍스트 등 실제 화면 크롬에는 절대 쓰지 않고, 게임 씬 내부 배경/
 * 트랙 표현에만 쓴다.
 *
 * 도로/기찻길은 Figma에서 같은 베이스색(#525867)을 쓰고, #798498은 그 위에 얹는 얇은
 * 액센트(차선/철로선)일 뿐 전체 배경이 아니다 — 디자인 QA로 재확인(2차 세션).
 * #EB9F58/#FFBE77 계열은 침목·뗏목 같은 작은 소품 전용이라 레인 전체 배경에는 쓰지 않는다.
 */
export const sceneColors = {
  sky: '#5ED1FF',
  skyFade: '#FFFFFF',
  grass: '#A7ED3F',
  grassDark: '#86C628',
  ground: '#FFBE77',
  groundDark: '#EB9F58',
  /** 도로·기찻길 공용 베이스(Figma 확인). */
  trackBase: '#525867',
  /** 도로 차선 / 기찻길 철로선 액센트. */
  trackAccent: '#798498',
  /** 기찻길 침목, 강 뗏목 액센트. */
  woodAccent: '#EB9F58',
  /** 뗏목 위 밝은 스트라이프. */
  woodAccentLight: '#FFBE77',
  river: '#3FDCED',
  /** 초원 위 작은 표지판 소품(전체 배경으로는 쓰지 않음). */
  signWhite: '#FFFFFF',
  signAlert: '#FF0030',
};
