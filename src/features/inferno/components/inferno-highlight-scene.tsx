import { useState } from 'react';
import { FlatList, View, type ViewToken } from 'react-native';

import RiseIn from '@/src/components/ui/rise-in';
import Text from '@/src/components/ui/text';
import { okMallangBTitleStyle } from '@/src/constants/typography';
import type { InfernoHighlight } from '@/src/features/inferno/types';

/** 카드 사이 간격 — "간격이 좀 있었으면 좋겠다"는 피드백 반영(이전 버전에서 그대로 가져옴). */
const CARD_GAP_CLASS = 'gap-[36px]';
/** 40% 이상 보여야 그 카드가 "스크롤해서 도달했다"고 본다. */
const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 40 };

interface InfernoHighlightSceneProps {
  /** 서버가 준 순서 그대로 보여준다(map-ai-season-report.ts — 중요도 점수가 없어졌다). */
  highlights: InfernoHighlight[];
}

function getHighlightKey(highlight: InfernoHighlight, index: number): string {
  return `${index}-${highlight.text}`;
}

/**
 * [DRAFT] ep5 3페이지 — 하이라이트 모아보기.
 *
 * Figma "ep5-하이라이트"(5760:4351)에 쪽지 틀(781x300)과 "HIGHLIGHT" 타이틀까지만 잡혀
 * 있다(재확인 완료). 원래는 `GET /api/simulation/highlights`(제목/한 줄 요약/중요도/회차
 * 번호가 딱 정해진 카드형)를 썼는데, 백엔드 확인 완료 — AI 시즌은 이 엔드포인트를 아예 안
 * 쓰고 `/api/ai/seasons/report`의 `highlights`로 대체됐다. 이건 카드형 요약이 아니라 1:1
 * 대화 중 인상 깊었던 한 줄을 그대로 인용한 것이라(실기기 확인: 실제 키가 `text`), 제목
 * 없이 인용구 하나로 보여준다.
 *
 * 스크롤 등장 애니메이션은 이전 버전과 같은 방식이다: `FlatList`의
 * `onViewableItemsChanged`로 카드가 보이는 시점을 잡고 `RiseIn`으로 띄운다. 한 번 보인
 * 카드는 다시 스크롤해 지나가도 계속 나타난 상태로 둔다(재생 반복은 부산스럽다).
 */
export default function InfernoHighlightScene({ highlights }: InfernoHighlightSceneProps) {
  const [revealedKeys, setRevealedKeys] = useState<ReadonlySet<string>>(new Set());

  function handleViewableItemsChanged({ viewableItems }: { viewableItems: ViewToken[] }) {
    setRevealedKeys((current) => {
      const next = new Set(current);
      for (const viewable of viewableItems) {
        if (viewable.index != null) {
          next.add(getHighlightKey(viewable.item as InfernoHighlight, viewable.index));
        }
      }
      return next;
    });
  }

  function renderHighlight({ item: highlight, index }: { item: InfernoHighlight; index: number }) {
    const revealed = revealedKeys.has(getHighlightKey(highlight, index));

    return (
      <RiseIn start={revealed}>
        <View className="w-full flex-col gap-[4px]">
          <Text variant="heading-h4" className="text-text-primary">
            “{highlight.text}”
          </Text>
        </View>
      </RiseIn>
    );
  }

  return (
    <View className="flex-1 flex-col items-center gap-[8px] px-[30px] py-[16px]">
      <Text className="text-center text-pink-500" style={okMallangBTitleStyle}>
        HIGHLIGHT
      </Text>
      <FlatList
        className="w-full flex-1"
        contentContainerClassName={`flex-col ${CARD_GAP_CLASS}`}
        data={highlights}
        keyExtractor={getHighlightKey}
        renderItem={renderHighlight}
        showsVerticalScrollIndicator={false}
        viewabilityConfig={VIEWABILITY_CONFIG}
        onViewableItemsChanged={handleViewableItemsChanged}
      />
    </View>
  );
}
