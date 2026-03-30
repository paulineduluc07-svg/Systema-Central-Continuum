import { useMemo, useState } from "react";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

type AIChatBoxProps = {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  height?: string;
  emptyStateMessage?: string;
  suggestedPrompts?: string[];
};

export function AIChatBox({
  messages,
  onSendMessage,
  isLoading = false,
  placeholder = "Ecris ton message...",
  height = "420px",
  emptyStateMessage = "Pose ta premiere question.",
  suggestedPrompts = [],
}: AIChatBoxProps) {
  const [draft, setDraft] = useState("");

  const visibleMessages = useMemo(
    () => messages.filter((message) => message.role !== "system"),
    [messages]
  );

  const submit = () => {
    const value = draft.trim();
    if (!value || isLoading) return;
    onSendMessage(value);
    setDraft("");
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground overflow-hidden">
      <div
        className="p-4 space-y-3 overflow-y-auto"
        style={{ height }}
      >
        {visibleMessages.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyStateMessage}</p>
        ) : (
          visibleMessages.map((message, index) => {
            const isUser = message.role === "user";
            return (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                  isUser
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {message.content}
              </div>
            );
          })
        )}

        {isLoading ? (
          <div className="max-w-[85%] rounded-lg px-3 py-2 text-sm bg-muted text-foreground">
            ...
          </div>
        ) : null}
      </div>

      {suggestedPrompts.length > 0 ? (
        <div className="px-3 pt-2 pb-0 flex flex-wrap gap-2 border-t bg-background/50">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                if (isLoading) return;
                onSendMessage(prompt);
              }}
              className="text-xs rounded-full border px-2.5 py-1 hover:bg-accent transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      ) : null}

      <div className="p-3 border-t bg-background">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            rows={2}
            placeholder={placeholder}
            className="flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            onClick={submit}
            disabled={isLoading || !draft.trim()}
            className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
