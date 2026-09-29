/**
 * `src/lib/storage.ts` 의 웹 버전. Metro 가 웹 번들에서는 이 파일을 대신 고른다(AGENTS.md §1).
 *
 * MMKV 대신 브라우저 `localStorage` 를 쓰고, 함수 이름·시그니처는 네이티브 버전과 똑같이 맞춘다 —
 * 스토어들이 import 경로 하나 안 바꾸고 그대로 쓰게 하기 위함.
 *
 * react-native-mmkv v4 에도 웹 구현이 있지만, 서버(Node)에서 호출되면
 * "Tried to access storage on the server" 를 던진다. `web.output: "static"` 은 빌드할 때 각 페이지를
 * Node 에서 미리 렌더링하고, 스토어들은 모듈 로드 시점에 이 함수들을 부르므로(초기값 읽기) 그 경로가
 * 언제든 빌드를 깨뜨릴 수 있다. 여기서는 서버에서는 "값 없음"/무시로 조용히 넘어간다.
 *
 * 비민감 값 전용이다. 토큰은 여기 두지 않는다(§12 — `token-storage.web.ts` 가 따로 다룬다).
 */
const KEY_PREFIX = 'luvin-storage:';

/**
 * 서버 렌더링 중이거나(`window` 없음) 브라우저가 저장소 접근을 막은 경우(사파리 개인정보 보호 모드,
 * 쿠키 차단 등 — 접근만 해도 throw 한다) undefined 를 돌려준다.
 */
function getLocalStorage(): Storage | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function readRaw(key: string): string | undefined {
  return getLocalStorage()?.getItem(KEY_PREFIX + key) ?? undefined;
}

function writeRaw(key: string, value: string): void {
  try {
    getLocalStorage()?.setItem(KEY_PREFIX + key, value);
  } catch {
    // 용량 초과(QuotaExceededError) 등 — 비민감 캐시라 저장을 못 해도 앱은 계속 동작해야 한다.
  }
}

export function getStorageString(key: string): string | undefined {
  return readRaw(key);
}

export function setStorageString(key: string, value: string): void {
  writeRaw(key, value);
}

/** localStorage 는 문자열만 저장하므로 숫자로 되돌릴 수 없는 값은 없는 것으로 본다. */
export function getStorageNumber(key: string): number | undefined {
  const raw = readRaw(key);

  if (raw === undefined) {
    return undefined;
  }

  const value = Number(raw);
  return Number.isNaN(value) ? undefined : value;
}

export function setStorageNumber(key: string, value: number): void {
  writeRaw(key, String(value));
}

export function getStorageBoolean(key: string): boolean | undefined {
  const raw = readRaw(key);

  if (raw === undefined) {
    return undefined;
  }

  return raw === 'true';
}

export function setStorageBoolean(key: string, value: boolean): void {
  writeRaw(key, String(value));
}

/** 네이티브 버전과 같다 — JSON 으로 표현되는 값만 넣을 것(함수·Date 금지). */
export function setStorageJson(key: string, value: unknown): void {
  writeRaw(key, JSON.stringify(value));
}

/** 없거나 깨졌으면 undefined — 네이티브 버전과 같은 이유로 파싱 실패를 삼킨다. */
export function getStorageJson<T>(key: string): T | undefined {
  const raw = readRaw(key);

  if (raw === undefined) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export function removeStorageItem(key: string): void {
  try {
    getLocalStorage()?.removeItem(KEY_PREFIX + key);
  } catch {
    // 저장소 접근이 막힌 환경 — 지울 것도 없다.
  }
}
