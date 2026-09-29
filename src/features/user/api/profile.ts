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
