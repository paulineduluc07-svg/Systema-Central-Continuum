export interface OutfitItem {
  id: string;
  label: string;
  slot: "hair" | "top" | "bottom" | "shoes" | "accessory" | "full";
  /** CSS color for swatch preview */
  thumbnailColor: string;
  /** Optional: RPM avatar GLB URL with this outfit baked in */
  avatarUrl?: string;
}

export const OUTFIT_CATALOG: OutfitItem[] = [
  // Full outfits (Ready Player Me GLB — baked per look)
  {
    id: "pink-blazer",
    label: "Pink Blazer",
    slot: "full",
    thumbnailColor: "#e060a0",
    // Default avatar URL — the pink-suit look
    avatarUrl: process.env.NEXT_PUBLIC_AVATAR_URL ?? undefined,
  },
  {
    id: "casual-denim",
    label: "Casual Denim",
    slot: "full",
    thumbnailColor: "#4a7ab5",
  },
  {
    id: "athletic-sport",
    label: "Athletic",
    slot: "full",
    thumbnailColor: "#22d3c5",
  },
  {
    id: "evening-gown",
    label: "Evening Gown",
    slot: "full",
    thumbnailColor: "#8b5cf6",
  },
  // Accessories
  {
    id: "gold-necklace",
    label: "Gold Chain",
    slot: "accessory",
    thumbnailColor: "#f5c842",
  },
  {
    id: "pearl-earrings",
    label: "Pearls",
    slot: "accessory",
    thumbnailColor: "#f0ece8",
  },
];

export const DEFAULT_OUTFIT_ID = "pink-blazer";