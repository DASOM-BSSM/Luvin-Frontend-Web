import { createMMKV } from 'react-native-mmkv';

/**
 * 비민감 로컬 데이터(온보딩 여부, 설문 임시저장, 토큰 잔액 등) 전용 MMKV 인스턴스.
 *
 * AGENTS.md §12/§15 — 이 파일이 MMKV를 직접 다루는 유일한 모듈이다.
 * 컴포넌트/스토어는 절대 `react-native-mmkv`를 직접 import 하지 말고 아래 함수들을 통해서만 접근할 것.
 * 토큰 등 민감하지 않은 값만 취급하고, 인증 토큰/시크릿은 여기 두지 않는다(§12 표 참고).
 */
const mmkv = createMMKV({ id: 'luvin-storage' });

export function getStorageString(key: string): string | undefined {
  return mmkv.getString(key);
}

export function setStorageString(key: string, value: string): void {
  mmkv.set(key, value);
}

export function getStorageNumber(key: string): number | undefined {
  return mmkv.getNumber(key);
}

export function setStorageNumber(key: string, value: number): void {
  mmkv.set(key, value);
}

export function getStorageBoolean(key: string): boolean | undefined {
  return mmkv.getBoolean(key);
}

export function setStorageBoolean(key: string, value: boolean): void {
  mmkv.set(key, value);
}

/**
 * 객체·배열을 JSON 문자열로 저장한다.
 *
 * MMKV 는 문자열/숫자/불리언만 다루므로 직렬화는 이 래퍼가 맡는다. 값은 화면이 다시 읽을
 * 때 그대로 쓰이므로, 저장하는 쪽이 JSON 으로 표현되는 값만 넣을 것(함수·Date 금지).
 */
export function setStorageJson(key: string, value: unknown): void {
  mmkv.set(key, JSON.stringify(value));
}

/**
 * JSON 으로 저장해 둔 값을 읽는다. 없거나 깨졌으면 undefined.
 *
 * 깨진 값에 앱이 걸려 넘어지지 않도록 파싱 실패를 삼킨다. 저장 형식을 바꿨을 때 예전 값이
 * 남아 있는 경우가 실제로 있어서, 호출부는 undefined 를 늘 감안해야 한다.
 */
export function getStorageJson<T>(key: string): T | undefined {
  const raw = mmkv.getString(key);

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
  mmkv.remove(key);
}
