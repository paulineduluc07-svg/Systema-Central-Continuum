import { useState, useCallback } from "react";
import { AIChatBox, type Message } from "./AIChatBox";
import { QuickActions } from "./QuickActions";
import { trpc } from "@/lib/trpc";
import { usePersistedState } from "@/hooks/usePersistedState";
import { cn } from "@/lib/utils";
import { Minimize2, Maximize2, X, MessageCircle, Zap } from "lucide-react";

export type AvatarState = "idle" | "thinking" | "speaking" | "listening";

interface LifeCommandChatProps {
  className?: string;
  onAvatarStateChange?: (state: AvatarState) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const SUGGESTED_PROMPTS = [
  "Aide-moi à organiser mes idées",
  "Qu'est-ce que je devrais prioriser ?",
  "Note : j'ai une nouvelle idée de projet",
  "Résume ce que j'ai fait aujourd'hui",
];

export function LifeCommandChat({
  className,
  onAvatarStateChange,
  isOpen = true,
  onToggle,
}: LifeCommandChatProps) {
  // Persist chat history in localStorage
  const [messages, setMessages] = usePersistedState<Message[]>("lc_chat_history", []);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showQuickActions, setShowQuickActions] = usePersistedState<boolean>("lc_quick_actions_open", true);

  // tRPC mutation for AI chat
  const chatMutation = trpc.ai.chat.useMutation({
    onMutate: () => {
      onAvatarStateChange?.("thinking");
    },
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev,
        { role: "assistant" as const, content: data.response },
      ]);
      onAvatarStateChange?.("speaking");
      // Return to idle after "speaking" animation
      setTimeout(() => onAvatarStateChange?.("idle"), 2000);
    },
    onError: (error) => {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant" as const,
          content: "❌ Désolé, une erreur est survenue. Vérifie ta connexion ou tes clés API.",
        },
      ]);
      onAvatarStateChange?.("idle");
    },
  });

  const handleSendMessage = useCallback(
    (content: string) => {
      // Add user message immediately
      const newMessages: Message[] = [
        ...messages,
        { role: "user" as const, content },
      ];
      setMessages(newMessages);

      // Call the AI
      chatMutation.mutate({
        messages: newMessages.slice(-20), // Keep last 20 messages for context
      });
    },
    [messages, setMessages, chatMutation]
  );

  // Quick action sends content to chat and triggers AI
  const handleQuickActionSend = useCallback(
    (content: string) => {
      handleSendMessage(content);
    },
    [handleSendMessage]
  );

  const handleClearChat = () => {
    setMessages([]);
    onAvatarStateChange?.("idle");
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "flex flex-col bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300",
        isMinimized ? "h-12" : "",
        className
      )}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          <span className="font-semibold text-sm">Life-Command</span>
          {chatMutation.isPending && (
            <span className="text-xs opacity-80 animate-pulse">
              réfléchit...
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className={cn(
              "p-1 rounded transition-colors",
              showQuickActions ? "bg-white/30" : "hover:bg-white/20"
            )}
            title="Quick Actions"
          >
            <Zap className="w-3.5 h-3.5" />
          </button>
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="p-1 hover:bg-white/20 rounded transition-colors text-xs opacity-70 hover:opacity-100"
              title="Effacer la conversation"
            >
              Effacer
            </button>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-3.5 h-3.5" />
            ) : (
              <Minimize2 className="w-3.5 h-3.5" />
            )}
          </button>
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Actions Bar */}
      {!isMinimized && showQuickActions && (
        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
          <QuickActions
            onSendToChat={handleQuickActionSend}
            onAvatarStateChange={onAvatarStateChange}
          />
        </div>
      )}

      {/* Chat Body */}
      {!isMinimized && (
        <AIChatBox
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={chatMutation.isPending}
          placeholder="Parle-moi... note, idée, question..."
          height="100%"
          emptyStateMessage="Salut ! Je suis ton assistant Life-Command. Dis-moi ce que tu as en tête, ou utilise les raccourcis au dessus ⚡"
          suggestedPrompts={SUGGESTED_PROMPTS}
          className="border-none shadow-none rounded-none flex-1"
        />
      )}
    </div>
  );
}
