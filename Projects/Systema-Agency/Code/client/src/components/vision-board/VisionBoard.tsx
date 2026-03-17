import { useState, useCallback, useMemo } from "react";
import { VisionBoardAvatar } from "./VisionBoardAvatar";
import { VisionBoardZone } from "./VisionBoardZone";
import { CanvasControls } from "./CanvasControls";
import { useInfiniteCanvas } from "@/hooks/useInfiniteCanvas";
import type { ZoneConfig } from "@/lib/types";
import type { AvatarState } from "@/components/LifeCommandChat";

interface VisionBoardProps {
  zones: ZoneConfig[];
  avatarState: AvatarState;
  isChatOpen: boolean;
  onChatToggle: () => void;
  darkMode: boolean;
  renderZoneContent: (zoneId: string) => React.ReactNode;
  onZonePositionChange: (zoneId: string, x: number, y: number) => void;
  onZoneDragEnd: (zoneId: string) => void;
}

export function VisionBoard({
  zones,
  avatarState,
  isChatOpen,
  onChatToggle,
  darkMode,
  renderZoneContent,
  onZonePositionChange,
  onZoneDragEnd,
}: VisionBoardProps) {
  const [expandedZone, setExpandedZone] = useState<string | null>(null);
  // Local drag overrides — only active during a drag (for perf: avoids localStorage writes per frame)
  const [dragOverrides, setDragOverrides] = useState<Record<string, { x: number; y: number }>>({});

  const {
    zoom,
    viewportRef,
    contentStyle,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    resetView,
    zoomIn,
    zoomOut,
    fitAll,
  } = useInfiniteCanvas();

  const handleZoneToggle = useCallback((zoneId: string) => {
    setExpandedZone(prev => (prev === zoneId ? null : zoneId));
  }, []);

  // During drag: update local state only (fast, no localStorage)
  const handleLocalPositionChange = useCallback((zoneId: string, x: number, y: number) => {
    setDragOverrides(prev => ({ ...prev, [zoneId]: { x, y } }));
  }, []);

  // On drag end: flush to parent (writes to config/localStorage) and clear local override
  const handleLocalDragEnd = useCallback((zoneId: string) => {
    const pos = dragOverrides[zoneId];
    if (pos) {
      onZonePositionChange(zoneId, pos.x, pos.y);
    }
    setDragOverrides(prev => {
      const next = { ...prev };
      delete next[zoneId];
      return next;
    });
    onZoneDragEnd(zoneId);
  }, [dragOverrides, onZonePositionChange, onZoneDragEnd]);

  // Merge config zones with local drag overrides for display
  const displayZones = useMemo(() => {
    return zones.map(z => {
      const override = dragOverrides[z.id];
      if (override) {
        return { ...z, position: override };
      }
      return z;
    });
  }, [zones, dragOverrides]);

  const handleFitAll = useCallback(() => {
    fitAll(displayZones.map(z => z.position));
  }, [displayZones, fitAll]);

  return (
    <div className="vision-board-bg w-full h-screen relative overflow-hidden">
      {/* Subtle ambient glow — fixed, doesn't zoom */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,105,180,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Scattered decorative hearts — fixed, don't zoom */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {DECO_HEARTS.map((heart, i) => (
          <span
            key={i}
            className="absolute text-pink-300/40 animate-float"
            style={{
              left: heart.x,
              top: heart.y,
              fontSize: heart.size,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${5 + heart.delay}s`,
            }}
          >
            ♡
          </span>
        ))}
      </div>

      {/* Infinite Canvas — pan/zoom layer */}
      <div
        ref={viewportRef}
        className="absolute inset-0"
        data-canvas-background="true"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Transform layer — world content */}
        <div style={contentStyle} data-canvas-background="true">
          {/* Grid dots for visual reference */}
          <CanvasGrid />

          {/* Avatar — centered in world space */}
          <VisionBoardAvatar
            avatarState={avatarState}
            isChatOpen={isChatOpen}
            onChatToggle={onChatToggle}
            darkMode={darkMode}
            zoom={zoom}
          />

          {/* Category Zones — positioned in world space */}
          {displayZones.map(zone => (
            <VisionBoardZone
              key={zone.id}
              zone={zone}
              isExpanded={expandedZone === zone.id}
              onToggle={() => handleZoneToggle(zone.id)}
              onPositionChange={handleLocalPositionChange}
              onDragEnd={handleLocalDragEnd}
              zoom={zoom}
            >
              {renderZoneContent(zone.id)}
            </VisionBoardZone>
          ))}
        </div>
      </div>

      {/* Click backdrop to close expanded zone — fixed overlay */}
      {expandedZone && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm"
          onClick={() => setExpandedZone(null)}
        />
      )}

      {/* Canvas controls — fixed HUD */}
      <CanvasControls
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetView}
        onFitAll={handleFitAll}
      />
    </div>
  );
}

// Subtle grid dots for spatial reference
function CanvasGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(200,200,210,0.5) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }}
    />
  );
}

// Decorative hearts scattered in background
const DECO_HEARTS = [
  { x: "5%", y: "15%", size: "14px", delay: 0 },
  { x: "15%", y: "45%", size: "10px", delay: 1.2 },
  { x: "25%", y: "80%", size: "12px", delay: 0.5 },
  { x: "40%", y: "20%", size: "8px", delay: 2.1 },
  { x: "55%", y: "85%", size: "14px", delay: 0.8 },
  { x: "65%", y: "30%", size: "10px", delay: 1.5 },
  { x: "78%", y: "65%", size: "12px", delay: 0.3 },
  { x: "88%", y: "18%", size: "10px", delay: 1.8 },
  { x: "92%", y: "75%", size: "14px", delay: 2.5 },
  { x: "35%", y: "55%", size: "8px", delay: 0.7 },
  { x: "70%", y: "48%", size: "10px", delay: 1.1 },
  { x: "82%", y: "88%", size: "12px", delay: 2.0 },
];
