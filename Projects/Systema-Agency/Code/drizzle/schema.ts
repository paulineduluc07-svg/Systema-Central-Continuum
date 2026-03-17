import { integer, pgEnum, pgTable, text, timestamp, varchar, boolean, serial } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const tabTypeEnum = pgEnum("tabType", ["widgets", "whiteboard"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  tabId: varchar("tabId", { length: 64 }).notNull(),
  title: text("title").notNull(),
  completed: boolean("completed").default(false).notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  tabId: varchar("tabId", { length: 64 }).notNull(),
  content: text("content").notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().unique(),
  darkMode: boolean("darkMode").default(false).notNull(),
  widgetOrder: text("widgetOrder"),
  tabConfig: text("tabConfig"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = typeof userPreferences.$inferInsert;

export const customTabs = pgTable("custom_tabs", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  tabId: varchar("tabId", { length: 64 }).notNull(),
  label: varchar("label", { length: 128 }).notNull(),
  color: varchar("color", { length: 32 }).default("#FF69B4").notNull(),
  icon: varchar("icon", { length: 64 }).default("file").notNull(),
  tabType: tabTypeEnum("tabType").default("whiteboard").notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CustomTab = typeof customTabs.$inferSelect;
export type InsertCustomTab = typeof customTabs.$inferInsert;

export const canvasData = pgTable("canvas_data", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  tabId: varchar("tabId", { length: 64 }).notNull(),
  data: text("data"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CanvasData = typeof canvasData.$inferSelect;
export type InsertCanvasData = typeof canvasData.$inferInsert;
