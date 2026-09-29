import type { AABB } from '@/src/features/luvin-hell/engine/types';

/**
 * AABB(축 정렬 사각형) 충돌 판정.
 *
 * 순수 함수 — RN/Reanimated import 없음. 매프레임 워클릿 안에서 직접 호출되므로
 * 'worklet' 지시어를 갖는다(다른 파일에서 import 된 함수는 Reanimated babel 플러그인이
 * 자동 workletize 하지 않기 때문에 필요 — AGENTS.md §6, 엔진 아키텍처 참고).
 */
export function isAabbOverlap(a: AABB, b: AABB): boolean {
  'worklet';
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * 렌더 박스(스프라이트가 `contentFit="contain"`으로 차지하는 전체 사각형)를 중심 기준으로
 * 축소한 히트박스를 만든다. 스프라이트 PNG 안의 투명 여백(레터박싱 포함) 때문에 렌더 박스
 * 그대로를 충돌판정에 쓰면 눈에는 안 닿았는데 하트가 깎이는 오판정이 난다 — 실제로 그려지는
 * 캐릭터/장애물 크기에 맞춰 판정 영역만 `scale` 비율(0~1)로 줄인다.
 */
export function shrinkAabb(box: AABB, scale: number): AABB {
  'worklet';
  const width = box.width * scale;
  const height = box.height * scale;
  return {
    x: box.x + (box.width - width) / 2,
    y: box.y + (box.height - height) / 2,
    width,
    height,
  };
}
