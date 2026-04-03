"use client";

import { useState } from "react";
import { OUTFIT_CATALOG } from "@/lib/customization/catalog";
import { WARDROBE_SLOTS } from "@/lib/customization/wardrobeSlots";
import { useWardrobeStore } from "@/stores/wardrobeStore";

interface WardrobePanelProps {
  open: boolean;
  onClose: () => void;
}

export function WardrobePanel({ open, onClose }: WardrobePanelProps) {
  const [activeSlot, setActiveSlot] = useState<string>("full");
  const { selectedOutfitId, setOutfit } = useWardrobeStore();

  const items = OUTFIT_CATALOG.filter((i) => i.slot === activeSlot);

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-72 bg-black/85 backdrop-blur-xl border-l border-white/10 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-white font-semibold text-sm tracking-widest uppercase">
          Wardrobe
        </span>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Slot tabs */}
      <div className="flex flex-wrap gap-1.5 p-3 border-b border-white/10">
        {WARDROBE_SLOTS.map((slot) => (
          <button
            key={slot.id}
            onClick={() => setActiveSlot(slot.id)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
              activeSlot === slot.id
                ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {slot.icon} {slot.label}
          </button>
        ))}
      </div>

      {/* Item grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <span className="text-3xl">✨</span>
            <p className="text-white/30 text-xs text-center">
              More items coming soon
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setOutfit(item.id)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                  selectedOutfitId === item.id
                    ? "border-pink-400 bg-pink-500/20 shadow-md shadow-pink-500/20"
                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <div
                  className="w-11 h-11 rounded-full ring-2 ring-white/10"
                  style={{ backgroundColor: item.thumbnailColor }}
                />
                <span className="text-white/70 text-[10px] text-center leading-tight">
                  {item.label}
                </span>
                {selectedOutfitId === item.id && (
                  <span className="text-pink-400 text-[9px]">✓ Active</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 text-center">
        <p className="text-white/25 text-[10px]">
          New outfits unlock as you bond with Kim
        </p>
      </div>
    </div>
  );
}