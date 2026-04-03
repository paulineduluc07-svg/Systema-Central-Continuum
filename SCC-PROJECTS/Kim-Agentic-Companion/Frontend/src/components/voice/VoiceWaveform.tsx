"use client";

import { useAtomValue } from "jotai";
import { isListeningAtom, isSpeakingAtom } from "@/stores/voiceStore";

export function VoiceWaveform() {
  const isListening = useAtomValue(isListeningAtom);
  const isSpeaking  = useAtomValue(isSpeakingAtom);
  const active = isListening || isSpeaking;
  const color  = isSpeaking ? "#68fff0" : "#ff5f7c";

  if (!active) return null;

  return (
    <div className="flex items-center gap-[3px] h-5 px-1" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full"
          style={{
            background: color,
            height: "100%",
            transformOrigin: "center",
            animation: "voice-bar 0.8s ease-in-out infinite",
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}
