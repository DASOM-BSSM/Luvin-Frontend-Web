import httpClient from '@/src/lib/http-client';

import type { SimulationHighlightView, SimulationReportView } from '@/src/features/inferno/api/simulation-types';

/**
 * `GET /api/simulation/report`, `GET /api/simulation/highlights`.
 *
 * 백엔드 확인 완료 — `ai-season.ts`의 다른 엔드포인트(`com.luvin.ai.*`, 항상
 * `ApiEnvelope<T>`로 감쌈)와 달리 이 둘은 `com.luvin.simulation` 패키지 소속이라
 * 래퍼 없이 최상위에 데이터가 그대로 온다.
 */
export async function getSimulationReport(): Promise<SimulationReportView> {
  const { data } = await httpClient.get<SimulationReportView>('/api/simulation/report');
  return data;
}

export async function getSimulationHighlights(): Promise<SimulationHighlightView[]> {
  const { data } = await httpClient.get<SimulationHighlightView[]>('/api/simulation/highlights');
  return data;
}
