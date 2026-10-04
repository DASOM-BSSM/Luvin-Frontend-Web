import httpClient from '@/src/lib/http-client';

import type { UpdateUserProfileInput, UserProfile } from '@/src/features/user/types';

/** `GET /api/users/me`. */
export async function getMyProfile(): Promise<UserProfile> {
  const { data } = await httpClient.get<UserProfile>('/api/users/me');
  return data;
}

/** `PUT /api/users/me`. */
export async function updateMyProfile(input: UpdateUserProfileInput): Promise<void> {
  await httpClient.put('/api/users/me', input);
}

/** `DELETE /api/users/me`. 서버에서 이 계정과 계정에 딸린 데이터를 지운다(계정 탈퇴). */
export async function deleteMyAccount(): Promise<void> {
  await httpClient.delete('/api/users/me');
}
