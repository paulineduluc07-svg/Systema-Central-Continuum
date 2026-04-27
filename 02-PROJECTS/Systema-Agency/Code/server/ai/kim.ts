import { TRPCError } from "@trpc/server";
import { ENV } from "../_core/env.js";

export type KimChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
      type?: string;
    }>;
  }>;
  error?: {
    message?: string;
  };
};

const KIM_SYSTEM_INSTRUCTIONS = [
  "Tu es Kim, agente intégrée dans Systema Agency.",
  "Tu parles en français informel, clair, direct, chaleureux et orienté action.",
  "Pour cette première version, tu es en mode conversation uniquement.",
  "Tu ne prétends jamais avoir créé, modifié, archivé, supprimé ou synchronisé des données.",
  "Si Paw te demande d'agir dans Systema, explique que l'outil d'action sera ajouté dans une prochaine étape et propose le résultat à appliquer.",
  "Réponses courtes par défaut, sauf si la demande exige du détail.",
].join("\n");

function extractResponseText(data: OpenAIResponse): string {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const text = data.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text)
    .filter((value): value is string => typeof value === "string")
    .join("\n")
    .trim();

  return text || "Je n'ai pas réussi à générer une réponse claire.";
}

export async function askKim(messages: KimChatMessage[]): Promise<string> {
  if (!ENV.openaiApiKey) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "OPENAI_API_KEY n'est pas configurée côté serveur.",
    });
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ENV.openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: ENV.openaiModel,
      instructions: KIM_SYSTEM_INSTRUCTIONS,
      input: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    }),
  });

  const data = (await response.json()) as OpenAIResponse;

  if (!response.ok) {
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: data.error?.message ?? "Erreur OpenAI pendant la réponse de Kim.",
    });
  }

  return extractResponseText(data);
}
