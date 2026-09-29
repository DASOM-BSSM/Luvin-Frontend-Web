import { useEffect, useState } from 'react';

import type { BreadType } from '@/src/assets/images/BreadCharacter';
import {
  CARDFLIP_LIVES,
  CARDFLIP_MISMATCH_HOLD_MS,
  CARDFLIP_PREVIEW_MS,
} from '@/src/features/inferno/constants/animation';

/** 카드 뒤집기에 쓰는 반죽 8종(전부, 나 포함). Figma 6478:3834 의 카드 16장 = 8종 x 2장. */
const CARD_TYPES: BreadType[] = [
  'salt',
  'castella',
  'madeleine',
  'redbean',
  'baguette',
  'cream',
  'donut',
  'pretzel',
];

export type InfernoCardFlipPhase = 'previewing' | 'playing' | 'success' | 'failure';

export interface InfernoCardState {
  id: number;
  type: BreadType;
  isMatched: boolean;
  isFaceUp: boolean;
}

interface InfernoCardFlipGame {
  phase: InfernoCardFlipPhase;
  cards: InfernoCardState[];
  lives: number;
  /** 두 장을 뒤집어 놓고 맞았는지 확인하는 중(다음 입력을 막는다). */
  isResolving: boolean;
  handleCardPress: (cardId: number) => void;
  /** 결과 쪽지 바깥을 눌렀을 때. 셔플부터 다시 시작한다. */
  handleReset: () => void;
}

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function createDeck(): BreadType[] {
  return shuffle([...CARD_TYPES, ...CARD_TYPES]);
}

/**
 * Episode 03 카드 뒤집기(짝 맞추기).
 *
 * 3초 미리보기 → 전부 뒤집기 → 목숨 4개 안에 8쌍을 전부 맞추면 성공, 목숨이 다 떨어지면
 * 실패. 승패 문구·후속 동작은 야바위(use-inferno-shell-game)와 같아서 성공·실패 판정만
 * 여기서 하고, 그 다음(투표/종료)은 화면(inferno-cardflip-scene)이 결정한다.
 */
export default function useInfernoCardFlipGame(): InfernoCardFlipGame {
  const [deck, setDeck] = useState(createDeck);
  const [phase, setPhase] = useState<InfernoCardFlipPhase>('previewing');
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [lives, setLives] = useState(CARDFLIP_LIVES);

  useEffect(() => {
    if (phase !== 'previewing') return;

    const timer = setTimeout(() => setPhase('playing'), CARDFLIP_PREVIEW_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  // 서로 다른 짝을 골랐을 때. 잠깐 보여준 뒤 다시 덮고 목숨을 깎는다.
  useEffect(() => {
    if (flippedIds.length < 2) return;

    const [firstId, secondId] = flippedIds;
    if (deck[firstId] === deck[secondId]) {
      setMatchedIds((ids) => [...ids, firstId, secondId]);
      setFlippedIds([]);
      return;
    }

    const timer = setTimeout(() => {
      setFlippedIds([]);
      setLives((count) => count - 1);
    }, CARDFLIP_MISMATCH_HOLD_MS);

    return () => clearTimeout(timer);
  }, [flippedIds, deck]);

  useEffect(() => {
    if (phase === 'playing' && matchedIds.length === deck.length) setPhase('success');
  }, [matchedIds, deck.length, phase]);

  useEffect(() => {
    if (phase === 'playing' && lives <= 0) setPhase('failure');
  }, [lives, phase]);

  function handleCardPress(cardId: number) {
    if (phase !== 'playing') return;
    if (flippedIds.length >= 2) return;
    if (flippedIds.includes(cardId) || matchedIds.includes(cardId)) return;

    setFlippedIds((ids) => [...ids, cardId]);
  }

  function handleReset() {
    setDeck(createDeck());
    setPhase('previewing');
    setMatchedIds([]);
    setFlippedIds([]);
    setLives(CARDFLIP_LIVES);
  }

  const cards: InfernoCardState[] = deck.map((type, id) => ({
    id,
    type,
    isMatched: matchedIds.includes(id),
    isFaceUp: phase === 'previewing' || matchedIds.includes(id) || flippedIds.includes(id),
  }));

  return {
    phase,
    cards,
    lives,
    isResolving: flippedIds.length >= 2,
    handleCardPress,
    handleReset,
  };
}
