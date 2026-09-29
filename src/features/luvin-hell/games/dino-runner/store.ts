import { createRunStore } from '@/src/features/luvin-hell/engine/store/createRunStore';

/** 공룡빵게임 전용 run 스토어. 빵건너친구들과 인스턴스를 공유하지 않는다. */
export const useDinoRunStore = createRunStore();
