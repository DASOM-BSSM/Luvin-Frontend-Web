import { createRunStore } from '@/src/features/luvin-hell/engine/store/createRunStore';

/** 빵건너친구들 전용 run 스토어. 공룡빵게임과 인스턴스를 공유하지 않는다. */
export const useBreadCrossingRunStore = createRunStore();
