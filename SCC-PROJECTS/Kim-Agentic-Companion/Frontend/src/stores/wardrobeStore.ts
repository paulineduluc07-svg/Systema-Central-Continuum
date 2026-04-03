import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_OUTFIT_ID } from "@/lib/customization/catalog";

interface WardrobeState {
  selectedOutfitId: string;
  setOutfit: (id: string) => void;
  slotSelections: Record<string, string | null>;
  setSlotSelection: (slot: string, itemId: string | null) => void;
}

export const useWardrobeStore = create<WardrobeState>()(
  persist(
    (set) => ({
      selectedOutfitId: DEFAULT_OUTFIT_ID,
      setOutfit: (id) => set({ selectedOutfitId: id }),
      slotSelections: {},
      setSlotSelection: (slot, itemId) =>
        set((s) => ({
          slotSelections: { ...s.slotSelections, [slot]: itemId },
        })),
    }),
    { name: "kim-wardrobe" }
  )
);