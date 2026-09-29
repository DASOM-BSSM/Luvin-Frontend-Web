import { create } from 'zustand';

import type { BreadProfile } from '@/src/features/home/types';

/**
 * 내 분신(반죽) — 서버 설문 결과가 원천이다.
 *
 * FRONTEND_CHANGES.md §8: 이 스토어를 서버 결과의 "브릿지"로만 쓴다 — MMKV에 영속하지
 * 않는다(계정이 달라도 같은 키로 남아있던 예전 방식 금지). 메모리에만 두고, 로그아웃/401
 * 에서 `clear()`로 지운다(use-logout.ts, http-client.ts 참고) — 이 앱은 로그아웃을 거치지
 * 않고 계정을 바꾸는 경로가 없어서, 그 두 지점만 지키면 다른 사용자의 반죽이 새지 않는다.
 *
 * `useBreadProfile`(src/features/bread/hooks) 이 서버 결과를 여기 동기화하는 진짜 진입점이고,
 * ep1~4 등 기존 소비자는 이 스토어를 그대로 읽으면 된다.
 */
interface BreadStore {
  /** 아직 결과가 없으면 null. */
  profile: BreadProfile | null;
  setProfile: (profile: BreadProfile | null) => void;
  clear: () => void;
}

export const useBreadStore = create<BreadStore>((set) => ({
  profile: null,

  setProfile: (profile) => set({ profile }),

  clear: () => set({ profile: null }),
}));
