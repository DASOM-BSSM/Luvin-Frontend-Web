/** `user` 기능의 쿼리 키 팩토리(§11) — 컴포넌트에 문자열 배열을 흩어놓지 않는다. */
export const userKeys = {
  me: ['user', 'me'] as const,
};
