import { Rnd } from 'react-rnd';
import { useState, useEffect, ReactNode } from 'react';
import { GripVertical, X, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface DraggableWidgetProps {
  id: string;
  children: ReactNode;
  defaultPosition?: Position;
  defaultSize?: Size;
  minWidth?: number;
  minHeight?: number;
  title?: string;
  icon?: ReactNode;
  headerColor?: string;
  onPositionChange?: (id: string, position: Position, size: Size) => void;
  onRemove?: (id: string) => void;
  className?: string;
  zIndex?: number;
  onFocus?: (id: string) => void;
}

export function DraggableWidget({
  id,
  children,
  defaultPosition = { x: 50, y: 100 },
  defaultSize = { width: 300, height: 200 },
  minWidth = 200,
  minHeight = 150,
  title,
  icon,
  headerColor = 'bg-pink-500',
  onPositionChange,
  onRemove,
  className,
  zIndex = 10,
  onFocus,
}: DraggableWidgetProps) {
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);
  const [isMinimized, setIsMinimized] = useState(false);
  const [prevSize, setPrevSize] = useState(defaultSize);

  useEffect(() => {
    setPosition(defaultPosition);
    setSize(defaultSize);
  }, [defaultPosition.x, defaultPosition.y, defaultSize.width, defaultSize.height]);

  const handleDragStop = (_e: any, d: { x: number; y: number }) => {
    const newPos = { x: d.x, y: d.y };
    setPosition(newPos);
    onPositionChange?.(id, newPos, size);
  };

  const handleResizeStop = (_e: any, _direction: any, ref: HTMLElement, _delta: any, newPosition: Position) => {
    const newSize = {
      width: parseInt(ref.style.width),
      height: parseInt(ref.style.height),
    };
    setSize(newSize);
    setPosition(newPosition);
    onPositionChange?.(id, newPosition, newSize);
  };

  const toggleMinimize = () => {
    if (isMinimized) {
      setSize(prevSize);
    } else {
      setPrevSize(size);
      setSize({ width: size.width, height: 40 });
    }
    setIsMinimized(!isMinimized);
  };

  return (
    <Rnd
      position={position}
      size={isMinimized ? { width: size.width, height: 40 } : size}
      minWidth={minWidth}
      minHeight={isMinimized ? 40 : minHeight}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onMouseDown={() => onFocus?.(id)}
      bounds="parent"
      dragHandleClassName="drag-handle"
      enableResizing={!isMinimized}
      style={{ zIndex }}
      className={cn(
        "rounded-2xl overflow-hidden shadow-lg border-2",
        "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm",
        "border-gray-200 dark:border-gray-700",
        className
      )}
    >
      {/* Header - Drag Handle */}
      <div 
        className={cn(
          "drag-handle flex items-center justify-between px-3 py-2 cursor-move",
          headerColor,
          "text-white"
        )}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 opacity-70" />
          {icon}
          {title && <span className="font-bold text-sm">{title}</span>}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleMinimize}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {isMinimized ? (
              <Maximize2 className="w-3 h-3" />
            ) : (
              <Minimize2 className="w-3 h-3" />
            )}
          </button>
          {onRemove && (
            <button
              onClick={() => onRemove(id)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="p-3 h-[calc(100%-40px)] overflow-auto">
          {children}
        </div>
      )}
    </Rnd>
  );
}

export default DraggableWidget;
