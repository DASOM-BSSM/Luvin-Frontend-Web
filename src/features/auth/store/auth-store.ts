import { create } from 'zustand';

import type { AuthUser } from '@/src/features/auth/types';

/**
 * 로그인 상태. 메모리에만 둔다(§12) — accessToken 자체는 token-storage.ts(SecureStore)가 든다.
 *
 * 앱을 다시 켰을 때 SecureStore 에 토큰이 남아 있으면 `_layout.tsx` 가 부팅 시 한 번
 * `hydrate` 로 이 스토어를 채운다. 토큰이 실제로 유효한지는 검증하지 않고, 만료됐다면
 * 다음 요청에서 401 → http-client 인터셉터가 정리한다.
 */
interface AuthStore {
  isAuthenticated: boolean;
  /** 아직 hydrate 가 끝나지 않았으면 true. 이 동안은 로그인 여부로 화면을 리다이렉트하지 않는다. */
  isHydrating: boolean;
  user: AuthUser | null;
  setSession: (user: AuthUser) => void;
  clearSession: () => void;
  finishHydrating: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  isHydrating: true,
  user: null,

  setSession: (user) => set({ isAuthenticated: true, user }),

  clearSession: () => set({ isAuthenticated: false, user: null }),

  finishHydrating: () => set({ isHydrating: false }),
}));
