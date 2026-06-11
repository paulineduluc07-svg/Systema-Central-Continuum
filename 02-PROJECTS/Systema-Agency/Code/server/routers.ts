import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const.js";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies.js";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc.js";
import { sdk } from "./_core/sdk.js";
import { ENV } from "./_core/env.js";
import { z } from "zod";
import * as db from "./db.js";

const PROMPT_VAULT_MAX_PAYLOAD_CHARS = 1_000_000;
const DATE_ISO_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const AGENDA_WEEK_MAX_PAYLOAD_CHARS = 500_000;
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

const agendaWeekDataSchema = z
  .string()
  .max(
    AGENDA_WEEK_MAX_PAYLOAD_CHARS,
    `La semaine Agenda depasse la limite (${AGENDA_WEEK_MAX_PAYLOAD_CHARS} caracteres).`,
  )
  .refine((value) => {
    try {
      const parsed = JSON.parse(value) as unknown;
      return parsed !== null && typeof parsed === "object";
    } catch {
      return false;
    }
  }, "La semaine Agenda doit etre un JSON valide.");

const FLOATING_NOTE_TITLE_MAX = 200;
const FLOATING_NOTE_BODY_MAX = 20_000;
const FLOATING_NOTE_CHECKLIST_MAX_ITEMS = 100;
const FLOATING_NOTE_CHECKLIST_TEXT_MAX = 500;
const FLOATING_NOTE_BOARD_MAX = 20_000;
const FLOATING_NOTE_SIZE_MAX = 2_000;

const floatingNoteAccentSchema = z.enum(["pink", "violet", "lavender", "cyan", "mint"]);
const floatingNoteStyleSchema = z.enum(["neon", "frost", "holo"]).nullable();
const floatingNoteKindSchema = z.enum(["note", "task"]);
const floatingNoteChecklistSchema = z
  .array(z.object({
    text: z.string().max(FLOATING_NOTE_CHECKLIST_TEXT_MAX),
    done: z.boolean(),
  }))
  .max(FLOATING_NOTE_CHECKLIST_MAX_ITEMS);

const floatingNoteCreateSchema = z.object({
  kind: floatingNoteKindSchema.optional(),
  title: z.string().max(FLOATING_NOTE_TITLE_MAX).optional(),
  body: z.string().max(FLOATING_NOTE_BODY_MAX).optional(),
  checklist: floatingNoteChecklistSchema.optional(),
  x: z.number().int().min(-FLOATING_NOTE_BOARD_MAX).max(FLOATING_NOTE_BOARD_MAX),
  y: z.number().int().min(-FLOATING_NOTE_BOARD_MAX).max(FLOATING_NOTE_BOARD_MAX),
  w: z.number().int().min(180).max(FLOATING_NOTE_SIZE_MAX),
  h: z.number().int().min(160).max(FLOATING_NOTE_SIZE_MAX),
  accent: floatingNoteAccentSchema.optional(),
  style: floatingNoteStyleSchema.optional(),
});

const floatingNoteUpdateSchema = z.object({
  id: z.number().int(),
  kind: floatingNoteKindSchema.optional(),
  title: z.string().max(FLOATING_NOTE_TITLE_MAX).optional(),
  body: z.string().max(FLOATING_NOTE_BODY_MAX).optional(),
  checklist: floatingNoteChecklistSchema.optional(),
  x: z.number().int().min(-FLOATING_NOTE_BOARD_MAX).max(FLOATING_NOTE_BOARD_MAX).optional(),
  y: z.number().int().min(-FLOATING_NOTE_BOARD_MAX).max(FLOATING_NOTE_BOARD_MAX).optional(),
  w: z.number().int().min(180).max(FLOATING_NOTE_SIZE_MAX).optional(),
  h: z.number().int().min(160).max(FLOATING_NOTE_SIZE_MAX).optional(),
  accent: floatingNoteAccentSchema.optional(),
  style: floatingNoteStyleSchema.optional(),
});

type FloatingNoteDbRow = {
  id: number;
  kind: "note" | "task";
  title: string;
  body: string;
  checklist: string;
  x: number;
  y: number;
  w: number;
  h: number;
  accent: "pink" | "violet" | "lavender" | "cyan" | "mint";
  style: "neon" | "frost" | "holo" | null;
  archived: boolean;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function toFloatingNoteDto(row: FloatingNoteDbRow) {
  let checklist: { text: string; done: boolean }[] = [];
  try {
    const parsed = JSON.parse(row.checklist) as unknown;
    if (Array.isArray(parsed)) {
      checklist = parsed
        .filter((item): item is { text: unknown; done: unknown } =>
          typeof item === "object" && item !== null,
        )
        .map((item) => ({
          text: typeof item.text === "string" ? item.text : "",
          done: typeof item.done === "boolean" ? item.done : false,
        }));
    }
  } catch {
    checklist = [];
  }
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    body: row.body,
    checklist,
    x: row.x,
    y: row.y,
    w: row.w,
    h: row.h,
    accent: row.accent,
    style: row.style,
    archived: row.archived,
    archivedAt: row.archivedAt ? row.archivedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

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
        cycleJour1: z.string().optional(),
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

  // Cosmos Readings API (lectures agent affichées sur les cartes Cosmos)
  cosmosReadings: router({
    get: protectedProcedure
      .input(z.object({
        date: z.string().regex(DATE_ISO_REGEX, "La date doit etre au format YYYY-MM-DD."),
      }))
      .query(async ({ ctx, input }) => {
        const row = await db.getCosmosReading(ctx.user.id, input.date);
        if (!row?.data) return null;
        try {
          const parsed = JSON.parse(row.data) as unknown;
          if (parsed !== null && typeof parsed === "object" && "sections" in parsed) {
            return parsed as { sections: Record<string, { titre?: string; texte: string; updatedAt: string }> };
          }
        } catch { /* données corrompues → on ignore */ }
        return null;
      }),
  }),

  // Agenda API
  agenda: router({
    get: protectedProcedure
      .input(z.object({
        weekStart: z.string().regex(DATE_ISO_REGEX, "La date doit etre au format YYYY-MM-DD."),
      }))
      .query(async ({ ctx, input }) => {
        return db.getAgendaWeekData(ctx.user.id, input.weekStart);
      }),

    save: protectedProcedure
      .input(z.object({
        weekStart: z.string().regex(DATE_ISO_REGEX, "La date doit etre au format YYYY-MM-DD."),
        data: agendaWeekDataSchema,
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertAgendaWeekData(ctx.user.id, input.weekStart, input.data);
        return { success: true } as const;
      }),
  }),

  // Floating Notes API
  floatingNotes: router({
    listActive: protectedProcedure.query(async ({ ctx }) => {
      const rows = await db.listActiveFloatingNotes(ctx.user.id);
      return rows.map(toFloatingNoteDto);
    }),

    listArchived: protectedProcedure.query(async ({ ctx }) => {
      const rows = await db.listArchivedFloatingNotes(ctx.user.id);
      return rows.map(toFloatingNoteDto);
    }),

    create: protectedProcedure
      .input(floatingNoteCreateSchema)
      .mutation(async ({ ctx, input }) => {
        const kind = input.kind ?? "note";
        const row = await db.createFloatingNote({
          userId: ctx.user.id,
          kind,
          title: input.title ?? "",
          body: input.body ?? "",
          checklist: JSON.stringify(input.checklist ?? []),
          x: input.x,
          y: input.y,
          w: input.w,
          h: input.h,
          accent: input.accent ?? (kind === "task" ? "pink" : "lavender"),
          style: input.style ?? null,
        });
        return toFloatingNoteDto(row);
      }),

    update: protectedProcedure
      .input(floatingNoteUpdateSchema)
      .mutation(async ({ ctx, input }) => {
        const { id, checklist, ...rest } = input;
        const patch: Record<string, unknown> = { ...rest };
        if (checklist !== undefined) {
          patch.checklist = JSON.stringify(checklist);
        }
        await db.updateFloatingNote(id, ctx.user.id, patch);
        return { success: true } as const;
      }),

    archive: protectedProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ ctx, input }) => {
        await db.archiveFloatingNote(input.id, ctx.user.id);
        return { success: true } as const;
      }),

    restore: protectedProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ ctx, input }) => {
        await db.restoreFloatingNote(input.id, ctx.user.id);
        return { success: true } as const;
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteFloatingNote(input.id, ctx.user.id);
        return { success: true } as const;
      }),
  }),

});

export type AppRouter = typeof appRouter;
