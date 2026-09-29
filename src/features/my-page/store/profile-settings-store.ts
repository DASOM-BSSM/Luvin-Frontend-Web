import { create } from 'zustand';

import type { Gender } from '@/src/features/my-page/types';
import { getStorageString, setStorageString } from '@/src/lib/storage';

/** 비민감 값이라 MMKV 에 둔다(AGENTS.md §12 표). */
const NICKNAME_KEY = 'my-page.nickname';
const GENDER_KEY = 'my-page.gender';
const DEFAULT_GENDER: Gender = 'male';

function isGender(value: string | undefined): value is Gender {
  return value === 'female' || value === 'male';
}

interface ProfileSettingsStore {
  /** 사용자가 "내 정보 수정"에서 새로 입력한 닉네임. 아직 아무것도 안 넣었으면 빈 문자열. */
  nickname: string;
  gender: Gender;
  setNickname: (nickname: string) => void;
  setGender: (gender: Gender) => void;
}

export const useProfileSettingsStore = create<ProfileSettingsStore>((set) => {
  const storedGender = getStorageString(GENDER_KEY);

  return {
    nickname: getStorageString(NICKNAME_KEY) ?? '',
    gender: isGender(storedGender) ? storedGender : DEFAULT_GENDER,

    setNickname: (nickname) => {
      setStorageString(NICKNAME_KEY, nickname);
      set({ nickname });
    },

    setGender: (gender) => {
      setStorageString(GENDER_KEY, gender);
      set({ gender });
    },
  };
});
