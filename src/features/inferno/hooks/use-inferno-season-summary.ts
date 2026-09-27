import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { useAuthStore } from "@/src/features/auth/store/auth-store";
import { getSeasonReport, requestEpisodeGeneration } from "@/src/features/inferno/api/ai-season";
import type { AiReportView } from "@/src/features/inferno/api/ai-season-types";
import { aiSeasonKeys } from "@/src/features/inferno/api/query-keys";
import { getInfernoSeasonSummary } from "@/src/features/inferno/api/season-summary";
import useAiSeasonStatus from "@/src/features/inferno/hooks/use-ai-season-status";
import type { InfernoSeasonSummary } from "@/src/features/inferno/types";
import { mapAiHighlights, mapAiReport, mapFinalMatchFromReport } from "@/src/features/inferno/utils/map-ai-season-report";

/** AI 생성이 아직 안 끝났을 때 다시 확인하는 간격(use-ai-episode-messages.ts 와 같은 값). */
const REPORT_POLL_MS = 3000;

/** 생성 요청 응답의 `jobStatus`. 실제로 확인된 값은 `'FAILED'` 뿐이라 이것만 특별 취급한다. */
const FAILED_JOB_STATUS = "FAILED";

/**
 * ep1~4 의 `GET .../episodes/{number}` 처럼, `GET /api/ai/seasons/report`도 5화 generation을
 * 아직 한 번도 요청 안 했으면 200이 아니라 409로 응답한다(실기기 확인: "5화 generation이
 * 아직 접수되지 않았습니다"). 이걸 실패로 취급하면 아래 폴링/생성 요청 로직이 안 걸리므로,
 * 여기서 흡수해서 "아직 없음"(null)으로 정규화한다.
 *
 * `/api/simulation/report`, `/api/simulation/highlights`는 더 이상 호출하지 않는다 —
 * 백엔드 확인 완료: AI 시즌 계정은 `simulation_reports`에 애초에 행이 생기지 않아 영영
 * 404이고, 리포트/하이라이트는 이 엔드포인트의 `narrative`/`highlights` 필드로 완전히
 * 대체됐다.
 */
function isNotGeneratedYetError(error: unknown): boolean {
  return axios.isAxiosError(error) && (error.response?.status === 409 || error.response?.status === 404);
}

async function fetchSeasonReportOrNull(): Promise<AiReportView | null> {
  try {
    const data = await getSeasonReport();
    if (__DEV__) {
      console.log(
        `[ep5] ai-season report 준비됨 finalPartnerId=${data.finalPartnerId} narrative=${data.narrative?.slice(0, 40)}... highlights=${JSON.stringify(data.highlights)}`,
      );
    }
    return data;
  } catch (error) {
    if (isNotGeneratedYetError(error)) {
      if (__DEV__) {
        console.log("[ep5] ai-season report 아직 준비 안 됨 (409/404) -> null 로 취급");
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
 * 리포트/최종 매칭/하이라이트를 전부 `GET /api/ai/seasons/report` 하나에서 뽑는다
 * (map-ai-season-report.ts 주석 참고) — `finalPartnerId`는 "다시 굽기" 이후 상대가 바뀐
 * 경우까지 정확히 반영된다(예전엔 ep4 대화에서 직접 추론하는 우회 로직을 썼는데, 다시
 * 굽기 후에는 틀린 상대가 나오는 한계가 있어서 이 엔드포인트로 교체했다).
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

  const isReportReady = seasonReportQuery.data != null;

  function triggerGeneration() {
    hasRequestedGeneration.current = true;
    if (__DEV__) {
      console.log("[ep5] POST generations 요청");
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
            `[ep5] generations 요청 실패 status=${axios.isAxiosError(error) ? error.response?.status : "?"}`,
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

    if (seasonReportQuery.isSuccess) {
      if (__DEV__) {
        console.log(`[ep5] effect: seasonReportReady=${seasonReportQuery.data != null}`);
      }
      triggerGeneration();
    }
  }, [isAiConnected, isReportReady, seasonReportQuery.isSuccess]);

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
    finalMatch && seasonReportQuery.data
      ? {
          episodeOrder: 5,
          finalMatch,
          report: mapAiReport(seasonReportQuery.data),
          highlights: mapAiHighlights(seasonReportQuery.data.highlights),
        }
      : undefined;

  return {
    summary,
    isLoading:
      seasonQuery.isLoading ||
      seasonReportQuery.isLoading ||
      (seasonReportQuery.isSuccess && !isReportReady && !hasGenerationFailed),
    isError: seasonQuery.isError || seasonReportQuery.isError,
    hasGenerationFailed,
    retryGeneration,
  };
}
