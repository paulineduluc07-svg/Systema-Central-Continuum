export interface GenerateReplyInput {
  userMessage: string;
  memorySummary: string;
  toolSummary?: string;
}

type FallbackReason = "missing_openai_key" | "llm_http_error" | "llm_parse_error" | "llm_network_error";

function fallbackReply(input: GenerateReplyInput, reason: FallbackReason): string {
  const baseByReason: Record<FallbackReason, string> = {
    missing_openai_key: "Je suis Kim. Mode local actif pour le moment (cle OpenAI absente).",
    llm_http_error: "Je suis Kim. Mode local actif temporairement (service LLM indisponible).",
    llm_parse_error: "Je suis Kim. Mode local actif temporairement (reponse LLM non exploitable).",
    llm_network_error: "Je suis Kim. Mode local actif temporairement (erreur reseau vers le LLM)."
  };

  const base = baseByReason[reason];
  if (!input.toolSummary) {
    return `${base} Tu as dit: \"${input.userMessage}\".`;
  }

  return `${base} Outil: ${input.toolSummary}. Tu as dit: \"${input.userMessage}\".`;
}

function extractOutputText(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const asRecord = payload as Record<string, unknown>;

  if (typeof asRecord.output_text === "string" && asRecord.output_text.length > 0) {
    return asRecord.output_text;
  }

  const output = asRecord.output;
  if (!Array.isArray(output)) {
    return null;
  }

  for (const item of output) {
    if (typeof item !== "object" || item === null) {
      continue;
    }

    const message = item as Record<string, unknown>;
    const content = message.content;
    if (!Array.isArray(content)) {
      continue;
    }

    for (const block of content) {
      if (typeof block !== "object" || block === null) {
        continue;
      }

      const asBlock = block as Record<string, unknown>;
      if (asBlock.type === "output_text" && typeof asBlock.text === "string" && asBlock.text.trim().length > 0) {
        return asBlock.text;
      }
    }
  }

  return null;
}

export async function generateKimReply(input: GenerateReplyInput): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

  if (!apiKey) {
    return fallbackReply(input, "missing_openai_key");
  }

  const systemPrompt = [
    "Tu es Kim, un agent IA ultra-competent, concret et fiable.",
    "Sois concise, utile, stable et orientee execution.",
    "Respecte strictement les limites de securite et de consentement.",
    "Ne pretends jamais avoir execute une action externe si ce n'est pas confirme."
  ].join(" ");

  const userPrompt = [
    `Message utilisateur: ${input.userMessage}`,
    `Memoire recente:\n${input.memorySummary || "(vide)"}`,
    `Contexte outil: ${input.toolSummary ?? "aucun"}`
  ].join("\n\n");

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: systemPrompt }]
          },
          {
            role: "user",
            content: [{ type: "input_text", text: userPrompt }]
          }
        ],
        max_output_tokens: 300
      })
    });

    if (!response.ok) {
      return fallbackReply(input, "llm_http_error");
    }

    const payload = (await response.json()) as unknown;
    const output = extractOutputText(payload);
    if (!output || output.trim().length === 0) {
      return fallbackReply(input, "llm_parse_error");
    }

    return output.trim();
  } catch {
    return fallbackReply(input, "llm_network_error");
  }
}
