import type { BreadType } from '@/src/assets/images/BreadCharacter';

/** 미니게임 장애물에 쓰는 반죽 종류 전체 — `BreadCharacter`의 8종을 그대로 재사용한다(§8, 신규 캐릭터 금지). */
export const DOUGH_TYPES: BreadType[] = [
  'salt',
  'castella',
  'madeleine',
  'redbean',
  'baguette',
  'cream',
  'donut',
  'pretzel',
];

/** 직전 종류와 다른 반죽을 하나 뽑는다. 같은 종류가 연달아 나오지 않게 하기 위함. */
export function pickNextDoughType(previous: BreadType | null, rng: () => number = Math.random): BreadType {
  if (DOUGH_TYPES.length <= 1) return DOUGH_TYPES[0];
  let candidate: BreadType;
  do {
    candidate = DOUGH_TYPES[Math.floor(rng() * DOUGH_TYPES.length)];
  } while (candidate === previous);
  return candidate;
}
