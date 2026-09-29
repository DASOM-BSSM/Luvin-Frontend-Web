import { useMutation } from '@tanstack/react-query';

import { updateMyProfile } from '@/src/features/user/api/profile';
import { userKeys } from '@/src/features/user/api/query-keys';
import queryClient from '@/src/lib/query-client';

/** 마이페이지 "내 정보 저장하기"가 쓸 훅. 성공하면 프로필 쿼리를 다시 받아온다. */
export default function useUpdateProfile() {
  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me });
    },
  });
}
