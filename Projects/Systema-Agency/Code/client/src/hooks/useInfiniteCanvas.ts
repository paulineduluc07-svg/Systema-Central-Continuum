import { useRef, useCallback, useEffect, CSSProperties } from "react";
import { usePersistedState } from "./usePersistedState";

interface CanvasState {
  panX: number;
  panY: number;
  zoom: number;
}

const DEFAULT_STATE: CanvasState = { panX: 0, panY: 0, zoom: 1 };
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2.5;
const ZOOM_SPEED = 0.001;

export function useInfiniteCanvas() {
  const [canvasState, setCanvasState] = usePersistedState<CanvasState>("canvas_state", DEFAULT_STATE);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Transient state for panning (not persisted, not in React state for perf)
  const panningRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    startPanX: number;
    startPanY: number;
  } | null>(null);

  // Keep latest canvas state in a ref for event handlers
  const stateRef = useRef(canvasState);
  stateRef.current = canvasState;

  // Force-update trigger for isPanning (since we use ref)
  const isPanningRef = useRef(false);

  // ─── Pan handlers ────────────────────────────────────────────
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Only pan on left-click on background or middle-click anywhere
    const isBackground = e.target === e.currentTarget ||
      (e.target as HTMLElement).dataset?.canvasBackground === "true";
    const isMiddleClick = e.button === 1;

    if (!isBackground && !isMiddleClick) return;

    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isPanningRef.current = true;
    panningRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startPanX: stateRef.current.panX,
      startPanY: stateRef.current.panY,
    };

    // Set cursor
    if (viewportRef.current) {
      viewportRef.current.style.cursor = "grabbing";
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const pan = panningRef.current;
    if (!pan || !pan.active) return;

    const dx = e.clientX - pan.startX;
    const dy = e.clientY - pan.startY;

    setCanvasState(prev => ({
      ...prev,
      panX: pan.startPanX + dx,
      panY: pan.startPanY + dy,
    }));
  }, [setCanvasState]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!panningRef.current?.active) return;
    panningRef.current = null;
    isPanningRef.current = false;

    if (viewportRef.current) {
      viewportRef.current.style.cursor = "";
    }
  }, []);

  // ─── Zoom (wheel) — must be non-passive for preventDefault ───
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { panX, panY, zoom } = stateRef.current;

      // Calculate new zoom
      const delta = -e.deltaY * ZOOM_SPEED;
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * (1 + delta)));

      // Zoom toward cursor position
      const rect = el.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      // World point under cursor before zoom
      const worldX = (cursorX - panX) / zoom;
      const worldY = (cursorY - panY) / zoom;

      // Adjust pan so the same world point stays under cursor after zoom
      const newPanX = cursorX - worldX * newZoom;
      const newPanY = cursorY - worldY * newZoom;

      setCanvasState({
        panX: newPanX,
        panY: newPanY,
        zoom: newZoom,
      });
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [setCanvasState]);

  // ─── Touch pinch-to-zoom ─────────────────────────────────────
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    let lastTouchDist = 0;
    let lastTouchMid = { x: 0, y: 0 };
    let activeTouches = 0;

    const getTouchInfo = (touches: TouchList) => {
      if (touches.length < 2) return null;
      const t1 = touches[0];
      const t2 = touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;
      return { dist, midX, midY };
    };

    const onTouchStart = (e: TouchEvent) => {
      activeTouches = e.touches.length;
      if (e.touches.length === 2) {
        e.preventDefault();
        const info = getTouchInfo(e.touches);
        if (info) {
          lastTouchDist = info.dist;
          lastTouchMid = { x: info.midX, y: info.midY };
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const info = getTouchInfo(e.touches);
        if (!info) return;

        const { panX, panY, zoom } = stateRef.current;
        const rect = el.getBoundingClientRect();

        // Pinch zoom
        const scale = info.dist / lastTouchDist;
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * scale));

        // Zoom toward pinch midpoint
        const cursorX = info.midX - rect.left;
        const cursorY = info.midY - rect.top;
        const worldX = (cursorX - panX) / zoom;
        const worldY = (cursorY - panY) / zoom;
        let newPanX = cursorX - worldX * newZoom;
        let newPanY = cursorY - worldY * newZoom;

        // Also pan with two-finger move
        const panDx = info.midX - lastTouchMid.x;
        const panDy = info.midY - lastTouchMid.y;
        newPanX += panDx;
        newPanY += panDy;

        setCanvasState({ panX: newPanX, panY: newPanY, zoom: newZoom });

        lastTouchDist = info.dist;
        lastTouchMid = { x: info.midX, y: info.midY };
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      activeTouches = e.touches.length;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [setCanvasState]);

  // ─── Computed style for the transform layer ──────────────────
  const contentStyle: CSSProperties = {
    transform: `translate(${canvasState.panX}px, ${canvasState.panY}px) scale(${canvasState.zoom})`,
    transformOrigin: "0 0",
    willChange: "transform",
    position: "absolute" as const,
    top: 0,
    left: 0,
    // Large world size so zones aren't clipped
    width: "4000px",
    height: "3000px",
  };

  // ─── Utility functions ───────────────────────────────────────
  const resetView = useCallback(() => {
    setCanvasState(DEFAULT_STATE);
  }, [setCanvasState]);

  const zoomIn = useCallback(() => {
    setCanvasState(prev => {
      const newZoom = Math.min(MAX_ZOOM, prev.zoom * 1.25);
      // Zoom toward center of viewport
      const el = viewportRef.current;
      if (!el) return { ...prev, zoom: newZoom };
      const rect = el.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const worldX = (cx - prev.panX) / prev.zoom;
      const worldY = (cy - prev.panY) / prev.zoom;
      return {
        panX: cx - worldX * newZoom,
        panY: cy - worldY * newZoom,
        zoom: newZoom,
      };
    });
  }, [setCanvasState]);

  const zoomOut = useCallback(() => {
    setCanvasState(prev => {
      const newZoom = Math.max(MIN_ZOOM, prev.zoom / 1.25);
      const el = viewportRef.current;
      if (!el) return { ...prev, zoom: newZoom };
      const rect = el.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const worldX = (cx - prev.panX) / prev.zoom;
      const worldY = (cy - prev.panY) / prev.zoom;
      return {
        panX: cx - worldX * newZoom,
        panY: cy - worldY * newZoom,
        zoom: newZoom,
      };
    });
  }, [setCanvasState]);

  const fitAll = useCallback((positions: { x: number; y: number }[]) => {
    if (positions.length === 0) return;
    const el = viewportRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const PADDING = 200;

    // Bounding box of all positions
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of positions) {
      minX = Math.min(minX, p.x - 150);
      minY = Math.min(minY, p.y - 120);
      maxX = Math.max(maxX, p.x + 150);
      maxY = Math.max(maxY, p.y + 120);
    }

    const worldW = maxX - minX + PADDING * 2;
    const worldH = maxY - minY + PADDING * 2;

    const zoom = Math.min(
      rect.width / worldW,
      rect.height / worldH,
      1.5 // don't zoom in too much
    );

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setCanvasState({
      panX: rect.width / 2 - centerX * zoom,
      panY: rect.height / 2 - centerY * zoom,
      zoom: Math.max(MIN_ZOOM, zoom),
    });
  }, [setCanvasState]);

  return {
    panX: canvasState.panX,
    panY: canvasState.panY,
    zoom: canvasState.zoom,
    viewportRef,
    contentStyle,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    resetView,
    zoomIn,
    zoomOut,
    fitAll,
  };
}
