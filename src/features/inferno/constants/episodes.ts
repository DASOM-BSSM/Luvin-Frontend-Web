import type { InfernoEpisode } from '@/src/features/inferno/types';

/**
 * 타이틀 위 알약 문구. 에피소드가 달라도 이 문구는 항상 같아서 에피소드마다 두지 않는다.
 * Figma `ep0-시작` (6159:3326).
 */
export const INFERNO_TAGLINE = '낯선 온도를 만나는 반죽들의 이야기';

/**
 * 러빈지옥 전체 에피소드. API 연동 전까지 여기서 관리한다.
 *
 * 에피소드를 추가하거나 제목을 고칠 일이 생기면 이 배열만 건드리면 된다.
 */
export const INFERNO_EPISODES: readonly InfernoEpisode[] = [
  { order: 0, title: '러빈지옥에 대해 알려드릴게요' },
  { order: 1, title: '안녕하세요 소금빵입니다!' },
  { order: 2, title: '우리 조금 잘 맞는 것 같아요' },
  { order: 3, title: '미니게임으로 사랑을 쟁취하세요!' },
  { order: 4, title: '계속 알아가고 싶어요' },
  { order: 5, title: '최종 결과를 공유해요' },
];
