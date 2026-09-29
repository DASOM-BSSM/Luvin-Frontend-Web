/**
 * 화면에 보이는 두 자리 문항 번호.
 * Figma 가 "01 / 20", "반죽 만들기 01.", 보기의 "01" 을 모두 0 을 채워서 쓴다.
 */
export function formatQuestionNumber(value: number): string {
  return String(value).padStart(2, '0');
}
