import type { BreadState, BreadType } from '@/src/assets/images/BreadCharacter';

/** 내 분신(빵) 프로필. 메인 상단 카드에 쓰인다. */
export interface BreadProfile {
  type: BreadType;
  state: BreadState;
  /** 예: "쫀쫀한 소금빵 반죽" */
  name: string;
  /** 예: "저는 오직 제 사람에게만 따뜻해요" */
  description: string;
}

/** 이번주 에피소드 썸네일. */
export interface WeeklyEpisode {
  /** 1 이면 "Episode 01." 로 보여준다. */
  order: number;
  /** 예: "안녕하세요 소금빵입니다!" */
  title: string;
}

/** 감정일기 미리보기 카드 한 장. */
export interface DiaryPreview {
  authorType: BreadType;
  authorState: BreadState;
  /** 예: "쫀쫀한 카스테라" */
  authorName: string;
  /** 서버에서 내려주는 표시용 문자열. 예: "1시간 전" */
  relativeTime: string;
  /** 줄바꿈(\n)으로 문단을 나눈다. */
  message: string;
}
