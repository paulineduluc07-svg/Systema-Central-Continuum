import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";

interface CanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onFitAll: () => void;
}

export function CanvasControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  onFitAll,
}: CanvasControlsProps) {
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-1 bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 px-2 py-1.5 shadow-md">
      {/* Zoom out */}
      <button
        onClick={onZoomOut}
        className="p-1.5 rounded-lg hover:bg-pink-50 text-gray-500 hover:text-pink-500 transition-colors"
        title="Dézoomer"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      {/* Zoom percentage */}
      <span className="text-xs text-gray-500 font-mono w-10 text-center select-none">
        {zoomPercent}%
      </span>

      {/* Zoom in */}
      <button
        onClick={onZoomIn}
        className="p-1.5 rounded-lg hover:bg-pink-50 text-gray-500 hover:text-pink-500 transition-colors"
        title="Zoomer"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      {/* Separator */}
      <div className="w-px h-4 bg-gray-200 mx-0.5" />

      {/* Fit all zones */}
      <button
        onClick={onFitAll}
        className="p-1.5 rounded-lg hover:bg-pink-50 text-gray-500 hover:text-pink-500 transition-colors"
        title="Tout afficher"
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      {/* Reset view */}
      <button
        onClick={onReset}
        className="p-1.5 rounded-lg hover:bg-pink-50 text-gray-500 hover:text-pink-500 transition-colors"
        title="Réinitialiser la vue"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
}
