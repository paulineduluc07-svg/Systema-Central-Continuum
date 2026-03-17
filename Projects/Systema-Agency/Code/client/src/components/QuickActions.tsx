import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useLifeCommandItems, type ItemType } from "@/hooks/useLifeCommandItems";
import {
  Mic,
  MicOff,
  StickyNote,
  Lightbulb,
  BookmarkPlus,
  Camera,
  X,
  Send,
  Loader2,
  Check,
  Sparkles,
} from "lucide-react";

interface QuickActionsProps {
  onSendToChat?: (message: string) => void;
  onAvatarStateChange?: (state: "idle" | "thinking" | "speaking" | "listening") => void;
  className?: string;
}

type ActiveModal = null | "memo" | "idea" | "bookmark";

const QUICK_BUTTONS = [
  { type: "voice" as const, icon: Mic, label: "Vocal", color: "from-cyan-500 to-blue-500", hoverColor: "hover:bg-cyan-50 dark:hover:bg-cyan-950/30" },
  { type: "memo" as const, icon: StickyNote, label: "Mémo", color: "from-amber-500 to-orange-500", hoverColor: "hover:bg-amber-50 dark:hover:bg-amber-950/30" },
  { type: "idea" as const, icon: Lightbulb, label: "Idée", color: "from-yellow-400 to-amber-500", hoverColor: "hover:bg-yellow-50 dark:hover:bg-yellow-950/30" },
  { type: "bookmark" as const, icon: BookmarkPlus, label: "Bookmark", color: "from-purple-500 to-indigo-500", hoverColor: "hover:bg-purple-50 dark:hover:bg-purple-950/30" },
  { type: "photo" as const, icon: Camera, label: "Photo", color: "from-pink-500 to-rose-500", hoverColor: "hover:bg-pink-50 dark:hover:bg-pink-950/30" },
];

export function QuickActions({
  onSendToChat,
  onAvatarStateChange,
  className,
}: QuickActionsProps) {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<{ type: string; title: string; category: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addItem, updateItem } = useLifeCommandItems();
  const categorizeMutation = trpc.ai.categorize.useMutation();

  // Speech-to-Text hook
  const {
    isListening,
    transcript,
    state: speechState,
    error: speechError,
    isSupported: speechSupported,
    toggleListening,
    resetTranscript,
  } = useSpeechToText({
    language: "fr-FR",
    onResult: (text) => {
      // When speech finishes, send it through the pipeline
      handleSubmitContent("voice", text);
    },
    onStateChange: (state) => {
      if (state === "listening") {
        onAvatarStateChange?.("listening");
      } else if (state === "idle") {
        onAvatarStateChange?.("idle");
      }
    },
  });

  // Submit content through the AI categorization pipeline
  const handleSubmitContent = useCallback(
    async (type: ItemType, content: string) => {
      if (!content.trim()) return;

      setIsProcessing(true);
      onAvatarStateChange?.("thinking");

      // 1. Save item immediately
      const item = addItem(type, content.trim());

      // 2. Send to chat as a user message
      const typeEmoji = {
        memo: "📝",
        idea: "💡",
        bookmark: "🔖",
        photo: "📸",
        voice: "🎤",
        document: "📄",
      };
      onSendToChat?.(`${typeEmoji[type]} [${type.toUpperCase()}] ${content.trim()}`);

      // 3. Categorize with AI in background
      try {
        const result = await categorizeMutation.mutateAsync({
          content: content.trim(),
          type: type === "voice" ? "memo" : type as any,
        });

        if (result.success && result.data) {
          updateItem(item.id, {
            title: result.data.title,
            summary: result.data.summary,
            category: result.data.category,
            keyConepts: result.data.key_concepts,
            importance: result.data.importance,
            suggestedAction: result.data.suggested_action,
            categorized: true,
          });

          setLastResult({
            type,
            title: result.data.title,
            category: result.data.category,
          });

          // Clear result after 3 seconds
          setTimeout(() => setLastResult(null), 3000);
        }
      } catch (err) {
        console.error("Categorization failed:", err);
      }

      setIsProcessing(false);
      onAvatarStateChange?.("idle");
      setActiveModal(null);
      setInputValue("");
    },
    [addItem, updateItem, categorizeMutation, onSendToChat, onAvatarStateChange]
  );

  const handleQuickAction = (type: string) => {
    if (type === "voice") {
      if (!speechSupported) {
        onSendToChat?.("⚠️ La reconnaissance vocale n'est pas supportée par ton navigateur. Utilise Chrome !");
        return;
      }
      resetTranscript();
      toggleListening();
      return;
    }

    if (type === "photo") {
      fileInputRef.current?.click();
      return;
    }

    // Open text input modal for memo, idea, bookmark
    setActiveModal(type as ActiveModal);
    setInputValue("");
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, just log the photo name — full handling will come with storage
    const photoDescription = `Photo: ${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
    handleSubmitContent("photo", photoDescription);

    // Reset the file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleModalSubmit = () => {
    if (!activeModal || !inputValue.trim()) return;
    handleSubmitContent(activeModal, inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleModalSubmit();
    }
    if (e.key === "Escape") {
      setActiveModal(null);
    }
  };

  const getModalConfig = () => {
    switch (activeModal) {
      case "memo":
        return { title: "📝 Nouveau mémo", placeholder: "Écris ton mémo ici...", color: "from-amber-500 to-orange-500" };
      case "idea":
        return { title: "💡 Nouvelle idée", placeholder: "Décris ton idée...", color: "from-yellow-400 to-amber-500" };
      case "bookmark":
        return { title: "🔖 Nouveau bookmark", placeholder: "Colle un lien ou décris ce que tu veux sauvegarder...", color: "from-purple-500 to-indigo-500" };
      default:
        return { title: "", placeholder: "", color: "" };
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Hidden file input for photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handlePhotoSelect}
      />

      {/* Quick Actions Bar */}
      <div className="flex items-center gap-1.5">
        {QUICK_BUTTONS.map((btn) => {
          const Icon = btn.icon;
          const isActive = btn.type === "voice" && isListening;

          return (
            <button
              key={btn.type}
              onClick={() => handleQuickAction(btn.type)}
              disabled={isProcessing}
              className={cn(
                "relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border",
                isActive
                  ? "bg-gradient-to-r text-white border-transparent shadow-lg scale-105 " + btn.color
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 " + btn.hoverColor,
                isProcessing && "opacity-50 cursor-not-allowed",
              )}
              title={btn.label}
            >
              {btn.type === "voice" && isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{btn.label}</span>
              {isActive && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Voice Listening Indicator */}
      {isListening && (
        <div className="mt-2 p-3 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-xl animate-pulse">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              <div className="w-1 h-4 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1 h-6 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              <div className="w-1 h-5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "450ms" }} />
            </div>
            <span className="text-sm text-cyan-700 dark:text-cyan-300 font-medium">
              🎤 Je t'écoute...
            </span>
          </div>
          {transcript && (
            <p className="mt-2 text-sm text-cyan-800 dark:text-cyan-200 italic">
              "{transcript}"
            </p>
          )}
          {speechError && (
            <p className="mt-1 text-xs text-red-500">{speechError}</p>
          )}
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
          <span className="text-xs text-purple-700 dark:text-purple-300">
            L'IA analyse et catégorise...
          </span>
        </div>
      )}

      {/* Success Indicator */}
      {lastResult && !isProcessing && (
        <div className="mt-2 p-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-700 dark:text-green-300">
            <strong>{lastResult.title}</strong> → {lastResult.category}
          </span>
          <Sparkles className="w-3 h-3 text-green-400" />
        </div>
      )}

      {/* Text Input Modal */}
      {activeModal && (
        <div className="absolute bottom-full left-0 right-0 mb-2 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Modal Header */}
            <div className={cn(
              "flex items-center justify-between px-4 py-2 bg-gradient-to-r text-white",
              getModalConfig().color
            )}>
              <span className="font-semibold text-sm">{getModalConfig().title}</span>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-3">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={getModalConfig().placeholder}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500/50 min-h-[80px]"
                rows={3}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">
                  Entrée pour envoyer · Shift+Entrée pour nouvelle ligne
                </span>
                <button
                  onClick={handleModalSubmit}
                  disabled={!inputValue.trim()}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all",
                    inputValue.trim()
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 shadow-md"
                      : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                  )}
                >
                  <Send className="w-3.5 h-3.5" />
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
