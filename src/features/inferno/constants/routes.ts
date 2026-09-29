import type { Href } from 'expo-router';

/**
 * 회차 → 본문 라우트.
 *
 * 경로를 문자열로 조합하지 않고 표로 두는 이유가 둘이다. typedRoutes 가 켜져 있어 조합한
 * 문자열은 타입이 맞지 않고(§2), 라우트 경로 자체가 딥링크 계약이라 한곳에서만 다뤄야
 * 이름이 바뀔 때 빠뜨리지 않는다(§13).
 *
 * 본문이 아직 없는 회차는 여기에 없다. 없는 회차로는 들어가지 못하게 호출부가 막는다.
 */
export const INFERNO_EPISODE_HREFS: Record<number, Href | undefined> = {
  0: '/inferno/ep0',
  1: '/inferno/ep1',
  2: '/inferno/ep2',
  3: '/inferno/ep3',
  4: '/inferno/ep4',
  5: '/inferno/ep5',
};

/** 회차 시작 화면으로 가는 링크. 시작 화면은 회차를 검색 파라미터로 받는다. */
export function infernoIntroHref(order: number): Href {
  return { pathname: '/inferno', params: { order: String(order) } };
}
