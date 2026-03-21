import { atom } from "jotai";

export const isListeningAtom = atom(false);
export const isSpeakingAtom  = atom(false);
export const ttsEnabledAtom  = atom(false);  // user preference: auto-speak Kim replies
export const voiceAvailableAtom = atom(false); // true if SpeechRecognition is supported
