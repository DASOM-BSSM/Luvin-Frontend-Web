import { create } from 'zustand';

import type { SurveyAnswers, SurveyDefinition } from '@/src/features/survey/types';

/** 서버에 실제로 보낼 형태. `frozenPayload`로 얼려서 재시도 때 같은 값을 그대로 쓴다. */
export interface SurveySubmissionPayload {
  definitionId: string;
  surveyVersion: string;
  clientSubmissionId: string;
  answers: { questionId: string; answerId: string }[];
}

/**
 * 진행 중인 설문의 상태. 메모리에만 둔다(§12) — 이어서 풀게 하는 영속 저장은
 * 별도 제품 범위다(FRONTEND_CHANGES.md §5.9).
 *
 * `definition`은 설문을 시작한 순간 고정한 snapshot이다. 진행 중 refetch가 일어나도
 * 이 값은 안 바뀐다 — 문항/답변 ID가 화면 밑에서 바뀌면 안 되기 때문이다.
 */
interface SurveyStore {
  definition: SurveyDefinition | null;
  /** 지금 보고 있는 문항의 0-based 인덱스. */
  currentIndex: number;
  answers: SurveyAnswers;
  /** 제출 시 한 번만 발급해서 재시도에도 그대로 재사용한다. */
  clientSubmissionId: string | null;
  /** 제출 시점에 얼린 payload. 성공하기 전까지 재시도는 이 값을 그대로 다시 보낸다. */
  frozenPayload: SurveySubmissionPayload | null;
  /** 정의를 받아와 설문을 처음부터 시작한다. */
  startSurvey: (definition: SurveyDefinition) => void;
  /** 답을 기록한다. 이미 답한 문항이면 덮어쓴다. */
  answerQuestion: (questionId: string, answerId: string) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  freezeSubmission: (payload: SurveySubmissionPayload) => void;
  /** 설문을 처음부터 다시 시작한다(정의 포함 전부 초기화). */
  resetSurvey: () => void;
}

export const useSurveyStore = create<SurveyStore>((set, get) => ({
  definition: null,
  currentIndex: 0,
  answers: {},
  clientSubmissionId: null,
  frozenPayload: null,

  startSurvey: (definition) =>
    set({ definition, currentIndex: 0, answers: {}, clientSubmissionId: null, frozenPayload: null }),

  answerQuestion: (questionId, answerId) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: answerId } })),

  goToNextQuestion: () => {
    const lastIndex = (get().definition?.questions.length ?? 1) - 1;
    set((state) => ({ currentIndex: Math.min(state.currentIndex + 1, lastIndex) }));
  },

  goToPreviousQuestion: () => set((state) => ({ currentIndex: Math.max(state.currentIndex - 1, 0) })),

  freezeSubmission: (payload) => set({ clientSubmissionId: payload.clientSubmissionId, frozenPayload: payload }),

  resetSurvey: () =>
    set({ definition: null, currentIndex: 0, answers: {}, clientSubmissionId: null, frozenPayload: null }),
}));
