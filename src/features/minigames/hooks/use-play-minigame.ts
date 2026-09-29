import { useMutation } from '@tanstack/react-query';

import { playMinigame } from '@/src/features/minigames/api/minigames';
import type { MinigameOutcome } from '@/src/features/minigames/types';

interface PlayMinigameInput {
  gameId: number;
  outcome: MinigameOutcome;
}

export default function usePlayMinigame() {
  return useMutation({
    mutationFn: ({ gameId, outcome }: PlayMinigameInput) => playMinigame(gameId, outcome),
  });
}
