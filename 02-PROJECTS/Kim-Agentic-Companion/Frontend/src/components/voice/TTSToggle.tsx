"use client";

import clsx from "clsx";
import { useAtom } from "jotai";
import { ttsEnabledAtom } from "@/stores/voiceStore";

export function TTSToggle() {
  const [ttsEnabled, setTtsEnabled] = useAtom(ttsEnabledAtom);

  return (
    <button
      type="button"
      onClick={() => setTtsEnabled((v) => !v)}
      title={ttsEnabled ? "Mute Kim (TTS off)" : "Hear Kim (TTS on)"}
      className={clsx(
        "w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 focus:outline-none",
        "border",
        ttsEnabled
          ? "bg-[rgba(104,255,240,0.2)] border-[#68fff0] shadow-[0_0_10px_rgba(104,255,240,0.3)]"
          : "bg-white/8 border-[rgba(183,194,255,0.22)] hover:bg-white/15"
      )}
    >
      {ttsEnabled ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#68fff0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8aed3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
