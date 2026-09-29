/**
 * 러빈지옥 인트로 등장 연출 타이밍(ms).
 *
 * 타이틀이 다 드러난 뒤에 에피소드 바가 따라 나오도록 순서를 잡았다.
 */

/** 타이틀이 왼쪽에서 오른쪽으로 전부 드러나는 데 걸리는 시간. */
export const TITLE_REVEAL_MS = 2100;

/** 타이틀이 끝나고 에피소드 바가 나타나기 시작할 때까지의 간격. */
export const EPISODE_BAR_DELAY_MS = TITLE_REVEAL_MS + 300;

/** 에피소드 바가 떠오르는 시간. */
export const EPISODE_BAR_FADE_MS = 675;

// --- 지글거림(boil) ---

/**
 * 지글거림 한 프레임이 유지되는 시간. 143ms = 약 7fps.
 *
 * 이 값이 이 연출의 핵심이다. 부드럽게 보간하면 둥둥 떠다니는 느낌이 되고,
 * 이렇게 뚝뚝 끊어서 바꿔야 손으로 매 프레임 다시 그린 것처럼 지글거려 보인다.
 */
export const BOIL_FRAME_MS = 143;

/**
 * 지글거림 강도. 아래 BOIL_FRAMES 의 값에 곱해진다.
 *
 * 1 이 기준이고 작을수록 얌전해진다. 세기를 조절할 때는 프레임 값을 건드리지 말고
 * 이 숫자만 바꿀 것.
 */
export const BOIL_INTENSITY = 0.75;

/** 지글거림 한 프레임의 변형값(강도 1 기준). */
export interface BoilFrame {
  x: number;
  y: number;
  /** 도(deg) */
  rotate: number;
  scale: number;
}

/**
 * 지글거림이 순환하는 프레임들. 실제 적용값은 여기에 BOIL_INTENSITY 가 곱해진 것이다.
 *
 * 값이 크면 흔들리는 것으로 보여서 아주 작게 잡았다(이동 1.5px, 회전 0.4도, 크기 0.3% 이내).
 * 8개를 쓰는 건 주기가 눈에 띄지 않게 하기 위해서고, 이웃한 프레임끼리 방향이 확 달라야
 * 지글거리는 맛이 산다. 랜덤 대신 고정값을 쓰는 이유는 눈으로 보고 다듬기 위해서다.
 */
export const BOIL_FRAMES: readonly BoilFrame[] = [
  { x: 0, y: 0, rotate: 0, scale: 1 },
  { x: -1.2, y: 0.8, rotate: 0.35, scale: 1.003 },
  { x: 1.0, y: -0.6, rotate: -0.3, scale: 0.998 },
  { x: -0.6, y: -1.0, rotate: 0.2, scale: 1.002 },
  { x: 1.4, y: 0.5, rotate: -0.4, scale: 0.997 },
  { x: -1.0, y: 0.2, rotate: 0.3, scale: 1.001 },
  { x: 0.6, y: 1.0, rotate: -0.2, scale: 1.003 },
  { x: -1.4, y: -0.4, rotate: 0.4, scale: 0.999 },
];

// --- 단계 카드 등장 ---

/** 본문이 다 쳐졌다는 신호를 받고 첫 카드가 나오기까지의 간격. */
export const STEP_CARD_START_GAP_MS = 250;

/** 카드끼리의 시간 차. 위에서부터 차례로 나오게 한다. */
export const STEP_CARD_STAGGER_MS = 210;

/** 카드 하나가 떠오르는 시간. */
export const STEP_CARD_FADE_MS = 620;

/** 떠오를 때 아래에서 올라오는 거리(px). */
export const STEP_CARD_RISE = 10;

// --- 안내 항목 등장 ---

/** 안내 두 개가 왼쪽부터 차례로 뜨는 시간 차. */
export const GUIDE_ITEM_STAGGER_MS = 260;

/** 안내 하나가 떠오르는 시간. */
export const GUIDE_ITEM_FADE_MS = 620;

/** 떠오를 때 아래에서 올라오는 거리(px). */
export const GUIDE_ITEM_RISE = 12;

// --- 대화 끝 투표 안내 ---

/**
 * 마지막 줄이 다 쳐지고 투표 모달이 뜨기까지의 간격.
 *
 * 곧바로 띄우면 "대화가 종료되었습니다" 안내를 읽기도 전에 모달이 덮는다.
 */
export const VOTE_MODAL_DELAY_MS = 800;

/** 마지막 대화가 끝난 뒤 미니게임 안내를 띄우기까지의 간격. */
export const GAME_MODAL_DELAY_MS = 800;

// --- Episode 03 야바위 ---

/** 처음 화면을 읽을 시간을 준 뒤 정답 컵을 들어 올린다. */
export const SHELL_REVEAL_DELAY_MS = 1000;

/** 컵 하나를 들거나 내리는 시간. */
export const SHELL_LIFT_MS = 320;

/** 프레첼을 보여 주는 시간. */
export const SHELL_REVEAL_HOLD_MS = 1400;

/** 컵 한 쌍이 자리를 바꾸는 시간. */
export const SHELL_SWAP_MS = 420;

/** 컵을 섞는 횟수. */
export const SHELL_SWAP_COUNT = 5;

/** 컵을 들어 프레첼이 보이게 하는 거리. */
export const SHELL_LIFT_DISTANCE = 52;

// --- Episode 03 카드 뒤집기 ---

/** 시작할 때 16장을 전부 보여주는 시간. */
export const CARDFLIP_PREVIEW_MS = 6000;

/** 짝이 틀렸을 때 다시 덮기 전까지 보여주는 시간. */
export const CARDFLIP_MISMATCH_HOLD_MS = 700;

/** 목숨 개수. Figma `Frame 107`(6219:4039) 이 하트 4개다. */
export const CARDFLIP_LIVES = 4;
