"use client";

import clsx from "clsx";
import { useAtomValue } from "jotai";
import { voiceAvailableAtom, isListeningAtom } from "@/stores/voiceStore";

interface VoiceButtonProps {
  onToggle: () => void;
}

export function VoiceButton({ onToggle }: VoiceButtonProps) {
  const available  = useAtomValue(voiceAvailableAtom);
  const isListening = useAtomValue(isListeningAtom);

  if (!available) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      title={isListening ? "Stop listening" : "Start voice input"}
      className={clsx(
        "w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 focus:outline-none",
        "border",
        isListening
          ? "bg-[rgba(255,95,124,0.25)] border-[#ff5f7c] scale-110 shadow-[0_0_12px_rgba(255,95,124,0.4)]"
          : "bg-white/8 border-[rgba(183,194,255,0.22)] hover:bg-white/15"
      )}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isListening ? "#ff5f7c" : "#a8aed3"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    </button>
  );
}
