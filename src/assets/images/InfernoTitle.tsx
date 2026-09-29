import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';

const InteropImage = cssInterop(Image, { className: 'style' });

/** 내보낸 PNG 의 가로세로 비(1998:240). 폭에서 높이를 구할 때 쓴다. */
export const INFERNO_TITLE_ASPECT = 1998 / 240;

interface InfernoTitleProps {
  /** 표시 폭(px). 높이는 원본 비율로 자동 계산된다. */
  width: number;
}

/**
 * "Luvin's Inferno" 워드마크. Figma 6159:3324 를 그대로 내보낸 PNG(1998x240, 3배율).
 *
 * 시안은 `Ok Mallang B` 80px 을 쓰는데 프로젝트에 없는 폰트이고(AGENTS.md §8 은 Ydestreet
 * 두 종류만 허용) 분홍 글로우 효과까지 얹혀 있어, 텍스트가 아니라 에셋으로 넣는다.
 *
 * 폭을 px 로 받는 이유: 등장 연출이 이 그림을 좌우로 잘라 가며 드러내는데, 부모가 좁아질 때
 * 그림까지 같이 줄어들면 글자가 밀려 나오는 것처럼 보이지 않기 때문이다. 그래서 폭을 고정한다.
 */
export default function InfernoTitle({ width }: InfernoTitleProps) {
  return (
    <InteropImage
      source={require('@/src/assets/images/inferno-title.png')}
      style={{ width, height: width / INFERNO_TITLE_ASPECT }}
      contentFit="contain"
      accessibilityLabel="Luvin's Inferno"
    />
  );
}
