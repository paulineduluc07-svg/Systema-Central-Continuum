export interface GenerateReplyInput {
  userMessage: string;
  memorySummary: string;
  toolSummary?: string;
}

function fallbackReply(input: GenerateReplyInput): string {
  const base = "Je suis Kim. J'ai bien recu ton message et je peux continuer en mode local tant que la cle OpenAI n'est pas configuree.";
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

  return null;
}

export async function generateKimReply(input: GenerateReplyInput): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

  if (!apiKey) {
    return fallbackReply(input);
  }

  const systemPrompt = [
    "Tu es Kim, un compagnon IA empathique et concret.",
    "Sois concise, utile et stable.",
    "Respecte strictement les limites de securite et de consentement.",
    "Ne pretends jamais avoir execute une action externe si ce n'est pas confirme."
  ].join(" ");

  const userPrompt = [
    `Message utilisateur: ${input.userMessage}`,
    `Memoire recente:\n${input.memorySummary || "(vide)"}`,
    `Contexte outil: ${input.toolSummary ?? "aucun"}`
  ].join("\n\n");

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
    return fallbackReply(input);
  }

  const payload = (await response.json()) as unknown;
  const output = extractOutputText(payload);

  return output && output.trim().length > 0 ? output.trim() : fallbackReply(input);
}