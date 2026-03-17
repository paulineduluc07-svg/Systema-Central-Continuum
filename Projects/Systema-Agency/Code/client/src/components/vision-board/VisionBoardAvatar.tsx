import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { MessageCircle, Move } from "lucide-react";
import { usePersistedState } from "@/hooks/usePersistedState";
import type { AvatarState } from "@/components/LifeCommandChat";

interface VisionBoardAvatarProps {
  avatarState: AvatarState;
  isChatOpen: boolean;
  onChatToggle: () => void;
  darkMode: boolean;
  zoom: number;
}

const DRAG_THRESHOLD = 5;

export function VisionBoardAvatar({
  avatarState,
  isChatOpen,
  onChatToggle,
  darkMode,
  zoom,
}: VisionBoardAvatarProps) {
  const [position, setPosition] = usePersistedState<{ x: number; y: number }>(
    "avatar_pos_world",
    { x: 960, y: 540 }
  );

  // Drag state via refs
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    worldX: number;
    worldY: number;
  } | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    isDraggingRef.current = false;
    hasDraggedRef.current = false;
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      worldX: position.x,
      worldY: position.y,
    };
  }, [position.x, position.y]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const start = dragStartRef.current;
    if (!start) return;

    const dx = e.clientX - start.pointerX;
    const dy = e.clientY - start.pointerY;
    const dist = Math.hypot(dx, dy);

    if (!isDraggingRef.current && dist < DRAG_THRESHOLD) return;

    isDraggingRef.current = true;
    hasDraggedRef.current = true;

    const worldDx = dx / zoom;
    const worldDy = dy / zoom;

    setPosition({ x: start.worldX + worldDx, y: start.worldY + worldDy });
  }, [zoom, setPosition]);

  const handlePointerUp = useCallback(() => {
    const wasDragging = hasDraggedRef.current;
    isDraggingRef.current = false;
    dragStartRef.current = null;
    hasDraggedRef.current = false;

    if (!wasDragging) {
      onChatToggle();
    }
  }, [onChatToggle]);

  return (
    <div
      className="absolute z-10 touch-none select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="relative w-[300px] h-[500px] flex flex-col items-center justify-end cursor-grab active:cursor-grabbing">
        {/* State glow effects */}
        {avatarState === "thinking" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full bg-purple-400/20 animate-ping" />
          </div>
        )}
        {avatarState === "speaking" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-40 rounded-full bg-pink-400/30 animate-pulse" />
          </div>
        )}
        {avatarState === "listening" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-44 h-44 rounded-full border-2 border-cyan-400/50 animate-ping" />
            <div
              className="absolute w-36 h-36 rounded-full border-2 border-cyan-300/30 animate-ping"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
        )}

        {/* Avatar Image */}
        <img
          src="/avatar-transparent.png"
          alt="Life-Command Avatar"
          className={cn(
            "h-[360px] object-contain transition-all duration-500 pointer-events-none",
            avatarState === "idle" && "animate-breathe",
            avatarState === "thinking" && "animate-pulse scale-[1.02]",
            avatarState === "speaking" && "animate-bounce-gentle",
            avatarState === "listening" && "brightness-110"
          )}
          style={{
            maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
            filter: darkMode ? "brightness(1.3) saturate(1.1)" : "none",
          }}
          draggable={false}
        />

        {/* "Life Command" title in Pacifico */}
        <span
          className="text-3xl text-pink-400 drop-shadow-[0_0_12px_rgba(255,105,180,0.6)] mt-[-10px] pointer-events-none"
          style={{ fontFamily: "var(--font-calligraphic)" }}
        >
          Life Command
        </span>

        {/* State indicator */}
        {avatarState !== "idle" && (
          <div
            className={cn(
              "absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg backdrop-blur-sm pointer-events-none",
              avatarState === "thinking" && "bg-purple-500/80",
              avatarState === "speaking" && "bg-pink-500/80",
              avatarState === "listening" && "bg-cyan-500/80"
            )}
          >
            {avatarState === "thinking" && "💭 Réfléchit..."}
            {avatarState === "speaking" && "💬 Répond..."}
            {avatarState === "listening" && "🎤 Écoute..."}
          </div>
        )}

        {/* Chat toggle bubble */}
        {!isChatOpen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChatToggle();
            }}
            className="absolute -right-2 top-1/3 bg-pink-500 hover:bg-pink-600 text-white rounded-full p-2 shadow-lg hover:scale-110 transition-all animate-bounce-gentle"
            title="Ouvrir le chat"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        )}

        {/* Drag indicator */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/40 rounded-full px-2 py-1 opacity-0 hover:opacity-60 transition-opacity pointer-events-none">
          <Move className="w-4 h-4 text-white/60" />
        </div>
      </div>
    </div>
  );
}
