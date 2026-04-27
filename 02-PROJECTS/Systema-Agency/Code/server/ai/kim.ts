import { TRPCError } from "@trpc/server";
import { ENV } from "../_core/env.js";
import * as db from "../db.js";

export type KimChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type KimAppliedAction = {
  type: "promptVault.addPrompt";
  title: string;
};

type KimAction =
  | {
      type: "promptVault.addPrompt";
      title: string;
      text: string;
      category?: string;
      tags?: string[];
    };

type KimModelPayload = {
  reply: string;
  actions?: KimAction[];
};

type PromptVaultCategory = {
  id: string;
  label: string;
  color: string;
};

type PromptVaultSnapshot = {
  list: Array<{ id: number; cat: string; title: string; tags: string[]; text: string }>;
  cats: PromptVaultCategory[];
  favs: number[];
  brightness: number;
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
  "Tu peux maintenant ajouter des prompts dans Prompt Vault quand Paw te le demande clairement.",
  "Tu ne peux pas encore modifier, archiver ou supprimer des éléments existants.",
  "Si Paw demande une action non disponible, dis-le clairement et propose une alternative.",
  "Si Paw demande d'ajouter un prompt mais ne donne pas assez de contenu, pose une question courte au lieu d'inventer.",
  "Réponses courtes par défaut, sauf si la demande exige du détail.",
  "Tu dois toujours répondre en JSON strict, sans markdown, avec la forme:",
  "{\"reply\":\"message pour Paw\",\"actions\":[{\"type\":\"promptVault.addPrompt\",\"title\":\"...\",\"text\":\"...\",\"category\":\"tech\",\"tags\":[\"tag\"]}]}",
  "Categories autorisées: tech, coaching, organisation, creativite, analyse, quotidien, clarte, apprentissage, finances, meta, neurodivers, communication.",
  "Si aucune action n'est nécessaire, utilise actions: [].",
].join("\n");

const PROMPT_VAULT_CATEGORIES = [
  { id: "all", label: "TOUS", color: "#00f5ff" },
  { id: "tech", label: "TECH/CODE", color: "#7bed9f" },
  { id: "coaching", label: "COACHING", color: "#eccc68" },
  { id: "organisation", label: "ORGANISATION", color: "#a29bfe" },
  { id: "creativite", label: "CRÉATIVITÉ", color: "#fd79a8" },
  { id: "analyse", label: "ANALYSE", color: "#55efc4" },
  { id: "quotidien", label: "QUOTIDIEN", color: "#ff9f7f" },
  { id: "clarte", label: "CLARTÉ", color: "#74b9ff" },
  { id: "apprentissage", label: "APPRENTISSAGE", color: "#ffd32a" },
  { id: "finances", label: "FINANCES", color: "#cd84f1" },
  { id: "meta", label: "META-PROMPT", color: "#ff5e57" },
  { id: "neurodivers", label: "NEURODIVERS", color: "#f8a5c2" },
  { id: "communication", label: "COMMUNICATION", color: "#badc58" },
];

const CATEGORY_IDS = new Set(PROMPT_VAULT_CATEGORIES.map((category) => category.id));

function parseKimPayload(rawText: string): KimModelPayload {
  try {
    const parsed = JSON.parse(rawText) as Partial<KimModelPayload>;
    return {
      reply: typeof parsed.reply === "string" && parsed.reply.trim()
        ? parsed.reply.trim()
        : rawText,
      actions: Array.isArray(parsed.actions)
        ? parsed.actions.filter((action): action is KimAction => (
            action?.type === "promptVault.addPrompt"
            && typeof action.title === "string"
            && typeof action.text === "string"
          ))
        : [],
    };
  } catch {
    return { reply: rawText, actions: [] };
  }
}

function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 8);
}

async function addPromptToVault(userId: number, action: KimAction): Promise<KimAppliedAction> {
  const title = action.title.trim().slice(0, 160);
  const text = action.text.trim().slice(0, 20_000);

  if (!title || !text) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Le prompt doit avoir un titre et un contenu.",
    });
  }

  const current = await db.getPromptVaultData(userId);
  let snapshot: PromptVaultSnapshot = {
    list: [],
    cats: PROMPT_VAULT_CATEGORIES,
    favs: [],
    brightness: 70,
  };

  if (current?.data) {
    try {
      const parsed = JSON.parse(current.data) as PromptVaultSnapshot;
      if (Array.isArray(parsed.list) && Array.isArray(parsed.cats)) {
        snapshot = {
          list: parsed.list,
          cats: parsed.cats,
          favs: Array.isArray(parsed.favs) ? parsed.favs : [],
          brightness: typeof parsed.brightness === "number" ? parsed.brightness : 70,
        };
      }
    } catch {
      // Keep safe default snapshot if existing data is not parseable.
    }
  }

  const availableCategoryIds = new Set(snapshot.cats.map((category) => category.id));
  const requestedCategory = action.category?.trim();
  const category = requestedCategory && CATEGORY_IDS.has(requestedCategory) && availableCategoryIds.has(requestedCategory)
    ? requestedCategory
    : "tech";

  const nextPrompt = {
    id: Date.now(),
    cat: category,
    title,
    tags: normalizeTags(action.tags),
    text,
  };

  const nextSnapshot = {
    ...snapshot,
    list: [...snapshot.list, nextPrompt],
  };

  await db.upsertPromptVaultData(userId, JSON.stringify(nextSnapshot));

  return {
    type: "promptVault.addPrompt",
    title,
  };
}

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

export async function askKim(
  userId: number,
  messages: KimChatMessage[],
): Promise<{ reply: string; appliedActions: KimAppliedAction[] }> {
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

  const payload = parseKimPayload(extractResponseText(data));
  const appliedActions: KimAppliedAction[] = [];

  for (const action of payload.actions ?? []) {
    if (action.type === "promptVault.addPrompt") {
      appliedActions.push(await addPromptToVault(userId, action));
    }
  }

  return {
    reply: payload.reply,
    appliedActions,
  };
}
