import {
  Activity,
  BookOpen,
  File,
  Folder,
  Heart,
  Layout,
  List,
  PenTool,
  Sparkles,
  Star,
  StickyNote,
  Zap,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  activity: Activity,
  book: BookOpen,
  file: File,
  folder: Folder,
  heart: Heart,
  layout: Layout,
  list: List,
  note: StickyNote,
  "pen-tool": PenTool,
  sparkles: Sparkles,
  star: Star,
  sticky: StickyNote,
  zap: Zap,
};

export function getCustomTabIcon(name: string | null | undefined): LucideIcon {
  if (!name) return File;
  return iconMap[name.trim().toLowerCase()] ?? File;
}

export function normalizeTabColor(color: string | null | undefined) {
  if (!color) return "#FF69B4";
  return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(color.trim()) ? color.trim() : "#FF69B4";
}
