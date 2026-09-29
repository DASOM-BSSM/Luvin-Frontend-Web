import type { MissionRange } from '@/src/features/luvin-hell/types';

/** 미션 목표치(생존 기록) 랜덤 범위. */
export const MISSION_RANGE: MissionRange = [60, 120];

// 씬 좌표계 (GameFrame 내부, px). GameFrame 크기(340x555)에 맞춘 값.
export const FRAME_WIDTH = 340;
export const FRAME_HEIGHT = 555;
export const GROUND_Y = 450;

export const PLAYER_X = 40;
export const PLAYER_WIDTH = 60;
export const PLAYER_HEIGHT = 90;
export const PLAYER_STAND_Y = GROUND_Y - PLAYER_HEIGHT;

/** px/s^2. 위 = 음수 방향. */
export const GRAVITY = 2600;
/** px/s. 점프 시작 속도(음수 = 위로). */
export const JUMP_VELOCITY = -820;

/** 숙일 때 캐릭터 히트박스 높이 축소 비율. */
export const DUCK_HEIGHT_RATIO = 0.55;
export const DUCK_SPRING_CONFIG = { damping: 16, stiffness: 200 };

export const OBSTACLE_WIDTH = 42;
export const GROUND_OBSTACLE_HEIGHT = 42;
export const AIR_OBSTACLE_HEIGHT = 42;
/** 공중 장애물 y좌표 — 숙이지 않으면 맞고, 숙이면 피할 수 있는 높이. */
export const AIR_OBSTACLE_Y = PLAYER_STAND_Y - 6;

/** px/s. 시간 지날수록 SPEED_RAMP_PX_PER_SEC2 만큼씩 가속, MAX_SPEED에서 캡. */
export const BASE_SPEED = 220;
export const MAX_SPEED = 520;
export const SPEED_RAMP_PX_PER_SEC2 = 6;

/** 스폰 간격(ms). 시간이 지날수록 BASE→MIN 로 좁아진다. */
export const BASE_SPAWN_GAP_MS = 1400;
export const MIN_SPAWN_GAP_MS = 650;
export const SPAWN_GAP_VARIANCE_MS = 400;
export const DIFFICULTY_RAMP_DURATION_MS = 45_000;
/** 장애물을 발견하고 반응(탭/드래그)하기에 필요한 최소 시간. 스폰 간격의 하한을 보장하는 데 쓴다. */
export const REACTION_WINDOW_MS = 550;

/** 동시에 화면에 존재할 수 있는 장애물 슬롯 수. */
export const POOL_SIZE = 10;

/**
 * 충돌판정 히트박스를 렌더 박스 대비 축소하는 비율(중심 기준). 스프라이트 PNG의 투명 여백 +
 * `contentFit="contain"` 레터박싱 때문에 렌더 박스 그대로 쓰면 시각적으로 안 닿았는데도
 * 충돌 처리되는 오판정이 난다 — 실측(플레이어 60x90 박스에 아바타 PNG 300x664, 장애물
 * 42x42 박스에 반죽 PNG 대부분 1.2~1.6 가로세로비) 결과 실제 그려지는 영역이 박스의
 * 70~85% 수준이라 판정 영역만 이 비율로 줄인다.
 */
export const PLAYER_HITBOX_SCALE = 0.75;
export const OBSTACLE_HITBOX_SCALE = 0.75;

/** 공중 장애물은 기록(점수)이 이 값 이상일 때부터 스폰 후보에 포함된다. */
export const AIR_OBSTACLE_MIN_SCORE = 50;

/**
 * 점수 = 생존 거리(px) / SCORE_UNIT_PX.
 * BASE_SPEED(220px/s) 기준으로 미션 최저치(60)까지 약 25초, MAX_SPEED 근방에서 최고치(120)까지
 * 약 40~50초 정도 걸리도록 잡은 값 — 캐주얼 모바일 세션 길이에 맞춘 밸런싱 상수.
 */
export const SCORE_UNIT_PX = 120;

/** 숙이기 판정 제스처 임계값(px). */
export const DUCK_TRIGGER_OFFSET = 12;
export const DUCK_HORIZONTAL_TOLERANCE = 24;
