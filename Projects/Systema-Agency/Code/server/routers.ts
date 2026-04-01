import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { sdk } from "./_core/sdk";
import { ENV } from "./_core/env";
import { z } from "zod";
import * as db from "./db";

const PROMPT_VAULT_MAX_PAYLOAD_CHARS = 1_000_000;
const SUIVI_MAX_ENTRIES_PER_REPLACE = 2_000;
const SUIVI_MAX_REASONS_PER_ENTRY = 30;
const SUIVI_MAX_REASON_LENGTH = 160;
const SUIVI_MAX_NOTE_LENGTH = 5_000;
const DATE_ISO_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_24H_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const promptVaultDataSchema = z
  .string()
  .max(
    PROMPT_VAULT_MAX_PAYLOAD_CHARS,
    `Le snapshot Prompt Vault depasse la limite (${PROMPT_VAULT_MAX_PAYLOAD_CHARS} caracteres).`,
  )
  .refine((value) => {
    try {
      const parsed = JSON.parse(value) as unknown;
      return parsed !== null && typeof parsed === "object";
    } catch {
      return false;
    }
  }, "Le snapshot Prompt Vault doit etre un JSON valide.");

const suiviEntryInputSchema = z.object({
  timestamp: z.string().datetime({ offset: true }),
  date: z.string().regex(DATE_ISO_REGEX, "La date doit etre au format YYYY-MM-DD."),
  prise: z.string().regex(TIME_24H_REGEX, "L'heure doit etre au format HH:mm."),
  dose: z.number().int().min(1).max(1_000),
  reasons: z
    .array(z.string().trim().min(1).max(SUIVI_MAX_REASON_LENGTH))
    .max(SUIVI_MAX_REASONS_PER_ENTRY),
  note: z.string().max(SUIVI_MAX_NOTE_LENGTH),
});

export const appRouter = router({
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),

    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const valid = sdk.verifyCredentials(input.email, input.password);
        if (!valid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Email ou mot de passe incorrect",
          });
        }

        // Ensure owner user exists in DB
        const openId = ENV.ownerEmail.toLowerCase().trim();
        let user = await db.getUserByOpenId(openId);
        if (!user) {
          await db.upsertUser({
            openId,
            email: openId,
            loginMethod: "password",
            lastSignedIn: new Date(),
          });
          user = await db.getUserByOpenId(openId);
        }

        if (!user) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erreur lors de la creation du compte" });
        }

        const sessionToken = await sdk.createSessionToken(openId, {
          name: user.name ?? openId,
          expiresInMs: ONE_YEAR_MS,
        });

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        return { success: true } as const;
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
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
        widgetOrder: z.string().optional(),
        tabConfig: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertUserPreferences(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // Migration API
  migration: router({
    hasCloudData: protectedProcedure.query(async ({ ctx }) => {
      const tasks = await db.getAllTasksByUser(ctx.user.id);
      const notes = await db.getAllNotesByUser(ctx.user.id);
      return {
        hasTasks: tasks.length > 0,
        hasNotes: notes.length > 0,
        hasData: tasks.length > 0 || notes.length > 0,
      };
    }),

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

  // Prompt Vault API
  promptVault: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return db.getPromptVaultData(ctx.user.id);
    }),

    save: protectedProcedure
      .input(z.object({
        data: promptVaultDataSchema,
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertPromptVaultData(ctx.user.id, input.data);
        return { success: true };
      }),
  }),

  // Suivi medicament API
  suivi: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const rows = await db.getSuiviEntriesByUser(ctx.user.id);
      return rows.map((r) => ({
        id: r.id,
        timestamp: r.timestamp.toISOString(),
        date: r.date,
        prise: r.prise,
        dose: r.dose,
        reasons: JSON.parse(r.reasons) as string[],
        note: r.note,
      }));
    }),

    add: protectedProcedure
      .input(suiviEntryInputSchema)
      .mutation(async ({ ctx, input }) => {
        const result = await db.createSuiviEntry({
          userId: ctx.user.id,
          timestamp: new Date(input.timestamp),
          date: input.date,
          prise: input.prise,
          dose: input.dose,
          reasons: JSON.stringify(input.reasons),
          note: input.note,
        });
        return { id: result.id };
      }),

    replace: protectedProcedure
      .input(z.object({
        entries: z.array(suiviEntryInputSchema).max(SUIVI_MAX_ENTRIES_PER_REPLACE),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.replaceSuiviEntries(
          ctx.user.id,
          input.entries.map((e) => ({
            timestamp: new Date(e.timestamp),
            date: e.date,
            prise: e.prise,
            dose: e.dose,
            reasons: JSON.stringify(e.reasons),
            note: e.note,
          })),
        );
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
