import { useMutation } from '@tanstack/react-query';

import { likeMessage } from '@/src/features/inferno/api/likes';
import { likeKeys } from '@/src/features/inferno/api/query-keys';
import queryClient from '@/src/lib/query-client';

interface LikeMessageInput {
  matchId: number;
  messageId: number;
}

/** 좋아요는 취소(unlike) API가 없다 — 누르면 그걸로 끝, 다시 안 눌리게 화면이 막아야 한다. */
export default function useLikeMessage() {
  return useMutation({
    mutationFn: ({ matchId, messageId }: LikeMessageInput) => likeMessage(matchId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: likeKeys.likedMessages });
    },
  });
}
