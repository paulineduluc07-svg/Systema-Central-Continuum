"use client";

import { useAtomValue } from "jotai";
import { isTypingAtom } from "@/stores/chatStore";
import { config } from "@/lib/config";

export function AvatarStage() {
  const isTyping = useAtomValue(isTypingAtom);
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div
        className="relative w-32 h-32 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 24%, rgba(250,245,255,0.9) 0 6%, rgba(250,245,255,0) 35%), " +
            "radial-gradient(circle at 40% 35%, #ffb4cd 0 18%, rgba(255,180,205,0) 60%), " +
            "radial-gradient(circle at 65% 65%, #6ed8ff 0 20%, rgba(110,216,255,0) 64%), " +
            "radial-gradient(#c8b0ff 0, #9b8bf4 100%)",
          boxShadow: "0 34px 80px rgba(0,0,0,0.55), inset 0 0 40px rgba(255,255,255,0.12)",
          animation: isTyping ? "none" : "orb-pulse 4s ease-in-out infinite",
          border: "1px solid rgba(255,187,219,0.35)",
        }}
      >
        <img
          src="/assets/kim-avatar.png"
          alt={`${config.appName} avatar`}
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      <div className="text-center">
        <p className="text-[#f4f3ff] text-sm font-semibold">{config.appName}</p>
        <p className="text-xs text-[#a8aed3]">{isTyping ? "thinking…" : "● online"}</p>
      </div>
    </div>
  );
}