import { useState } from 'react';

/** [DRAFT] ep5 총 페이지 수. 최종 결과 → 행동 분석 → 하이라이트 → 시즌 마무리. */
const PAGE_COUNT = 4;

export interface InfernoEp5Flow {
  pageIndex: number;
  /** 넘기지 않으면 해당 버튼이 연해지고 눌리지 않는다(다른 회차와 같은 규칙). */
  goPrevious?: () => void;
  goNext?: () => void;
}

/**
 * [DRAFT] ep5 페이지 이동. Figma 디자인이 없어 실제 회차 데이터(InfernoConversation) 대신
 * 페이지 수만 세는 가장 단순한 형태다.
 *
 * ep1/ep2 와 달리 useInfernoStore 체크포인트를 쓰지 않는다 — ep3/ep4 와 같은 이유로,
 * 되돌릴 대화 상태가 없는 단순 리포트라 다시 들어오면 1페이지부터 봐도 무방하다.
 */
export default function useInfernoEp5Flow(): InfernoEp5Flow {
  const [pageIndex, setPageIndex] = useState(0);

  function showPreviousPage() {
    setPageIndex((index) => index - 1);
  }

  function showNextPage() {
    setPageIndex((index) => index + 1);
  }

  return {
    pageIndex,
    goPrevious: pageIndex > 0 ? showPreviousPage : undefined,
    goNext: pageIndex < PAGE_COUNT - 1 ? showNextPage : undefined,
  };
}
