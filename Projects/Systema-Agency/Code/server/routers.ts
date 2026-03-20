import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
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
});

export type AppRouter = typeof appRouter;
