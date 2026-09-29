import { create } from 'zustand';

import { getStorageNumber, setStorageNumber } from '@/src/lib/storage';

/** 미니게임 보상 토큰(🥐) 잔액. 비민감 데이터라 MMKV에 영속(AGENTS.md §12 표). */
const TOKEN_BALANCE_KEY = 'luvin-hell.tokenBalance';

interface TokenStore {
  balance: number;
  addTokens: (amount: number) => void;
  /** 잔액을 그대로 지정한다. 더하기가 아니라 특정 값으로 맞춰야 할 때 쓴다. */
  setBalance: (balance: number) => void;
}

export const useTokenStore = create<TokenStore>((set, get) => ({
  balance: getStorageNumber(TOKEN_BALANCE_KEY) ?? 0,
  addTokens: (amount) => {
    const next = get().balance + amount;
    setStorageNumber(TOKEN_BALANCE_KEY, next);
    set({ balance: next });
  },

  setBalance: (balance) => {
    setStorageNumber(TOKEN_BALANCE_KEY, balance);
    set({ balance });
  },
}));
