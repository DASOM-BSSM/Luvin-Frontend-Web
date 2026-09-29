import { create } from 'zustand';

import { getStorageJson, setStorageJson } from '@/src/lib/storage';

/** 비민감 값이라 MMKV 에 둔다(§12 표). */
const COMPLETED_ORDERS_KEY = 'inferno.completedOrders';

/** 회차 → "잠시 나가기" 로 나갈 때 보던 단계. 아직 나간 적 없는 회차는 없다. */
type InfernoCheckpoints = Record<number, number | undefined>;

/**
 * 러빈지옥 진행 상태.
 *
 * 원래는 서버가 들고 있어야 할 값이라 메모리에만 뒀었는데, API 가 붙기 전까지 앱을 껐다
 * 켤 때마다 ep0 부터 다시 봐야 해서 확인이 너무 번거로웠다. 비민감 값이므로 MMKV 로
 * 옮긴다(토큰 잔액과 같은 방식). API 가 생기면 이 저장은 서버 상태로 대체될 자리다.
 *
 * 다만 회차 안의 이어보기 지점(checkpoints)은 MMKV 에 쓰지 않고 메모리에만 둔다. DB 설계가
 * 아직이라 저장 형식을 굳히지 않으려는 것이고, 지금 필요한 것도 "나갔다 곧 다시 들어오는"
 * 한 번의 실행 안에서의 이어보기뿐이다. 앱을 껐다 켜면 그 회차는 처음부터다.
 */
interface InfernoStore {
  /** 끝까지 본 에피소드 회차들. */
  completedOrders: number[];
  /**
   * 회차별로 마지막에 보던 단계. 회차 안의 진행을 숫자 하나로 눕힌 값이라 뜻은 회차마다
   * 다르다(ep1 은 대화 쪽 0..n-1 과 투표지 n, ep2 는 전체대화 0 과 1:1 대화 1..n).
   * 그 대응은 각 회차 흐름 훅이 정한다.
   */
  checkpoints: InfernoCheckpoints;
  /** 해당 회차를 끝까지 봤다고 기록한다. 이미 있으면 그대로 둔다. */
  completeEpisode: (order: number) => void;
  /** "잠시 나가기" 로 나갈 때 보던 자리를 기억해 둔다. 다시 들어오면 여기서 이어 본다. */
  saveCheckpoint: (order: number, step: number) => void;
  /** 진행도를 통째로 지정한다. 회차를 하나씩 쌓지 않고 특정 상태로 맞출 때 쓴다. */
  setCompletedOrders: (orders: number[]) => void;
  /** 처음부터 다시 시작한다. */
  resetProgress: () => void;
}

/** 상태와 저장소를 항상 같이 바꾼다. 한쪽만 바꾸면 다음 실행에서 어긋난다. */
function persist(orders: number[]): number[] {
  setStorageJson(COMPLETED_ORDERS_KEY, orders);

  return orders;
}

/** 한 회차의 이어보기 지점을 지운다. 다음에 들어가면 처음부터다. */
function withoutCheckpoint(checkpoints: InfernoCheckpoints, order: number): InfernoCheckpoints {
  const next = { ...checkpoints };
  delete next[order];

  return next;
}

export const useInfernoStore = create<InfernoStore>((set, get) => ({
  completedOrders: getStorageJson<number[]>(COMPLETED_ORDERS_KEY) ?? [],

  checkpoints: {},

  completeEpisode: (order) => {
    // 끝까지 본 회차는 이어볼 자리가 없다. 다시 들어가면 처음부터 본다.
    set({ checkpoints: withoutCheckpoint(get().checkpoints, order) });

    if (get().completedOrders.includes(order)) {
      return;
    }

    set({ completedOrders: persist([...get().completedOrders, order]) });
  },

  saveCheckpoint: (order, step) =>
    set({ checkpoints: { ...get().checkpoints, [order]: step } }),

  setCompletedOrders: (orders) => set({ completedOrders: persist([...orders]), checkpoints: {} }),

  resetProgress: () => set({ completedOrders: persist([]), checkpoints: {} }),
}));
