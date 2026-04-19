import { atom } from "jotai";

export interface DiaryEntry {
  id: string;
  content: string;
  timestamp: string;
  kimResponse?: string;
}

export const diaryEntriesAtom = atom<DiaryEntry[]>([]);
export const diaryLoadingAtom = atom(false);