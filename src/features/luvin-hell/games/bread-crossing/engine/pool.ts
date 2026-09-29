import { POOL_SIZE } from '@/src/features/luvin-hell/games/bread-crossing/engine/constants';

/**
 * laneIndex → 렌더 슬롯 id (링버퍼). 연속된 POOL_SIZE개의 laneIndex는 이 함수를 통해
 * 항상 서로 다른 slot id로 흩어지고, 플레이어가 한 칸 전진할 때 화면에서 빠지는 레인과
 * 새로 들어오는 레인은 같은 slot id를 공유한다 — React가 `key`로 그 슬롯의 컴포넌트
 * 인스턴스를 재사용해 리마운트 없이 laneIndex prop만 바꿔치기하게 된다.
 */
export function laneSlotIndex(laneIndex: number): number {
  return ((laneIndex % POOL_SIZE) + POOL_SIZE) % POOL_SIZE;
}
