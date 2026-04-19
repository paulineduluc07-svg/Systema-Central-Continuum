import { atom } from "jotai";

export interface PersonalityConfig {
  warmth: number;
  creativity: number;
  humor: number;
  curiosity: number;
  empathy: number;
}

export const DEFAULT_PERSONALITY: PersonalityConfig = {
  warmth: 75,
  creativity: 60,
  humor: 50,
  curiosity: 70,
  empathy: 80,
};

export const personalityAtom = atom<PersonalityConfig>(DEFAULT_PERSONALITY);