import { AIChatBox, type Message } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Je suis là, Paw. Pour cette première version, je peux réfléchir avec toi dans Systema, mais je ne modifie pas encore tes notes ou tes tâches.",
  },
];

type KimClientMessage = {
  role: "user" | "assistant";
  content: string;
};

function isChatMessage(
  message: Message
): message is KimClientMessage {
  return message.role === "user" || message.role === "assistant";
}

export default function Kim() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const utils = trpc.useUtils();

  const chatMutation = trpc.ai.chat.useMutation({
    onSuccess: (data) => {
      void utils.promptVault.get.invalidate();
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: [
            data.reply,
            ...data.appliedActions.map((action) => (
              action.type === "promptVault.addPrompt"
                ? `\nAjouté dans Prompt Vault : ${action.title}`
                : ""
            )),
          ].filter(Boolean).join("\n"),
        },
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const sendMessage = (content: string) => {
    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content },
    ];

    setMessages(nextMessages);
    chatMutation.mutate({
      messages: nextMessages
        .filter(isChatMessage)
        .map((message) => ({
          role: message.role,
          content: message.content,
        })),
    });
  };

  return (
    <main className="-mt-20 min-h-screen bg-cover bg-center bg-no-repeat px-4 pb-10 pt-28 sm:px-6 lg:px-8"
      style={{ backgroundImage: "url(/backgrounds/main-v2.jpg)" }}
    >
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="rounded-[2rem] border border-white/35 bg-white/20 p-6 text-white shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/35 bg-white/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-white/70">Systema Agent</p>
              <h1 className="text-3xl font-semibold tracking-tight">Kim</h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80">
            Passe 1 : conversation active seulement. Les outils pour créer et modifier dans Systema seront ajoutés une étape à la fois.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/35 bg-white/70 p-3 shadow-2xl backdrop-blur-xl">
          <AIChatBox
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={chatMutation.isPending}
            height="min(58vh, 560px)"
            placeholder="Parle à Kim..."
            suggestedPrompts={[
              "Aide-moi à organiser mes idées pour aujourd'hui.",
              "Transforme cette idée en plan simple.",
              "Explique-moi comment tu vas pouvoir agir dans Systema plus tard.",
            ]}
          />
        </div>
      </section>
    </main>
  );
}
