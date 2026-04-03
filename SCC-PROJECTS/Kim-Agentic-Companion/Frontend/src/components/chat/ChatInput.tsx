"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/Button";
import { VoiceButton } from "@/components/voice/VoiceButton";
import { useVoice } from "@/hooks/useVoice";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  const { toggle } = useVoice((transcript) => {
    setValue((prev) => (prev ? prev + " " + transcript : transcript));
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!value.trim() || disabled) return;
      onSend(value.trim());
      setValue("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Say something to Kim..."
        rows={1}
        className="flex-1 bg-[rgba(7,10,24,0.45)] border border-[rgba(179,188,251,0.2)] rounded-xl px-4 py-2.5 text-[#f4f3ff] placeholder-[#a8aed3] text-sm resize-none focus:outline-none focus:border-[#ff5f7c] transition-colors disabled:opacity-50"
        style={{ minHeight: "42px", maxHeight: "120px" }}
      />
      <VoiceButton onToggle={toggle} />
      <Button type="submit" disabled={disabled || !value.trim()} size="md">
        Send
      </Button>
    </form>
  );
}
