import type { BreadType } from '@/src/assets/images/BreadCharacter';

/**
 * AI 가 만든 캐릭터(성별/나이/성격만 있음, 이름·반죽타입 없음)를 화면에 필요한
 * "반죽 이름"으로 바꾼다. 기획 규칙: {형용사} {반죽 종류} 반죽 — 예: "유쾌한 카스테라 반죽".
 *
 * 형용사도 반죽 종류도 서버가 안 주므로 `characterId` 로 결정론적으로 고른다 — 그래야
 * 같은 캐릭터가 회차/화면을 옮겨 다녀도 항상 같은 이름·그림으로 보인다(진짜 랜덤이면
 * 렌더마다 달라져 버린다).
 */
const ADJECTIVES = [
  '차가운',
  '따뜻한',
  '똑똑한',
  '조용한',
  '다정한',
  '진지한',
  '성숙한',
  '유쾌한',
  '귀여운',
  '도도한',
  '발랄한',
  '느긋한',
  '꼼꼼한',
  '섬세한',
  '솔직한',
  '엉뚱한',
  '털털한',
  '세련된',
  '쫀쫀한',
] as const;

/** "반죽"이 안 붙은 빵 종류 이름만. */
const BREAD_FLAVOR_NAME: Record<BreadType, string> = {
  salt: '소금빵',
  castella: '카스테라',
  donut: '도넛',
  pretzel: '프레첼',
  baguette: '바게트',
  cream: '크림빵',
  redbean: '팥빵',
  madeleine: '마들렌',
};

const BREAD_TYPE_NOUN: Record<BreadType, string> = Object.fromEntries(
  Object.entries(BREAD_FLAVOR_NAME).map(([type, flavor]) => [type, `${flavor} 반죽`]),
) as Record<BreadType, string>;

const BREAD_TYPES = Object.keys(BREAD_TYPE_NOUN) as BreadType[];

export interface CharacterPersona {
  type: BreadType;
  name: string;
}

/** 문자열을 32비트 정수 해시로 뭉갠다. 암호화 목적이 아니라 결정론적 분산만 필요하다. */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** characterId 하나당 항상 같은 {형용사}+{반죽 종류} 조합을 돌려준다. */
export function deriveCharacterPersona(characterId: string): CharacterPersona {
  const hash = hashString(characterId);
  const type = BREAD_TYPES[hash % BREAD_TYPES.length];
  // 형용사는 반죽 종류와 다른 자리수를 써서 같은 해시로 둘 다 고를 때 편향되지 않게 한다.
  const adjective = ADJECTIVES[Math.floor(hash / BREAD_TYPES.length) % ADJECTIVES.length];

  return { type, name: `${adjective} ${BREAD_TYPE_NOUN[type]}` };
}

/**
 * 같은 형용사 풀에서, 임의의 seed(예: 설문 결과 ID)에 대해 항상 같은 형용사 하나를 고른다.
 * "내 반죽" 이름에도 캐릭터와 같은 규칙(형용사 + 반죽 종류)을 적용하는 데 쓴다
 * (map-bread-result.ts 참고) — 서버 displayName엔 형용사가 없어서 여기서 붙인다.
 */
export function deriveAdjective(seed: string): string {
  return ADJECTIVES[hashString(seed) % ADJECTIVES.length];
}

/**
 * 형용사 없는 "{반죽 종류} 반죽" 만 돌려준다. 매칭 결과 쪽지의 버튼 문구(예: "도넛 반죽과
 * 오븐 가기")처럼 조사가 이름 뒤에 바로 붙어야 하는 자리에 쓴다 — 모든 값이 "반죽"으로
 * 끝나 받침이 있으므로 "과" 조사를 그대로 붙여도 항상 맞다.
 */
export function getBreadTypeNoun(type: BreadType): string {
  return BREAD_TYPE_NOUN[type];
}

/** "반죽"도 형용사도 없는 빵 종류 이름만. 예: "소금빵". */
export function getBreadFlavorName(type: BreadType): string {
  return BREAD_FLAVOR_NAME[type];
}
