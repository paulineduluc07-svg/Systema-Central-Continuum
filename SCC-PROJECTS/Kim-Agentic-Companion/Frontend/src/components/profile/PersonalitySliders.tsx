"use client";

import { useProfile } from "@/hooks/useProfile";
import type { PersonalityConfig } from "@/stores/profileStore";

interface Trait {
  key: keyof PersonalityConfig;
  label: string;
  color: string;
}

interface PersonalitySlidersProps {
  traits: Trait[];
  personality: PersonalityConfig;
}

export function PersonalitySliders({ traits, personality }: PersonalitySlidersProps) {
  const { updatePersonality } = useProfile();

  return (
    <div className="flex flex-col gap-5">
      {traits.map(({ key, label, color }) => (
        <div key={key}>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-[#f4f3ff]">{label}</span>
            <span className="text-xs text-[#a8aed3] tabular-nums">{personality[key]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={personality[key]}
            onChange={(e) => updatePersonality({ [key]: Number(e.target.value) })}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${color} 0%, ${color} ${personality[key]}%, rgba(183,194,255,0.15) ${personality[key]}%, rgba(183,194,255,0.15) 100%)`,
              accentColor: color,
            }}
          />
        </div>
      ))}
    </div>
  );
}
