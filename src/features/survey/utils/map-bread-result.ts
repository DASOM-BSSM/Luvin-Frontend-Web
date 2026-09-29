import type { BreadType } from '@/src/assets/images/BreadCharacter';
import type { BreadProfile } from '@/src/features/home/types';
import { deriveAdjective, getBreadFlavorName } from '@/src/features/inferno/utils/character-persona';
import type { BreadCanonicalType, SurveyResult } from '@/src/features/survey/types';

/** FRONTEND_CHANGES.md §6 매핑표. 서버 canonical ID → 화면 BreadType. */
const CANONICAL_TO_BREAD_TYPE: Record<BreadCanonicalType, BreadType> = {
  cream_bread: 'cream',
  red_bean_bread: 'redbean',
  salt_bread: 'salt',
  pretzel: 'pretzel',
  donut: 'donut',
  baguette: 'baguette',
  madeleine: 'madeleine',
  castella: 'castella',
};

/**
 * 서버 결과를 화면이 쓰는 `BreadProfile`로 바꾼다. 순수 함수(§6).
 *
 * 모르는 canonical 코드는 salt 로 fallback하지 않고 `null` — 화면이 "결과를 불러올 수
 * 없음"으로 처리해야 한다(§6). `state`는 항상 'dough'다 — 설문 결과와 시뮬레이션의
 * dough/baked 진행 상태는 별개라, 설문만 마쳤다고 baked로 올리지 않는다.
 *
 * 서버 `displayName`엔 형용사가 없다("팥빵 반죽") — AI 캐릭터 이름과 같은 규칙(형용사 +
 * 반죽 종류)을 맞추려고 `resultId`로 형용사 하나를 고정해서 앞에 붙인다(사용자 확인 완료).
 * `resultId`가 안 바뀌는 한 이 형용사도 항상 같다 — 재설문으로 새 결과(새 resultId)가
 * 생겨야만 바뀐다.
 *
 * `description`은 이번 시즌엔 고정 문구다 — 유형별로 다른 설명을 지어내지 않는다. "반죽"은
 * 안 붙인다(사용자 확인) — "당신은 쫀쫀한 소금빵 성향이 나타났어요!"처럼 빵 종류까지만 쓴다.
 */
export function mapSurveyResultToBreadProfile(result: SurveyResult): BreadProfile | null {
  const type = CANONICAL_TO_BREAD_TYPE[result.primaryType];
  if (!type) {
    return null;
  }

  const adjective = deriveAdjective(result.resultId);
  const name = `${adjective} ${result.displayName}`;
  const flavorName = getBreadFlavorName(type);

  return {
    type,
    state: 'dough',
    name,
    description: `당신은 ${adjective} ${flavorName} 성향이 나타났어요!`,
  };
}
