import type { ComponentType } from 'react';

import InfernoFlowScene from '@/src/features/inferno/components/inferno-flow-scene';
import InfernoGreetingScene from '@/src/features/inferno/components/inferno-greeting-scene';
import InfernoGuideScene from '@/src/features/inferno/components/inferno-guide-scene';
import InfernoStructureScene from '@/src/features/inferno/components/inferno-structure-scene';

/**
 * ep0 의 장면 순서. 상단 바의 이전화면/다음화면이 이 순서를 따라간다.
 *
 * 장면마다 생김새가 달라서(인사말은 빵 묶음, 안내문은 글만) 데이터가 아니라 컴포넌트로 둔다.
 * 장면을 추가하려면 여기에 끼워 넣기만 하면 되고, 버튼 활성/비활성은 길이에서 알아서 나온다.
 */
export const EP0_SCENES: ComponentType[] = [
  InfernoGreetingScene,
  InfernoStructureScene,
  InfernoFlowScene,
  InfernoGuideScene,
];
