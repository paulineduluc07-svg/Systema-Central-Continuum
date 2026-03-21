"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { PersonalitySliders } from "./PersonalitySliders";
import { useProfile } from "@/hooks/useProfile";
import { config } from "@/lib/config";

const TRAITS = [
  { key: "warmth" as const,     label: "Warmth",     color: "#ff5f7c" },
  { key: "creativity" as const, label: "Creativity", color: "#b48aff" },
  { key: "humor" as const,      label: "Humor",      color: "#ffcc66" },
  { key: "curiosity" as const,  label: "Curiosity",  color: "#68fff0" },
  { key: "empathy" as const,    label: "Empathy",    color: "#ff9f74" },
];

export function ProfilePanel() {
  const { personality, resetPersonality } = useProfile();

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
      <GlassPanel className="p-5">
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-full shrink-0"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #ffb4cd 0 18%, rgba(255,180,205,0) 60%), " +
                "radial-gradient(#c8b0ff 0, #9b8bf4 100%)",
              border: "1px solid rgba(255,187,219,0.35)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          />
          <div>
            <h2 className="text-[#f4f3ff] font-semibold text-lg">{config.appName}</h2>
            <p className="text-xs text-[#a8aed3]">AI Companion</p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-medium text-[#a8aed3] uppercase tracking-wide">Personality</h3>
          <Button variant="ghost" size="sm" onClick={resetPersonality}>Reset</Button>
        </div>
        <PersonalitySliders traits={TRAITS} personality={personality} />
        <p className="text-xs text-[#a8aed3] mt-5 leading-relaxed">
          These sliders shape how Kim responds to you. Changes apply to your next conversation.
        </p>
      </GlassPanel>
    </div>
  );
}
