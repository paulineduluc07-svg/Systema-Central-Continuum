import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { InsertUser, users, tasks, notes, userPreferences, InsertTask, InsertNote, InsertUserPreferences } from "../drizzle/schema.js";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL);
      _db = drizzle(sql);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============== TASKS ==============

export async function getTasksByUserAndTab(userId: number, tabId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tasks)
    .where(and(eq(tasks.userId, userId), eq(tasks.tabId, tabId)))
    .orderBy(tasks.sortOrder);
}

export async function getAllTasksByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(tasks.sortOrder);
}

export async function replaceTasksByUser(userId: number, taskEntries: Omit<InsertTask, "userId">[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.transaction(async (tx) => {
    await tx.delete(tasks).where(eq(tasks.userId, userId));
    if (taskEntries.length > 0) {
      await tx.insert(tasks).values(taskEntries.map((task) => ({ ...task, userId })));
    }
  });
}

export async function createTask(task: InsertTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tasks).values(task).returning();
  return result[0];
}

export async function updateTask(id: number, userId: number, data: Partial<InsertTask>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(tasks).set(data).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
}

export async function deleteTask(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
}

// ============== NOTES ==============

export async function getNotesByUserAndTab(userId: number, tabId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notes)
    .where(and(eq(notes.userId, userId), eq(notes.tabId, tabId)))
    .orderBy(notes.sortOrder);
}

export async function getAllNotesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notes).where(eq(notes.userId, userId)).orderBy(notes.sortOrder);
}

export async function replaceNotesByUser(userId: number, noteEntries: Omit<InsertNote, "userId">[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.transaction(async (tx) => {
    await tx.delete(notes).where(eq(notes.userId, userId));
    if (noteEntries.length > 0) {
      await tx.insert(notes).values(noteEntries.map((note) => ({ ...note, userId })));
    }
  });
}

export async function createNote(note: InsertNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(notes).values(note).returning();
  return result[0];
}

export async function updateNote(id: number, userId: number, data: Partial<InsertNote>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notes).set(data).where(and(eq(notes.id, id), eq(notes.userId, userId)));
}

export async function deleteNote(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(notes).where(and(eq(notes.id, id), eq(notes.userId, userId)));
}

// ============== USER PREFERENCES ==============

export async function getUserPreferences(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function upsertUserPreferences(userId: number, prefs: Partial<InsertUserPreferences>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(userPreferences)
    .values({ userId, darkMode: false, ...prefs })
    .onConflictDoUpdate({
      target: userPreferences.userId,
      set: prefs,
    });
}

// ============== CUSTOM TABS ==============

import { customTabs, canvasData, InsertCustomTab, InsertCanvasData } from "../drizzle/schema.js";

export async function getCustomTabsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(customTabs).where(eq(customTabs.userId, userId)).orderBy(customTabs.sortOrder);
}

export async function createCustomTab(tab: InsertCustomTab) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(customTabs).values(tab).returning();
  return result[0];
}

export async function updateCustomTab(id: number, userId: number, data: Partial<InsertCustomTab>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(customTabs).set(data).where(and(eq(customTabs.id, id), eq(customTabs.userId, userId)));
}

export async function updateCustomTabByTabId(tabId: string, userId: number, data: Partial<InsertCustomTab>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(customTabs).set(data).where(and(eq(customTabs.tabId, tabId), eq(customTabs.userId, userId)));
}

export async function deleteCustomTab(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(customTabs).where(and(eq(customTabs.id, id), eq(customTabs.userId, userId)));
}

export async function deleteCustomTabByTabId(tabId: string, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(customTabs).where(and(eq(customTabs.tabId, tabId), eq(customTabs.userId, userId)));
}

// ============== CANVAS DATA ==============

export async function getCanvasData(userId: number, tabId: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(canvasData)
    .where(and(eq(canvasData.userId, userId), eq(canvasData.tabId, tabId)))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function saveCanvasData(userId: number, tabId: string, data: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(canvasData)
    .values({ userId, tabId, data })
    .onConflictDoUpdate({
      target: [canvasData.userId, canvasData.tabId],
      set: { data },
    });
}

export async function deleteCanvasData(userId: number, tabId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(canvasData).where(and(eq(canvasData.userId, userId), eq(canvasData.tabId, tabId)));
}


// ============== PROMPT VAULT ==============

import { agendaWeekData, promptVaultData } from "../drizzle/schema.js";

export async function getPromptVaultData(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(promptVaultData)
    .where(eq(promptVaultData.userId, userId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function upsertPromptVaultData(userId: number, data: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(promptVaultData)
    .values({ userId, data })
    .onConflictDoUpdate({
      target: promptVaultData.userId,
      set: { data, updatedAt: new Date() },
    });
}

export async function deletePromptVaultData(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(promptVaultData).where(eq(promptVaultData.userId, userId));
}

// ============== AGENDA WEEK DATA ==============

export async function getAgendaWeekData(userId: number, weekStart: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(agendaWeekData)
    .where(and(eq(agendaWeekData.userId, userId), eq(agendaWeekData.weekStart, weekStart)))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function upsertAgendaWeekData(userId: number, weekStart: string, data: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(agendaWeekData)
    .values({ userId, weekStart, data })
    .onConflictDoUpdate({
      target: [agendaWeekData.userId, agendaWeekData.weekStart],
      set: { data, updatedAt: new Date() },
    });
}

// ============== HOME DATA ==============

import { homeData } from "../drizzle/schema.js";

export async function getHomeData(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(homeData)
    .where(eq(homeData.userId, userId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function upsertHomeData(userId: number, data: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(homeData)
    .values({ userId, data })
    .onConflictDoUpdate({
      target: homeData.userId,
      set: { data, updatedAt: new Date() },
    });
}

// ============== FLOATING NOTES ==============

import { floatingNotes, InsertFloatingNote } from "../drizzle/schema.js";

export async function listActiveFloatingNotes(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(floatingNotes)
    .where(and(eq(floatingNotes.userId, userId), eq(floatingNotes.archived, false)))
    .orderBy(floatingNotes.createdAt);
}

export async function listArchivedFloatingNotes(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(floatingNotes)
    .where(and(eq(floatingNotes.userId, userId), eq(floatingNotes.archived, true)))
    .orderBy(desc(floatingNotes.archivedAt));
}

export async function createFloatingNote(note: InsertFloatingNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(floatingNotes).values(note).returning();
  return result[0];
}

export async function updateFloatingNote(id: number, userId: number, data: Partial<InsertFloatingNote>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(floatingNotes)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(floatingNotes.id, id), eq(floatingNotes.userId, userId)));
}

export async function archiveFloatingNote(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const now = new Date();
  await db.update(floatingNotes)
    .set({ archived: true, archivedAt: now, updatedAt: now })
    .where(and(eq(floatingNotes.id, id), eq(floatingNotes.userId, userId)));
}

export async function restoreFloatingNote(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(floatingNotes)
    .set({ archived: false, archivedAt: null, updatedAt: new Date() })
    .where(and(eq(floatingNotes.id, id), eq(floatingNotes.userId, userId)));
}

export async function deleteFloatingNote(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(floatingNotes).where(and(eq(floatingNotes.id, id), eq(floatingNotes.userId, userId)));
}
