/**
 * "내 성향" 화면 도메인 타입. Figma "Luvin-Design" / `내 성향-우린` (5747:4183).
 *
 * 내 분신 빵 자체(BreadProfile)는 홈 화면과 같은 타입을 쓴다.
 */

/** 내 반죽에 맞춰 추천되는 심리학 영상 한 편. */
export interface RecommendedVideo {
  /** 예: "[비치키] 원하면서 도망치는 이유" */
  title: string;
  /**
   * 유튜브 영상 ID. 썸네일 주소는 여기서 만든다(utils/youtube.ts).
   * 남의 영상 이미지라 저장소에 두지 않고 항상 원격에서 불러온다.
   */
  youtubeId: string;
}
