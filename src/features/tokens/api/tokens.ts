import httpClient from '@/src/lib/http-client';

import type { TokenBalance } from '@/src/features/tokens/types';

/** `GET /api/tokens/me`. */
export async function getMyTokenBalance(): Promise<TokenBalance> {
  const { data } = await httpClient.get<TokenBalance>('/api/tokens/me');
  return data;
}
