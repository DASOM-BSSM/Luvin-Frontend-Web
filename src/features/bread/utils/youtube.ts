/**
 * 유튜브 영상 ID 로 썸네일 주소를 만든다.
 *
 * 추천 영상 썸네일은 남의 영상 이미지라 저장소에 두지 않고 항상 원격에서 불러온다.
 * `hqdefault` 는 모든 영상에 항상 존재하는 크기다(maxresdefault 는 없는 영상이 있다).
 */
export function youtubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
