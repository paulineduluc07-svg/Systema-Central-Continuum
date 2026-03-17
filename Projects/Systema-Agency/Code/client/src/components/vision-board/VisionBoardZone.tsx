import { useRef, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { OrnamentalFrame } from "./OrnamentalFrame";
import { motion, AnimatePresence } from "framer-motion";
import type { ZoneConfig } from "@/lib/types";

interface VisionBoardZoneProps {
  zone: ZoneConfig;
  isExpanded: boolean;
  onToggle: () => void;
  onPositionChange: (zoneId: string, x: number, y: number) => void;
  onDragEnd: (zoneId: string) => void;
  zoom: number;
  children?: React.ReactNode;
}

const COLLAPSED_SIZE = { width: 240, height: 180 };
const EXPANDED_SIZE = { width: 420, height: 400 };
const DRAG_THRESHOLD = 5; // pixels before we consider it a drag

export function VisionBoardZone({
  zone,
  isExpanded,
  onToggle,
  onPositionChange,
  onDragEnd,
  zoom,
  children,
}: VisionBoardZoneProps) {
  const size = isExpanded ? EXPANDED_SIZE : COLLAPSED_SIZE;

  // Drag state via refs (no re-render during drag for perf)
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    worldX: number;
    worldY: number;
  } | null>(null);

  // Stable animation delay based on zone id
  const floatDelay = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < zone.id.length; i++) {
      hash = zone.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 30) / 10;
  }, [zone.id]);

  // ─── Pointer event handlers for drag ──────────────────────────
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isExpanded) return; // Don't drag when expanded
    if (e.button !== 0) return; // Only left click

    e.stopPropagation(); // Prevent canvas panning
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    isDraggingRef.current = false;
    hasDraggedRef.current = false;
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      worldX: zone.position.x,
      worldY: zone.position.y,
    };
  }, [isExpanded, zone.position.x, zone.position.y]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const start = dragStartRef.current;
    if (!start) return;

    const dx = e.clientX - start.pointerX;
    const dy = e.clientY - start.pointerY;
    const dist = Math.hypot(dx, dy);

    if (!isDraggingRef.current && dist < DRAG_THRESHOLD) return;

    isDraggingRef.current = true;
    hasDraggedRef.current = true;

    // Convert screen delta to world delta (divide by zoom)
    const worldDx = dx / zoom;
    const worldDy = dy / zoom;

    onPositionChange(zone.id, start.worldX + worldDx, start.worldY + worldDy);
  }, [zoom, zone.id, onPositionChange]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const wasDragging = hasDraggedRef.current;
    isDraggingRef.current = false;
    dragStartRef.current = null;

    if (wasDragging) {
      // Flush position to persistent storage
      onDragEnd(zone.id);
      hasDraggedRef.current = false;
    } else {
      // It was a click, not a drag → toggle expand
      onToggle();
    }
  }, [zone.id, onDragEnd, onToggle]);

  // When expanded, render as fixed overlay in screen center
  if (isExpanded) {
    return (
      <motion.div
        className="fixed z-30"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          animate={{ width: EXPANDED_SIZE.width, height: EXPANDED_SIZE.height }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <OrnamentalFrame
            title={zone.label}
            color={zone.color}
            width={EXPANDED_SIZE.width}
            height={EXPANDED_SIZE.height}
            isActive
            onClick={onToggle}
          >
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="h-full overflow-y-auto custom-scrollbar"
            >
              {children}
            </motion.div>
          </OrnamentalFrame>
        </motion.div>
      </motion.div>
    );
  }

  // Collapsed: positioned in world space, draggable
  return (
    <div
      className="absolute touch-none select-none"
      style={{
        left: `${zone.position.x}px`,
        top: `${zone.position.y}px`,
        transform: "translate(-50%, -50%)",
        zIndex: 5,
        cursor: isDraggingRef.current ? "grabbing" : "grab",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        className="animate-float"
        style={{ animationDelay: `${floatDelay}s` }}
      >
        <OrnamentalFrame
          title={zone.label}
          color={zone.color}
          width={COLLAPSED_SIZE.width}
          height={COLLAPSED_SIZE.height}
          isActive={false}
        >
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-3xl mb-2 opacity-40">
                {getZoneEmoji(zone.icon)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-600">
                Cliquer pour ouvrir
              </p>
            </div>
          </div>
        </OrnamentalFrame>
      </div>
    </div>
  );
}

function getZoneEmoji(icon: string): string {
  const emojiMap: Record<string, string> = {
    utensils: "🍽️",
    briefcase: "💼",
    sparkles: "✨",
    wallet: "💰",
    "heart-pulse": "❤️‍🩹",
    "book-open": "📚",
    home: "🏠",
  };
  return emojiMap[icon] || "📌";
}
