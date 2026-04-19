export type WardrobeSlot = "hair" | "top" | "bottom" | "shoes" | "accessory" | "full";

export interface SlotDefinition {
  id: WardrobeSlot;
  label: string;
  icon: string;
}

export const WARDROBE_SLOTS: SlotDefinition[] = [
  { id: "full",      label: "Full Outfit", icon: "👗" },
  { id: "hair",      label: "Hair",        icon: "💇" },
  { id: "top",       label: "Top",         icon: "👚" },
  { id: "bottom",    label: "Bottom",      icon: "👖" },
  { id: "shoes",     label: "Shoes",       icon: "👠" },
  { id: "accessory", label: "Accessory",   icon: "💎" },
];