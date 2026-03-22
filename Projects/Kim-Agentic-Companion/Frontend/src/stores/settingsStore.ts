import { atom } from "jotai";

export type ThemeMode = "rose" | "aqua" | "sunset";

export const themeModeAtom = atom<ThemeMode>("rose");
