export const INACTIVE_KIND = -1;
export const GROUND_KIND = 0;
export const AIR_KIND = 1;

/** 비활성(재사용 가능) 슬롯의 인덱스를 찾는다. 없으면 -1. 스폰 시점에만 호출한다(매프레임 아님). */
export function findInactiveSlotIndex(kindFlags: readonly number[]): number {
  'worklet';
  for (let i = 0; i < kindFlags.length; i++) {
    if (kindFlags[i] === INACTIVE_KIND) return i;
  }
  return -1;
}
