import { integer, pgEnum, pgTable, text, timestamp, varchar, boolean, serial } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const tabTypeEnum = pgEnum("tabType", ["widgets", "whiteboard"]);
export const floatingNoteAccentEnum = pgEnum("floatingNoteAccent", ["pink", "violet", "lavender", "cyan", "mint"]);
export const floatingNoteStyleEnum = pgEnum("floatingNoteStyle", ["neon", "frost", "holo"]);
export const floatingNoteKindEnum = pgEnum("floatingNoteKind", ["note", "task"]);

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
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
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
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  tabId: varchar("tabId", { length: 64 }).notNull(),
  data: text("data"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CanvasData = typeof canvasData.$inferSelect;
export type InsertCanvasData = typeof canvasData.$inferInsert;

export const suiviEntries = pgTable("suivi_entries", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  timestamp: timestamp("timestamp").notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  prise: varchar("prise", { length: 5 }).notNull(),
  dose: integer("dose").notNull(),
  reasons: text("reasons").notNull().default("[]"),
  note: text("note").notNull().default(""),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SuiviEntryRow = typeof suiviEntries.$inferSelect;
export type InsertSuiviEntry = typeof suiviEntries.$inferInsert;

export const promptVaultData = pgTable("prompt_vault_data", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  data: text("data").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type PromptVaultDataRow = typeof promptVaultData.$inferSelect;
export type InsertPromptVaultData = typeof promptVaultData.$inferInsert;

export const agendaWeekData = pgTable("agenda_week_data", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  weekStart: varchar("weekStart", { length: 10 }).notNull(),
  data: text("data").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type AgendaWeekDataRow = typeof agendaWeekData.$inferSelect;
export type InsertAgendaWeekData = typeof agendaWeekData.$inferInsert;

export const floatingNotes = pgTable("floating_notes", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  kind: floatingNoteKindEnum("kind").notNull().default("note"),
  title: text("title").notNull().default(""),
  body: text("body").notNull().default(""),
  checklist: text("checklist").notNull().default("[]"),
  x: integer("x").notNull().default(120),
  y: integer("y").notNull().default(120),
  w: integer("w").notNull().default(240),
  h: integer("h").notNull().default(220),
  accent: floatingNoteAccentEnum("accent").notNull().default("pink"),
  style: floatingNoteStyleEnum("style"),
  archived: boolean("archived").notNull().default(false),
  archivedAt: timestamp("archivedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type FloatingNoteRow = typeof floatingNotes.$inferSelect;
export type InsertFloatingNote = typeof floatingNotes.$inferInsert;

export const homeData = pgTable("home_data", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  data: text("data").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type HomeDataRow = typeof homeData.$inferSelect;
export type InsertHomeData = typeof homeData.$inferInsert;
