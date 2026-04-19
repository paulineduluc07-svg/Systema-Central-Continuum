import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface StickyNoteProps {
  id: string;
  content?: string;
  color?: string;
  onChange?: (id: string, content: string) => void;
  className?: string;
}

const STICKY_COLORS = [
  { name: 'yellow', bg: 'bg-yellow-200', border: 'border-yellow-400', text: 'text-yellow-900' },
  { name: 'pink', bg: 'bg-pink-200', border: 'border-pink-400', text: 'text-pink-900' },
  { name: 'blue', bg: 'bg-blue-200', border: 'border-blue-400', text: 'text-blue-900' },
  { name: 'green', bg: 'bg-green-200', border: 'border-green-400', text: 'text-green-900' },
  { name: 'purple', bg: 'bg-purple-200', border: 'border-purple-400', text: 'text-purple-900' },
  { name: 'orange', bg: 'bg-orange-200', border: 'border-orange-400', text: 'text-orange-900' },
];

export function StickyNote({ id, content = '', color = 'yellow', onChange, className }: StickyNoteProps) {
  const [text, setText] = useState(content);
  const [selectedColor, setSelectedColor] = useState(color);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const colorStyle = STICKY_COLORS.find(c => c.name === selectedColor) || STICKY_COLORS[0];

  useEffect(() => {
    setText(content);
  }, [content]);

  const handleChange = (newText: string) => {
    setText(newText);
    onChange?.(id, newText);
  };

  return (
    <div 
      className={cn(
        "h-full flex flex-col relative",
        colorStyle.bg,
        colorStyle.text,
        className
      )}
      style={{
        boxShadow: '2px 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      {/* Color picker button */}
      <button
        onClick={() => setShowColorPicker(!showColorPicker)}
        className="absolute top-1 right-1 w-4 h-4 rounded-full border-2 border-white/50 shadow-sm"
        style={{ backgroundColor: colorStyle.bg.replace('bg-', '').replace('-200', '') }}
        onPointerDown={(e) => e.stopPropagation()}
      />

      {/* Color picker dropdown */}
      {showColorPicker && (
        <div 
          className="absolute top-6 right-1 bg-white rounded-lg shadow-lg p-2 flex gap-1 z-50"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {STICKY_COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                setSelectedColor(c.name);
                setShowColorPicker(false);
              }}
              className={cn(
                "w-5 h-5 rounded-full border-2",
                c.bg,
                c.border,
                selectedColor === c.name && "ring-2 ring-gray-400"
              )}
            />
          ))}
        </div>
      )}

      {/* Text area */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Écrivez ici..."
        className={cn(
          "flex-1 w-full resize-none bg-transparent border-none outline-none p-2 pt-6",
          "font-handwriting text-base leading-relaxed",
          colorStyle.text
        )}
        onPointerDown={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default StickyNote;
