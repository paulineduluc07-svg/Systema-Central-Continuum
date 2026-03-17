import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { InsertUser, users, tasks, notes, userPreferences, InsertTask, InsertNote, InsertUserPreferences } from "../drizzle/schema";

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

export async function createTask(task: InsertTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tasks).values(task).returning({ id: tasks.id });
  return { id: result[0].id, ...task };
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

export async function createNote(note: InsertNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(notes).values(note).returning({ id: notes.id });
  return { id: result[0].id, ...note };
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

import { customTabs, canvasData, InsertCustomTab, InsertCanvasData } from "../drizzle/schema";

export async function getCustomTabsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(customTabs).where(eq(customTabs.userId, userId)).orderBy(customTabs.sortOrder);
}

export async function createCustomTab(tab: InsertCustomTab) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(customTabs).values(tab).returning({ id: customTabs.id });
  return { id: result[0].id, ...tab };
}

export async function updateCustomTab(id: number, userId: number, data: Partial<InsertCustomTab>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(customTabs).set(data).where(and(eq(customTabs.id, id), eq(customTabs.userId, userId)));
}

export async function deleteCustomTab(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(customTabs).where(and(eq(customTabs.id, id), eq(customTabs.userId, userId)));
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
