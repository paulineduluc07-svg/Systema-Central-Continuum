import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import type { Message as LLMMessage } from "./_core/llm";
import { z } from "zod";
import * as db from "./db";

// Life-Command AI System Prompt
const LIFE_COMMAND_SYSTEM_PROMPT = `Tu es l'assistant Life-Command, un compagnon IA personnel qui aide l'utilisateur à organiser ses pensées, idées, notes et projets.

Tu es intégré dans l'application Systema Agency — un tableau de bord interactif avec des widgets, un whiteboard, et des outils de productivité.

Tes capacités :
- Répondre aux questions et discuter de manière naturelle en français
- Aider à organiser les idées et projets
- Catégoriser automatiquement le contenu dans ces catégories : Science, Technologie, Histoire, Philosophie, Mathématiques, Santé, Économie, Psychologie, Langues, Art, Autre
- Résumer des textes et extraire les concepts clés
- Proposer des actions concrètes et des prochaines étapes
- Aider à la réflexion et au brainstorming

Ton style :
- Tu es chaleureux, enthousiaste et encourageant
- Tu utilises des emojis de manière naturelle (pas excessive)
- Tu es concis mais utile
- Tu t'adaptes au contexte de la conversation
- Tu suggères proactivement comment organiser l'information

Quand l'utilisateur partage du contenu (texte, idée, note, bookmark), tu dois :
1. Comprendre le contenu
2. Proposer une catégorie
3. Extraire 3-5 concepts clés
4. Résumer en 1-2 phrases
5. Suggérer où le ranger visuellement`;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Tasks API
  tasks: router({
    list: protectedProcedure
      .input(z.object({ tabId: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getTasksByUserAndTab(ctx.user.id, input.tabId);
      }),
    
    listAll: protectedProcedure.query(async ({ ctx }) => {
      return db.getAllTasksByUser(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        tabId: z.string(),
        title: z.string(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createTask({
          userId: ctx.user.id,
          tabId: input.tabId,
          title: input.title,
          sortOrder: input.sortOrder ?? 0,
          completed: false,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        completed: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateTask(id, ctx.user.id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteTask(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // Notes API
  notes: router({
    list: protectedProcedure
      .input(z.object({ tabId: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getNotesByUserAndTab(ctx.user.id, input.tabId);
      }),
    
    listAll: protectedProcedure.query(async ({ ctx }) => {
      return db.getAllNotesByUser(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        tabId: z.string(),
        content: z.string(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createNote({
          userId: ctx.user.id,
          tabId: input.tabId,
          content: input.content,
          sortOrder: input.sortOrder ?? 0,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        content: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateNote(id, ctx.user.id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteNote(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // User Preferences API
  preferences: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserPreferences(ctx.user.id);
    }),

    update: protectedProcedure
      .input(z.object({
        darkMode: z.boolean().optional(),
        widgetOrder: z.string().optional(), // JSON string
        tabConfig: z.string().optional(), // JSON string
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertUserPreferences(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // Migration API - Import local data to cloud
  migration: router({
    // Check if user has any cloud data (to determine if migration is needed)
    hasCloudData: protectedProcedure.query(async ({ ctx }) => {
      const tasks = await db.getAllTasksByUser(ctx.user.id);
      const notes = await db.getAllNotesByUser(ctx.user.id);
      return {
        hasTasks: tasks.length > 0,
        hasNotes: notes.length > 0,
        hasData: tasks.length > 0 || notes.length > 0,
      };
    }),

    // Bulk import tasks from localStorage
    importTasks: protectedProcedure
      .input(z.object({
        tasks: z.array(z.object({
          tabId: z.string(),
          title: z.string(),
          completed: z.boolean(),
          sortOrder: z.number(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        let imported = 0;
        for (const task of input.tasks) {
          await db.createTask({
            userId: ctx.user.id,
            tabId: task.tabId,
            title: task.title,
            completed: task.completed,
            sortOrder: task.sortOrder,
          });
          imported++;
        }
        return { success: true, imported };
      }),

    // Bulk import notes from localStorage
    importNotes: protectedProcedure
      .input(z.object({
        notes: z.array(z.object({
          tabId: z.string(),
          content: z.string(),
          sortOrder: z.number(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        let imported = 0;
        for (const note of input.notes) {
          await db.createNote({
            userId: ctx.user.id,
            tabId: note.tabId,
            content: note.content,
            sortOrder: note.sortOrder,
          });
          imported++;
        }
        return { success: true, imported };
      }),

    // Import preferences
    importPreferences: protectedProcedure
      .input(z.object({
        darkMode: z.boolean().optional(),
        widgetOrder: z.string().optional(),
        tabConfig: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertUserPreferences(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // Custom Tabs API
  customTabs: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getCustomTabsByUser(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        tabId: z.string(),
        label: z.string(),
        color: z.string().optional(),
        icon: z.string().optional(),
        tabType: z.enum(["widgets", "whiteboard"]).optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createCustomTab({
          userId: ctx.user.id,
          tabId: input.tabId,
          label: input.label,
          color: input.color ?? "#FF69B4",
          icon: input.icon ?? "file",
          tabType: input.tabType ?? "whiteboard",
          sortOrder: input.sortOrder ?? 0,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        label: z.string().optional(),
        color: z.string().optional(),
        icon: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateCustomTab(id, ctx.user.id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteCustomTab(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // AI Chat API — Life-Command Agent
  ai: router({
    chat: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(["system", "user", "assistant"]),
          content: z.string(),
        })),
      }))
      .mutation(async ({ input }) => {
        // Build messages with system prompt
        const llmMessages: LLMMessage[] = [
          { role: "system", content: LIFE_COMMAND_SYSTEM_PROMPT },
          ...input.messages
            .filter(m => m.role !== "system") // Remove any client-side system messages
            .map(m => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            })),
        ];

        try {
          const result = await invokeLLM({ messages: llmMessages });
          const content = result.choices?.[0]?.message?.content;

          // Handle content that might be an array or string
          const textContent = typeof content === "string"
            ? content
            : Array.isArray(content)
              ? content.filter(c => c.type === "text").map(c => (c as { type: "text"; text: string }).text).join("")
              : "Désolé, je n'ai pas pu générer de réponse.";

          return {
            response: textContent,
            model: result.model,
            usage: result.usage,
          };
        } catch (error: any) {
          console.error("AI Chat error:", error);
          return {
            response: "❌ Désolé, une erreur est survenue. Vérifie que les clés API sont configurées dans le .env (BUILT_IN_FORGE_API_KEY).",
            model: "error",
            usage: null,
          };
        }
      }),

    // Categorize content for the Life-Command pipeline
    categorize: publicProcedure
      .input(z.object({
        content: z.string(),
        type: z.enum(["memo", "bookmark", "idea", "document", "photo"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const categorizationPrompt = `Analyse le contenu suivant et retourne un JSON avec cette structure exacte :
{
  "title": "titre court",
  "summary": "résumé en 1-2 phrases",
  "category": "une parmi: Science, Technologie, Histoire, Philosophie, Mathématiques, Santé, Économie, Psychologie, Langues, Art, Autre",
  "key_concepts": ["concept1", "concept2", "concept3"],
  "importance": "une parmi: Essentiel, Important, Utile, Référence",
  "suggested_action": "action suggérée"
}

Type de contenu: ${input.type || "memo"}
Contenu: ${input.content}`;

        const llmMessages: LLMMessage[] = [
          { role: "system", content: "Tu es un système de catégorisation intelligent. Réponds uniquement en JSON valide, sans markdown." },
          { role: "user", content: categorizationPrompt },
        ];

        try {
          const result = await invokeLLM({ messages: llmMessages });
          const content = result.choices?.[0]?.message?.content;
          const textContent = typeof content === "string" ? content : "";

          // Try to parse JSON from the response
          const jsonMatch = textContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return { success: true, data: parsed };
          }

          return { success: false, data: null };
        } catch (error: any) {
          console.error("Categorization error:", error);
          return { success: false, data: null };
        }
      }),
  }),

  // Canvas API
  canvas: router({
    get: protectedProcedure
      .input(z.object({ tabId: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getCanvasData(ctx.user.id, input.tabId);
      }),

    save: protectedProcedure
      .input(z.object({
        tabId: z.string(),
        data: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.saveCanvasData(ctx.user.id, input.tabId, input.data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ tabId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteCanvasData(ctx.user.id, input.tabId);
        return { success: true };
      }),
  }),

  // Drawn by Fate — Tarot Reading AI
  tarot: router({
    getReading: publicProcedure
      .input(z.object({
        question: z.string().optional(),
        subject: z.string().optional(),
        cards: z.array(z.object({
          name: z.string(),
          nameFr: z.string(),
          upright: z.string(),
          keywords: z.array(z.string()),
        })),
      }))
      .mutation(async ({ input }) => {
        const { question, subject, cards } = input;

        const contextParts: string[] = [];
        if (question) contextParts.push(`Question posée : "${question}"`);
        if (subject) contextParts.push(`Sujet choisi : ${subject}`);
        if (contextParts.length === 0) contextParts.push("Lecture libre sans question spécifique");

        const cardsList = cards
          .map((c, i) => `Carte ${i + 1} : ${c.nameFr} (${c.name}) — Signification : ${c.upright} — Mots-clés : ${c.keywords.join(", ")}`)
          .join("\n");

        const prompt = `Tu es un lecteur de tarot mystique, sage et bienveillant. Réalise une lecture de tarot en français pour la personne suivante :

${contextParts.join("\n")}

Cartes tirées :
${cardsList}

Réponds UNIQUEMENT en JSON valide avec cette structure exacte, sans markdown :
{
  "cardReadings": [
    {
      "cardName": "nom de la carte en français",
      "interpretation": "interprétation poétique et personnalisée de 2-3 phrases qui relie la signification de la carte directement au contexte de la personne"
    }
  ],
  "overallReading": "message global de 3-4 phrases qui synthétise le message de l'ensemble des cartes, écrit de façon mystique, poétique et bienveillante, en tutoyant la personne"
}

Règles importantes :
- Parle directement à la personne (tu/toi/ton/ta)
- Sois poétique, mystique, mais concret et utile
- Relie chaque carte à la situation spécifique
- Le message global doit donner espoir et guidance
- N'écris rien en dehors du JSON`;

        const llmMessages: LLMMessage[] = [
          {
            role: "system",
            content: "Tu es un lecteur de tarot mystique et bienveillant. Tu réponds toujours en JSON valide uniquement, sans markdown ni texte supplémentaire.",
          },
          { role: "user", content: prompt },
        ];

        try {
          const result = await invokeLLM({ messages: llmMessages });
          const content = result.choices?.[0]?.message?.content;
          const textContent = typeof content === "string" ? content : "";

          // Extract JSON from response
          const jsonMatch = textContent.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error("No JSON found");
          const parsed = JSON.parse(jsonMatch[0]);

          return {
            cardReadings: parsed.cardReadings || [],
            overallReading: parsed.overallReading || "",
          };
        } catch {
          // Fallback: generate basic reading without AI
          return {
            cardReadings: cards.map((c) => ({
              cardName: c.nameFr,
              interpretation: `La carte ${c.nameFr} t'invite à méditer sur : ${c.upright}. Ses mots-clés — ${c.keywords.join(", ")} — résonnent dans ta situation actuelle.`,
            })),
            overallReading:
              "Les cartes ont parlé avec sagesse. Leur message t'appartient — lis-le avec le cœur ouvert et laisse le destin te guider sur ton chemin.",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
