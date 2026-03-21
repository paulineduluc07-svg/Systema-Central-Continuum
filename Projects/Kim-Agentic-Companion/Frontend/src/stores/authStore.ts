import { atom } from "jotai";

export const tokenAtom = atom<string | null>(null);
export const sessionIdAtom = atom<string | null>(null);
export const userIdAtom = atom<string>("user_init");
export const isAuthenticatedAtom = atom((get) => get(tokenAtom) !== null);