import { View } from 'react-native';

import Text from '@/src/components/ui/text';
import { okMallangBTitleStyle } from '@/src/constants/typography';
import type { InfernoSeasonReport } from '@/src/features/inferno/types';

interface InfernoAnalysisSceneProps {
  report: InfernoSeasonReport;
}

/**
 * [DRAFT] ep5 2페이지 — 행동 분석 리포트.
 *
 * Figma "ep5-결과"(5748:4314)에 쪽지 틀(781x300)과 "REPORT" 타이틀 + 한 줄까지만 잡혀
 * 있고(재확인 완료) 나머지 항목은 여전히 시안이 없다.
 *
 * 예전엔 `/api/simulation/report`가 강점/약점/조언을 텍스트 배열로 따로 줘서 칩(배지)
 * 레이아웃을 썼는데, 백엔드 확인 완료 — AI 시즌은 이 엔드포인트를 아예 안 쓰고
 * `/api/ai/seasons/report`의 `narrative`(문장 하나)로 리포트 전체를 받는다. 구조화된
 * 강점/약점 데이터가 없어져서 칩 레이아웃을 걷어내고 서술형 문단 하나로 단순화했다 —
 * 디자인이 나오면 다시 손볼 자리(§8 예외, 위 DRAFT 주석과 같은 이유).
 *
 * 다음 페이지 이동은 상단 바 "다음화면"(InfernoTopBar)이 이미 있어 페이지 안에 따로
 * 버튼을 두지 않는다 — 중복이라 뺐다.
 */
export default function InfernoAnalysisScene({ report }: InfernoAnalysisSceneProps) {
  return (
    <View className="w-full flex-1 flex-col items-center justify-center gap-[16px] px-[40px]">
      <Text className="text-center text-pink-500" style={okMallangBTitleStyle}>
        REPORT
      </Text>
      <Text variant="body-m" className="text-center text-text-primary">
        {report.narrative}
      </Text>
    </View>
  );
}
