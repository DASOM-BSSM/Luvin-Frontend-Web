import type { BreadType } from '@/src/assets/images/BreadCharacter';

/** 반죽 한 마리가 러빈지옥 화면에서 차지하는 자리. */
export interface InfernoDoughFigure {
  /** 대화 줄의 아바타 크기. 줄 높이도 이 값에서 나온다(말풍선 46보다 늘 크다). */
  chatSizeClass: string;
  /** 투표지 선택지의 작은 그림 크기. 폭은 50 으로 같고 높이만 반죽 비율을 따른다. */
  optionSizeClass: string;
}

/**
 * 반죽별 크기표. Figma `ep1-전체대화`(5425:886), `ep1-전체대화 끝`(6137:2782),
 * `ep1-투표지`(5452:1989) 의 인스턴스에서 잰 값.
 *
 * 시안에 나온 네 마리만 값이 있다. 다른 반죽이 대화에 끼면 그때 Figma 에서 크기를 확인해
 * 여기에 추가할 것(§8).
 *
 * 소금빵의 optionSizeClass 는 시안에 없다. 소금빵은 내 분신이라 투표 선택지에 뜨지 않기
 * 때문이고, 표를 비워 두지 않으려고 대화 아바타 비율(107x59)을 폭 50 에 맞춰 넣어 뒀다.
 */
export const INFERNO_DOUGH_FIGURES: Partial<Record<BreadType, InfernoDoughFigure>> = {
  salt: {
    chatSizeClass: 'h-[59px] w-[107px]',
    optionSizeClass: 'h-[28px] w-[50px]',
  },
  donut: {
    chatSizeClass: 'h-[72px] w-[84px]',
    optionSizeClass: 'h-[43px] w-[50px]',
  },
  pretzel: {
    chatSizeClass: 'h-[65px] w-[87px]',
    optionSizeClass: 'h-[37px] w-[50px]',
  },
  castella: {
    chatSizeClass: 'h-[67px] w-[86px]',
    optionSizeClass: 'h-[38px] w-[50px]',
  },
};

/** 시안에 없는 반죽이 나왔을 때 쓰는 임시 값. 실제 값이 나오면 위 표에 넣을 것. */
export const FALLBACK_DOUGH_FIGURE: InfernoDoughFigure = {
  chatSizeClass: 'h-[65px] w-[87px]',
  optionSizeClass: 'h-[37px] w-[50px]',
};

/**
 * 대화 줄 아바타가 차지하는 칸의 고정 폭(반죽 중 가장 넓은 소금빵 107px 기준, §8 회색지대:
 * 시안이 반죽 하나짜리 인스턴스만 보여줘서 "다른 반죽이 섞였을 때" 정렬 기준이 없다 —
 * 사용자 요청대로 반죽 크기와 무관하게 말풍선 끝을 맞추려고 만든 값).
 *
 * `inferno-chat-row`가 아바타를 이 폭짜리 칸 안에 넣고 말풍선 쪽 끝에 붙여 그린다. 반죽마다
 * `chatSizeClass` 폭이 달라도(84~107px) 칸 폭은 늘 같으니, 칸 다음에 오는 말풍선의 시작
 * 위치도 항상 같다 — 이게 없으면 반죽이 좁을수록 말풍선이 화면 안쪽으로 들어와 줄마다
 * 들쭉날쭉해 보인다(사용자 지적: "말풍선들이 빵 반죽 크기에 의해 뒤죽박죽 섞인것 처럼 보인다").
 */
export const CHAT_AVATAR_SLOT_CLASS = 'w-[107px]';

/** 칸과 말풍선 사이 고정 간격. 반죽마다 다르던 기존 값(12~24px) 중 더 촘촘한 쪽을 썼다. */
export const CHAT_ROW_GAP_CLASS = 'gap-[12px]';

/** 반죽 크기를 찾는다. 표에 없으면 임시 값. */
export function findDoughFigure(type: BreadType): InfernoDoughFigure {
  return INFERNO_DOUGH_FIGURES[type] ?? FALLBACK_DOUGH_FIGURE;
}
