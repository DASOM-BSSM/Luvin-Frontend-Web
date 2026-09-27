import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { useAuthStore } from "@/src/features/auth/store/auth-store";
import { getSeasonReport, requestEpisodeGeneration } from "@/src/features/inferno/api/ai-season";
import type { AiReportView } from "@/src/features/inferno/api/ai-season-types";
import { aiSeasonKeys, simulationKeys } from "@/src/features/inferno/api/query-keys";
import { getInfernoSeasonSummary } from "@/src/features/inferno/api/season-summary";
import {
  getSimulationHighlights,
  getSimulationReport,
} from "@/src/features/inferno/api/simulation";
import type { SimulationHighlightView, SimulationReportView } from "@/src/features/inferno/api/simulation-types";
import useAiSeasonStatus from "@/src/features/inferno/hooks/use-ai-season-status";
import type { InfernoSeasonSummary } from "@/src/features/inferno/types";
import {
  mapFinalMatchFromReport,
  mapSimulationHighlights,
  mapSimulationReport,
} from "@/src/features/inferno/utils/map-ai-season-report";

/** AI 생성이 아직 안 끝났을 때 다시 확인하는 간격(use-ai-episode-messages.ts 와 같은 값). */
const REPORT_POLL_MS = 3000;

/** 생성 요청 응답의 `jobStatus`. 실제로 확인된 값은 `'FAILED'` 뿐이라 이것만 특별 취급한다. */
const FAILED_JOB_STATUS = "FAILED";

/**
 * ep1~4 의 `GET .../episodes/{number}` 처럼, 5화 리포트 관련 GET 도 generation을 아직 한
 * 번도 요청 안 했으면 200이 아니라 에러로 응답한다(실기기 확인: `ai/seasons/report`는 409
 * "5화 generation이 아직 접수되지 않았습니다", `simulation/report`는 404 "아직 생성된
 * 리포트가 없습니다"). 이걸 실패로 취급하면 아래 폴링/생성 요청 로직이 안 걸리므로, 여기서
 * 흡수해서 "아직 없음"(null)으로 정규화한다.
 */
function isNotGeneratedYetError(error: unknown): boolean {
  return axios.isAxiosError(error) && (error.response?.status === 409 || error.response?.status === 404);
}

async function fetchSeasonReportOrNull(): Promise<AiReportView | null> {
  try {
    const data = await getSeasonReport();
    if (__DEV__) {
      console.log(`[ep5] ai-season report 준비됨 finalPartnerId=${data.finalPartnerId}`);
    }
    return data;
  } catch (error) {
    if (isNotGeneratedYetError(error)) {
      if (__DEV__) {
        console.log('[ep5] ai-season report 아직 준비 안 됨 (409/404) -> null 로 취급');
      }
      return null;
    }
    throw error;
  }
}

async function fetchSimulationReportOrNull(): Promise<SimulationReportView | null> {
  try {
    const data = await getSimulationReport();
    if (__DEV__) {
      console.log('[ep5] simulation report 준비됨');
    }
    return data;
  } catch (error) {
    if (isNotGeneratedYetError(error)) {
      if (__DEV__) {
        console.log('[ep5] simulation report 아직 준비 안 됨 (409/404) -> null 로 취급');
      }
      return null;
    }
    throw error;
  }
}

async function fetchSimulationHighlightsOrNull(): Promise<SimulationHighlightView[] | null> {
  try {
    const data = await getSimulationHighlights();
    if (__DEV__) {
      console.log(`[ep5] simulation highlights 준비됨 count=${data.length}`);
    }
    return data;
  } catch (error) {
    if (isNotGeneratedYetError(error)) {
      if (__DEV__) {
        console.log('[ep5] simulation highlights 아직 준비 안 됨 (409/404) -> null 로 취급');
      }
      return null;
    }
    throw error;
  }
}

interface UseInfernoSeasonSummaryResult {
  summary: InfernoSeasonSummary | undefined;
  isLoading: boolean;
  isError: boolean;
  /** AI 생성 요청 자체가 실패로 응답한 상태(use-ai-episode-messages 주석 참고). */
  hasGenerationFailed: boolean;
  /** 생성 실패 안내의 "다시 시도"가 부를 함수. */
  retryGeneration: () => void;
}

/**
 * ep5 하나뿐이라 "AI 연결된 회차" 집합을 따로 두지 않는다 — order 가 5가 아니면(있을 수 없지만
 * 타입상 열려 있어) 그냥 로컬 값을 돌려준다.
 *
 * `report`/`highlights`는 `GET /api/simulation/*`, `finalMatch`는 `GET /api/ai/seasons/report`의
 * `finalPartnerId`에서 뽑는다(map-ai-season-report.ts 주석 참고) — "다시 굽기" 이후 상대가
 * 바뀐 경우까지 이 값 하나로 정확히 반영된다(예전엔 ep4 대화에서 직접 추론하는 우회
 * 로직을 썼는데, 다시 굽기 후에는 틀린 상대가 나오는 한계가 있어서 이 엔드포인트로
 * 교체했다).
 */
export default function useInfernoSeasonSummary(order: number): UseInfernoSeasonSummaryResult {
  const isAiConnected = order === 5;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasRequestedGeneration = useRef(false);
  const [hasGenerationFailed, setHasGenerationFailed] = useState(false);

  const seasonQuery = useAiSeasonStatus();
  const seasonReportQuery = useQuery({
    queryKey: aiSeasonKeys.report,
    queryFn: fetchSeasonReportOrNull,
    enabled: isAuthenticated && isAiConnected,
    refetchInterval: (query) => (hasGenerationFailed || query.state.data != null ? false : REPORT_POLL_MS),
  });
  const reportQuery = useQuery({
    queryKey: simulationKeys.report,
    queryFn: fetchSimulationReportOrNull,
    enabled: isAuthenticated && isAiConnected,
    refetchInterval: (query) => (hasGenerationFailed || query.state.data != null ? false : REPORT_POLL_MS),
  });
  const highlightsQuery = useQuery({
    queryKey: simulationKeys.highlights,
    queryFn: fetchSimulationHighlightsOrNull,
    enabled: isAuthenticated && isAiConnected,
    refetchInterval: (query) => (hasGenerationFailed || query.state.data != null ? false : REPORT_POLL_MS),
  });

  const isReportReady = seasonReportQuery.data != null && reportQuery.data != null && highlightsQuery.data != null;

  function triggerGeneration() {
    hasRequestedGeneration.current = true;
    if (__DEV__) {
      console.log('[ep5] POST generations 요청');
    }
    requestEpisodeGeneration(order)
      .then((result) => {
        if (__DEV__) {
          console.log(
            `[ep5] generations 응답 jobStatus=${result.jobStatus} errorCode=${result.errorCode} jobId=${result.jobId}`,
          );
        }
        if (result.jobStatus === FAILED_JOB_STATUS) {
          setHasGenerationFailed(true);
        }
      })
      .catch((error) => {
        if (__DEV__) {
          console.log(
            `[ep5] generations 요청 실패 status=${axios.isAxiosError(error) ? error.response?.status : '?'}`,
            axios.isAxiosError(error) ? error.response?.data : error,
          );
        }
        setHasGenerationFailed(true);
      });
  }

  useEffect(() => {
    if (!isAiConnected || isReportReady || hasRequestedGeneration.current) {
      return;
    }

    // 셋 다 응답을 받아본 뒤에만 판단한다 — 아직 로딩 중인데 성급하게 생성을 요청하지 않는다.
    if (seasonReportQuery.isSuccess && reportQuery.isSuccess && highlightsQuery.isSuccess) {
      if (__DEV__) {
        console.log(
          `[ep5] effect: seasonReportReady=${seasonReportQuery.data != null} simReportReady=${reportQuery.data != null} highlightsReady=${highlightsQuery.data != null}`,
        );
      }
      triggerGeneration();
    }
  }, [isAiConnected, isReportReady, seasonReportQuery.isSuccess, reportQuery.isSuccess, highlightsQuery.isSuccess]);

  /** "다시 시도". 실패 표시를 내리고 생성을 다시 요청한다. */
  function retryGeneration() {
    setHasGenerationFailed(false);
    triggerGeneration();
  }

  if (!isAiConnected) {
    return {
      summary: getInfernoSeasonSummary(order),
      isLoading: false,
      isError: false,
      hasGenerationFailed: false,
      retryGeneration: () => {},
    };
  }

  const finalMatch =
    seasonQuery.data && seasonReportQuery.data
      ? mapFinalMatchFromReport(seasonReportQuery.data, seasonQuery.data)
      : undefined;

  const summary: InfernoSeasonSummary | undefined =
    finalMatch && reportQuery.data && highlightsQuery.data
      ? {
          episodeOrder: 5,
          finalMatch,
          report: mapSimulationReport(reportQuery.data),
          highlights: mapSimulationHighlights(highlightsQuery.data),
        }
      : undefined;

  return {
    summary,
    isLoading:
      seasonQuery.isLoading ||
      seasonReportQuery.isLoading ||
      reportQuery.isLoading ||
      highlightsQuery.isLoading ||
      (seasonReportQuery.isSuccess &&
        reportQuery.isSuccess &&
        highlightsQuery.isSuccess &&
        !isReportReady &&
        !hasGenerationFailed),
    isError:
      seasonQuery.isError ||
      seasonReportQuery.isError ||
      reportQuery.isError ||
      highlightsQuery.isError,
    hasGenerationFailed,
    retryGeneration,
  };
}
