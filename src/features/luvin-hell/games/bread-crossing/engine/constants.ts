import type { MissionRange } from '@/src/features/luvin-hell/types';

/** 미션 목표치(최고 도달 레인) 랜덤 범위. */
export const MISSION_RANGE: MissionRange = [30, 70];

/** 좌우 칸 수. 시작 칸은 정중앙. */
export const COLUMN_COUNT = 5;
export const START_COLUMN = 2;
/** 시작 레인. 후퇴는 이보다 더 뒤로 갈 수 없다. */
export const START_LANE = 0;
/** 플레이어보다 이만큼 앞선 레인까지 항상 미리 생성해둔다. */
export const LOOKAHEAD_LANES = 12;

/** 지형별 세그먼트(연속 구간) 길이 범위 — [min, max] 양끝 포함. */
export const GRASS_LENGTH_RANGE: [number, number] = [1, 2];
export const ROAD_LENGTH_RANGE: [number, number] = [1, 4];
export const RAIL_LENGTH_RANGE: [number, number] = [1, 2];
export const RIVER_LENGTH_RANGE: [number, number] = [2, 4];

/**
 * 초원끼리 연속 허용 여부. 유저 스펙은 "위험지형 2연속 시 강제 초원 삽입"만 명시하고
 * 초원끼리 연속 가능 여부는 불명확했음 — 기본값은 금지(전체 규칙을 예외 없이 적용, 난이도
 * 예측 가능성 유지). 값만 바꾸면 바로 뒤집힌다.
 */
export const ALLOW_CONSECUTIVE_GRASS = false;

/** 도로: 차처럼 구르는 빵. 컬럼/초 단위 속도, 장애물 폭/최소 간격(컬럼). */
export const ROAD_SPEED_COLUMNS_PER_SEC = 1.1;
export const ROAD_OBSTACLE_SPAN = 1;
export const ROAD_GAP_COLUMNS = 2;
/**
 * 한 레인 안에서 반복되는 "주기" 하나에 들어가는 장애물 개수. 예전에는 레인 전체가
 * (장애물폭+간격) 딱 하나의 주기를 그대로 반복해서, 모든 장애물이 완전히 동일한 간격으로
 * 대열을 맞춘 것처럼 보였다(사용자 지적: "기차처럼 이동"). 이제 한 주기 안에 여러 대를 넣고
 * 대 사이 간격에 아래 지터를 더해, 주기 자체는 결정론적으로 반복되지만(판정과 렌더링이
 * 항상 일치해야 하므로 완전 무작위는 아님) 화면상으로는 자동차처럼 불규칙하게 보인다.
 */
export const ROAD_OBSTACLES_PER_CYCLE = 3;
/** 장애물 사이 간격 = ROAD_GAP_COLUMNS + [0, 이 값] 랜덤 — 최소 간격은 절대 줄어들지 않는다(난이도 보존). */
export const ROAD_GAP_JITTER_COLUMNS = 2;

/** 기찻길: 건널목 방식 — 안전구간(초) → wave(초, 전 칸 위험) → 다시 안전구간. 도로보다 빠르게 느껴지도록 wave가 짧고 굵다. */
export const RAIL_SAFE_DURATION_SEC = 3.2;
export const RAIL_WAVE_DURATION_SEC = 1.2;

/** 강: 도넛(뗏목) 위에서만 생존. */
export const RIVER_RAFT_SPEED_COLUMNS_PER_SEC = 0.6;
export const RIVER_RAFT_SPAN = 2;
export const RIVER_GAP_COLUMNS = 2;

/**
 * 기찻길 기차(바게트 4개 연결) — Figma 확인: 도로보다 훨씬 빠르게 wave 구간 동안만 화면을
 * 가로질러 지나간다. 판정은 여전히 시간 기반 안전구간/wave(RAIL_SAFE/WAVE_DURATION_SEC)로
 * 하고, 이 기차는 그 wave 구간을 시각적으로 표현하는 전용 오브젝트다 — 도로 오브젝트와
 * 절대 섞이지 않는다(다양화 대상 아님).
 */
export const RAIL_TRAIN_CAR_COUNT = 4;
export const RAIL_TRAIN_CAR_SIZE = 40;
/**
 * 기차 칸 사이 겹침(px) — 스프라이트 내부 여백(투명 패딩)까지 실제로 맞닿아 보이게 하려면
 * 40px 박스 기준 8px보다 훨씬 크게 겹쳐야 한다(사용자 확인: 칸 사이 틈이 보이면 안 됨).
 */
export const RAIL_TRAIN_CAR_OVERLAP = 18;
/** 기차 전체 회전각(유저 스펙 — Figma 정적 목업에는 이 조합 오브젝트가 없어 사용자가 직접 지정한 값). */
export const RAIL_TRAIN_ROTATION_DEG = -43.02;
/**
 * `dough_baguette.png` 자체가 이미 대각선으로 그려진 스프라이트다(투명 여백까지 포함한
 * 정사각형에 가까운 캔버스 안에, 빵이 좌하단→우상단으로 비스듬히 배치됨) — 회전이 0인
 * "가로로 누운" 상태가 아니다. 이 사실을 코드가 아니라 실제 픽셀에서 직접 확인하기 위해
 * PNG의 알파 마스크에 대해 주성분분석(PCA)으로 긴 축의 각도를 구했다(임계값 10/50/128/200
 * 전부 -32.45~-32.47도로 수렴 — 안티에일리어싱 노이즈가 아니라 실제 그려진 각도).
 * 기차를 만들 때 이 내재 각도를 먼저 상쇄(반대로 회전)해서 "진짜 가로로 누운" 상태로 만든
 * 다음에만 `RAIL_TRAIN_ROTATION_DEG`를 곱해야 한다 — 상쇄 없이 그대로 회전시키면 두 각도가
 * 더해져(-32.46 + -43.02 ≈ -75.5도) 기차가 거의 세로로 선 것처럼 보인다(사용자가 반복 지적한
 * 바로 그 버그의 원인).
 */
export const BAGUETTE_INTRINSIC_TILT_DEG = -32.46;

/** 화면에 동시에 마운트해두는 레인 슬롯 수(링버퍼). */
export const POOL_SIZE = 14;
/** 플레이어 기준 몇 레인 뒤까지 화면에 보여줄지. */
export const LANES_BEHIND_PLAYER = 2;

// 렌더 좌표계 (GameFrame 340x555 기준)
export const FRAME_WIDTH = 340;
export const FRAME_HEIGHT = 555;
export const LANE_HEIGHT = 60;
export const COLUMN_WIDTH = FRAME_WIDTH / COLUMN_COUNT;
/** 플레이어가 화면 아래에서 몇 번째 레인 줄에 고정되어 보이는지(카메라가 플레이어를 따라간다). */
export const PLAYER_ROW_FROM_BOTTOM = 2;

/**
 * (재정정) 지난 "밴드는 수평, 대시만 기울어짐" 정정은 잘못된 판단이었다 — 취소. Figma
 * "미니게임2 Playing"(5726:2608)의 실제 코드젠 결과를 다시 확인하면 모든 지형 밴드가
 * 예외 없이 `rotate(13.08deg)`로 감싸져 있다(도로/기찻길/강/초원 전부 동일 각도, 여러
 * 인스턴스에서 반복 확인 — 추측이 아니라 Figma가 직접 내려준 값). 원래 요청대로 레인
 * 전체(밴드)를 이 각도로 통째로 회전시켜 대각선 길처럼 그린다.
 *
 * (구현 메모 — 중요) 레인 하나(60px)씩 "따로" 회전시키면 실기기에서 각도가 거의 안
 * 보인다 — `overflow:hidden`으로 60px 높이만 잘라내면, 그 얇은 창 안에서는 회전된 사각형의
 * 경계가 화면 위/아래로 거의 수직에 가깝게 스쳐 지나가 버려서 눈에 띄는 사선이 안 만들어짐
 * (실측 확인: 인접 레인 경계가 완전히 수평으로 보였다). 그래서 풀에 동시에 마운트된
 * `POOL_SIZE`개 레인 전부를 하나의 큰 직사각형("스택")으로 이어 붙인 다음, 그 스택 하나만
 * 통째로 회전시킨다 — 진짜 하나의 대각선 도로처럼 보이려면 회전은 "스택 전체에 한 번"이어야
 * 한다(개별 레인 반복 X). 장애물/기차/신호기는 이 스택에 포함하지 않고 기존처럼 레인별로
 * (회전 없이) 따로 그린다 — Figma에서도 개별 반죽 오브젝트는 밴드 회전과 무관하게 각자
 * 제멋대로인 각도로 놓여 있다.
 */
export const LANE_ROTATION_DEG = 13.08;
/** road/river 장애물 이동 방향 계산에도 그대로 재사용한다(§ PeriodicRow 참고) — 배경 회전과
 * 다른 각도를 쓰면 장애물이 배경과 따로 노는 것처럼 보인다(사용자 지적). */
export const LANE_ROTATION_RAD = (LANE_ROTATION_DEG * Math.PI) / 180;

/**
 * 회전 축(pivot) — 항상 "플레이어가 서 있는 레인 밴드의 중심이 화면상 있어야 할 지점"
 * 그 자체로 둔다. 이렇게 하면 플레이어의 레인은 자기 자신을 축으로 회전하므로 항상 정확히
 * 제자리에 고정되고, 다른 레인은 이 축에서 `(playerLane - laneIndex) * LANE_HEIGHT`만큼
 * 수직으로 떨어진 지점에 두고 같은 각도로 회전시키기만 하면 된다 — 부호를 실수할 여지가
 * 구조적으로 사라진다.
 *
 * (재수정 — 실기기 버그) 이전 구현은 "풀에 동시에 마운트되는 POOL_SIZE개 레인을 이어 붙인
 * 큰 직사각형 하나"의 좌상단을 역산해서 배치했는데, 그 역산 공식에 부호 오류가 있어 실기기
 * 에서 "앞쪽(진행 방향, laneIndex가 큰 쪽)" 레인이 회전 후 오히려 화면 아래로 이동해버렸다
 * (장애물/신호기 오버레이는 반대로 "앞쪽일수록 위로" 올라가는 좌표계를 쓰기 때문에 서로
 * 어긋났음 — 실측: 진행 방향 레인 대부분이 프레임 아래로 빠져나가 화면 절반 가까이가
 * 배경 없이 하얗게 비어 보였다). 이 파이벗 방식은 그 클래스의 부호 오류 자체를 구조적으로
 * 없앤다.
 */
const PLAYER_ANCHOR_Y = FRAME_HEIGHT - (PLAYER_ROW_FROM_BOTTOM + 1) * LANE_HEIGHT;
export const LANE_STACK_CENTER_X = FRAME_WIDTH / 2;
export const LANE_STACK_CENTER_Y = PLAYER_ANCHOR_Y + LANE_HEIGHT / 2;

/**
 * 회전 전 밴드 폭. 풀 양 끝(파이벗에서 가장 먼 슬롯)까지도 회전 후 프레임을 가로 방향으로
 * 꽉 채우도록, 파이벗에서 가장 먼 슬롯까지의 수직 거리 × sin(회전각)만큼 프레임 폭에 여유를
 * 더해서 모서리에 빈틈이 생기지 않게 한다.
 *
 * (구현 메모) RN `View`의 `overflow:hidden` + 거대한 회전 자식 조합이 안드로이드 실기기에서
 * `GameFrame`의 클리핑을 뚫고 밖으로 새는 버그를 실측으로 확인했다(점수/하트 HUD까지 프레임
 * 밖 위쪽에 렌더링됨) — 그래서 이 배경은 RN View 회전 대신 `react-native-svg`의
 * `<Rect transform="rotate(deg cx cy)">`로 그린다. SVG는 자기 viewBox로 확실히 클리핑되고,
 * 축(cx, cy)이 여러 도형에 공유되기만 하면 "회전 전 하나의 큰 직사각형이었던 것처럼" 자연히
 * 이어 붙는다.
 */
const MAX_SLOTS_FROM_PIVOT = Math.max(LANES_BEHIND_PLAYER, POOL_SIZE - 1 - LANES_BEHIND_PLAYER);
export const LANE_STACK_WIDTH =
  FRAME_WIDTH + 2 * (MAX_SLOTS_FROM_PIVOT * LANE_HEIGHT * Math.sin(LANE_ROTATION_RAD)) + 80;
export const LANE_STACK_LEFT = LANE_STACK_CENTER_X - LANE_STACK_WIDTH / 2;

/**
 * 배경 밴드만 풀 범위(0..POOL_SIZE-1)보다 한 슬롯 더 "뒤"(behind, slot -1)까지 그린다 — 실측
 * 확인: 파이벗이 플레이어 레인에 고정된 채로 스택 전체가 회전하면, 프레임의 좌하단 모서리는
 * `LANES_BEHIND_PLAYER`(2)개 뒤 레인까지만으로는 다 안 덮이고, 그보다 한 칸 더 뒤 레인의
 * 밴드가 있어야 그 삼각형 구석까지 채워진다(안 그러면 그 구석에 흰 배경이 비쳐 보인다 —
 * 스크린샷으로 직접 확인). 게임 판정/윈도우(`POOL_SIZE`, `LANES_BEHIND_PLAYER`)는 전혀
 * 건드리지 않고, 배경 밴드 Rect만 이 한 슬롯만큼 더 그린다(장애물/기차/신호기 오버레이는
 * 여전히 원래 POOL_SIZE 범위만 그린다 — 실제 게임 판정과 무관한 순수 배경 채움 목적).
 */
export const BACKGROUND_EXTRA_BEHIND_SLOTS = 1;

/**
 * 기찻길 신호기(기둥+박스+불빛) 크기. Figma "미니게임2 Playing"(5726:2608) 신호기 자산
 * (Group 11, 6221:4235) 실측 비율 기반. Figma에서 이 신호기는 기찻길 레인이 아니라 그
 * 바로 앞(플레이어 쪽) 초원 레인 위에, 밴드 회전과 반대 방향(`-LANE_ROTATION_DEG`)으로
 * 안쪽 요소를 반대 회전시켜 화면상 똑바로 서 있는 것처럼 보이게 얹혀 있다 — 기찻길 레인마다
 * 반복해서 그리는 게 아니라 기찻길 구간 하나당 정확히 1개다.
 */
export const RAIL_SIGNAL_POLE_WIDTH = 6;
export const RAIL_SIGNAL_POLE_HEIGHT = 27;
export const RAIL_SIGNAL_BOX_WIDTH = 17;
export const RAIL_SIGNAL_BOX_HEIGHT = 11;
export const RAIL_SIGNAL_LIGHT_SIZE = 6;
/** 신호기의 밴드 내 상대 위치(0~1) — Figma 실측(local left/top ÷ 밴드 자체 크기)에서 그대로 가져온 값. */
export const RAIL_SIGNAL_X_FRACTION = 0.363;
export const RAIL_SIGNAL_Y_FRACTION = 0.384;

/**
 * 도로 장애물(빵) 스프라이트 크기. Figma "미니게임2 Playing"(5726:2608)에서 도로 레인의
 * "dough" 인스턴스 실측값(node 5740:3774/5740:3763/5461:3890/5740:3703/6221:4238/6221:4258
 * 등, 회전으로 바운딩박스가 줄어든 것을 제외하면 82~93px 범위) — 이전 40px는 그 절반 이하로
 * 너무 작았다(사용자 지적).
 */
export const OBSTACLE_SPRITE_SIZE = 84;

/**
 * 장애물이 배경과 같은 각도로 대각선 이동(§ `LANE_ROTATION_RAD`)하면서 화면을 가로지르는
 * 동안 생기는 최대 수직 드리프트(FRAME_WIDTH*tanθ)와, 커진 스프라이트 자체의 반높이만큼
 * 레인 오버레이 박스에 위아래 여유를 둬야 위/아래가 잘려 보이지 않는다 — `LaneSlotView`
 * (렌더링 박스 크기)와 `BreadCrossingScene`(화면 밖 컬링 임계값)이 이 값을 공유해야 한쪽만
 * 넉넉하고 다른 쪽은 여전히 60px 기준으로 일찍 잘라버리는 불일치가 생기지 않는다.
 */
export const OBSTACLE_ROW_MARGIN = FRAME_WIDTH * Math.tan(LANE_ROTATION_RAD) + OBSTACLE_SPRITE_SIZE / 2;

/**
 * 강 뗏목(통나무) 크기 — Figma 실측(Frame 117, 5740:3631 안의 두 뗏목 인스턴스,
 * 6221:4044/6221:4073, 각각 약 133.6 x 29.45px). 폭은 `RIVER_RAFT_SPAN`(2칸)만큼의 컬럼
 * 폭과 거의 일치해 폭은 `obstacleColumnSpan * COLUMN_WIDTH`로 계산하고, 높이만 이 상수로
 * 고정한다(29.45 ÷ 60 ≈ 0.49). 이전의 "주황 정사각형 틀 + 빵 아이콘"은 Figma에 없는 완전히
 * 잘못된 모양이었다 — Figma 뗏목엔 빵이 얹혀 있지 않고, 나무색 판 위에 밝은 결(plank seam)
 * 줄무늬만 있다.
 */
export const RAFT_HEIGHT = 29;

/** 스텝 판정용 제스처 임계값(px). */
export const STEP_TRIGGER_DISTANCE = 24;
