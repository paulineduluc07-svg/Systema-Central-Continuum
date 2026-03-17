import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  initialValue: string;
  onSave?: (value: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export function EditableText({ 
  initialValue, 
  onSave, 
  className, 
  multiline = false,
  placeholder = "Click to edit..."
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== initialValue && onSave) {
      onSave(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      handleBlur();
    }
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          className={cn(
            "w-full bg-white/50 border-2 border-primary rounded px-2 py-1 outline-none resize-none font-inherit",
            className
          )}
          rows={3}
        />
      );
    }
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full bg-white/50 border-2 border-primary rounded px-2 py-1 outline-none font-inherit",
          className
        )}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={cn(
        "cursor-pointer hover:bg-black/5 rounded px-1 -mx-1 transition-colors min-h-[1.5em]",
        !value && "text-muted-foreground italic",
        className
      )}
    >
      {value || placeholder}
    </div>
  );
}
