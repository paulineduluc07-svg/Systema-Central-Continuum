import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import * as db from "../db.js";
import { resolveMcpUserId } from "./auth.js";

export const MCP_VERSION = "0.3.1";
export const DOC_FILES = ["README.md", "TODO.md", "NOTES.md", "WORKLOG.md"] as const;
export const WRITE_TOOL_NAMES = [
  "create_task",
  "update_task",
  "complete_task",
  "delete_task",
  "create_note",
  "update_note",
  "delete_note",
  "create_floating_note",
  "update_floating_note",
  "archive_floating_note",
  "create_tab",
  "update_tab",
  "delete_tab",
  "set_home_news",
  "set_home_projects",
] as const;

type DocFile = (typeof DOC_FILES)[number];

const DEFAULT_REMOTE_DOCS_BASE_URL =
  "https://raw.githubusercontent.com/paulineduluc07-svg/Systema-Central-Continuum/main/02-PROJECTS/Systema-Agency";
const FLOATING_NOTE_TITLE_MAX = 200;
const FLOATING_NOTE_BODY_MAX = 20_000;
const FLOATING_NOTE_CHECKLIST_MAX_ITEMS = 100;
const FLOATING_NOTE_CHECKLIST_TEXT_MAX = 500;
const FLOATING_NOTE_BOARD_MAX = 20_000;
const FLOATING_NOTE_SIZE_MAX = 2_000;

const successOutputSchema = z.object({ success: z.boolean() });
const dateStringSchema = z.string();
const taskSchema = z.object({
  id: z.number(),
  tabId: z.string(),
  title: z.string(),
  completed: z.boolean(),
  sortOrder: z.number(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});
const noteSchema = z.object({
  id: z.number(),
  tabId: z.string(),
  content: z.string(),
  sortOrder: z.number(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});
const floatingNoteAccentSchema = z.enum(["pink", "violet", "lavender", "cyan", "mint"]);
const floatingNoteStyleSchema = z.enum(["neon", "frost", "holo"]).nullable();
const floatingNoteKindSchema = z.enum(["note", "task"]);
const floatingNoteChecklistSchema = z
  .array(
    z.object({
      text: z.string().max(FLOATING_NOTE_CHECKLIST_TEXT_MAX),
      done: z.boolean(),
    })
  )
  .max(FLOATING_NOTE_CHECKLIST_MAX_ITEMS);
const floatingNoteSchema = z.object({
  id: z.number(),
  kind: floatingNoteKindSchema,
  title: z.string(),
  body: z.string(),
  checklist: floatingNoteChecklistSchema,
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  accent: floatingNoteAccentSchema,
  style: floatingNoteStyleSchema,
  archived: z.boolean(),
  archivedAt: z.string().nullable(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});
const tabSchema = z.object({
  id: z.number(),
  tabId: z.string(),
  label: z.string(),
  color: z.string(),
  icon: z.string(),
  tabType: z.enum(["widgets", "whiteboard"]),
  sortOrder: z.number(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});
const taskPatchSchema = z
  .object({
    id: z.number().int(),
    title: z.string().min(1).max(500).optional(),
    completed: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
  })
  .refine(({ title, completed, sortOrder }) => title !== undefined || completed !== undefined || sortOrder !== undefined, {
    message: "At least one field must be provided.",
  });
const notePatchSchema = z
  .object({
    id: z.number().int(),
    content: z.string().max(20_000).optional(),
    sortOrder: z.number().int().min(0).optional(),
  })
  .refine(({ content, sortOrder }) => content !== undefined || sortOrder !== undefined, {
    message: "At least one field must be provided.",
  });
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
const floatingNoteUpdateSchema = z
  .object({
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
  })
  .refine(
    ({ id: _id, ...fields }) => Object.values(fields).some((value) => value !== undefined),
    { message: "At least one field must be provided." }
  );
const tabPatchSchema = z
  .object({
    tabId: z.string().min(1).max(64),
    label: z.string().min(1).max(128).optional(),
    color: z.string().max(32).optional(),
    icon: z.string().max(64).optional(),
    sortOrder: z.number().int().min(0).optional(),
  })
  .refine(({ label, color, icon, sortOrder }) => {
    return label !== undefined || color !== undefined || icon !== undefined || sortOrder !== undefined;
  }, { message: "At least one field must be provided." });

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const localProjectRoot = process.env.SYSTEMA_PROJECT_ROOT ?? path.resolve(currentDir, "../../..");
const remoteDocsBaseUrl = process.env.SYSTEMA_MCP_DOCS_BASE_URL ?? DEFAULT_REMOTE_DOCS_BASE_URL;

function projectPath(...segments: string[]) {
  return path.join(localProjectRoot, ...segments);
}

async function readRemoteProjectDoc(file: DocFile) {
  const response = await fetch(`${remoteDocsBaseUrl}/${encodeURIComponent(file)}`);

  if (!response.ok) {
    throw new Error(`Unable to fetch ${file} from ${remoteDocsBaseUrl}: ${response.status}`);
  }

  return response.text();
}

async function readProjectDoc(file: DocFile) {
  try {
    return await readFile(projectPath(file), "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return readRemoteProjectDoc(file);
    }

    throw error;
  }
}

function normalizeSearch(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function excerptLine(line: string, query: string) {
  const trimmed = line.trim();
  if (trimmed.length <= 220) {
    return trimmed;
  }

  const index = normalizeSearch(trimmed).indexOf(normalizeSearch(query));
  if (index < 0) {
    return `${trimmed.slice(0, 217)}...`;
  }

  const start = Math.max(0, index - 80);
  const end = Math.min(trimmed.length, index + query.length + 120);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < trimmed.length ? "..." : "";
  return `${prefix}${trimmed.slice(start, end)}${suffix}`;
}

async function searchProjectDocs(query: string, limit: number) {
  const normalizedQuery = normalizeSearch(query);
  const results: Array<{ file: DocFile; line: number; text: string }> = [];

  for (const file of DOC_FILES) {
    const content = await readProjectDoc(file);
    const lines = content.split(/\r?\n/);

    for (let index = 0; index < lines.length; index++) {
      const line = lines[index] ?? "";

      if (normalizeSearch(line).includes(normalizedQuery)) {
        results.push({
          file,
          line: index + 1,
          text: excerptLine(line, query),
        });
      }

      if (results.length >= limit) {
        return results;
      }
    }
  }

  return results;
}

function docSlug(file: DocFile) {
  return file.replace(/\.md$/i, "").toLowerCase().replace(/_/g, "-");
}

function toIso(value: Date | string | null | undefined) {
  if (!value) return "";
  return value instanceof Date ? value.toISOString() : value;
}

function toNullableIso(value: Date | string | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
}

function parseChecklist(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is { text?: unknown; done?: unknown } => typeof item === "object" && item !== null)
      .map((item) => ({
        text: typeof item.text === "string" ? item.text : "",
        done: typeof item.done === "boolean" ? item.done : false,
      }));
  } catch {
    return [];
  }
}

function toTaskDto(row: {
  id: number;
  tabId: string;
  title: string;
  completed: boolean;
  sortOrder: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}) {
  return {
    id: row.id,
    tabId: row.tabId,
    title: row.title,
    completed: row.completed,
    sortOrder: row.sortOrder,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  };
}

function toNoteDto(row: {
  id: number;
  tabId: string;
  content: string;
  sortOrder: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}) {
  return {
    id: row.id,
    tabId: row.tabId,
    content: row.content,
    sortOrder: row.sortOrder,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  };
}

function toFloatingNoteDto(row: {
  id: number;
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
  archivedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}) {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    checklist: parseChecklist(row.checklist),
    x: row.x,
    y: row.y,
    w: row.w,
    h: row.h,
    accent: row.accent,
    style: row.style,
    archived: row.archived,
    archivedAt: toNullableIso(row.archivedAt),
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  };
}

function toTabDto(row: {
  id: number;
  tabId: string;
  label: string;
  color: string;
  icon: string;
  tabType: "widgets" | "whiteboard";
  sortOrder: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}) {
  return {
    id: row.id,
    tabId: row.tabId,
    label: row.label,
    color: row.color,
    icon: row.icon,
    tabType: row.tabType,
    sortOrder: row.sortOrder,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  };
}

function jsonToolResult<T extends Record<string, unknown>>(payload: T) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
    structuredContent: payload,
  };
}

function registerProjectDocResource(server: McpServer, file: DocFile) {
  const slug = docSlug(file);

  server.registerResource(
    `systema-${slug}`,
    `systema://project/${slug}`,
    {
      title: `Systema Agency ${file}`,
      description: `Document projet ${file}`,
      mimeType: "text/markdown",
    },
    async uri => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: await readProjectDoc(file),
        },
      ],
    })
  );
}

export function createSystemaMcpServer() {
  const server = new McpServer({
    name: "systema-agency",
    version: MCP_VERSION,
  });

  for (const file of DOC_FILES) {
    registerProjectDocResource(server, file);
  }

  server.registerResource(
    "systema-doc-by-name",
    new ResourceTemplate("systema://project/doc/{name}", { list: undefined }),
    {
      title: "Systema Agency document par nom",
      description: "Lit un document de cadrage Systema Agency par nom exact.",
      mimeType: "text/markdown",
    },
    async (uri, { name }) => {
      const requested = Array.isArray(name) ? name[0] : name;
      const file = DOC_FILES.find(doc => doc === requested);

      if (!file) {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "text/plain",
              text: `Document inconnu. Documents disponibles: ${DOC_FILES.join(", ")}`,
            },
          ],
        };
      }

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: await readProjectDoc(file),
          },
        ],
      };
    }
  );

  server.registerTool(
    "list_project_docs",
    {
      title: "Lister les documents Systema",
      description: "Retourne les documents de cadrage exposés par le serveur MCP.",
      outputSchema: {
        docs: z.array(
          z.object({
            file: z.string(),
            resource: z.string(),
          })
        ),
      },
    },
    async () => {
      const docs = DOC_FILES.map(file => ({
        file,
        resource: `systema://project/${docSlug(file)}`,
      }));

      return {
        content: [{ type: "text", text: JSON.stringify({ docs }, null, 2) }],
        structuredContent: { docs },
      };
    }
  );

  server.registerTool(
    "read_project_doc",
    {
      title: "Lire un document Systema",
      description: "Lit un document projet Systema Agency autorisé.",
      inputSchema: {
        file: z.enum(DOC_FILES),
      },
      outputSchema: {
        file: z.string(),
        text: z.string(),
      },
    },
    async ({ file }) => {
      const text = await readProjectDoc(file);

      return {
        content: [{ type: "text", text }],
        structuredContent: { file, text },
      };
    }
  );

  server.registerTool(
    "search_project_docs",
    {
      title: "Rechercher dans les documents Systema",
      description: "Recherche textuelle simple dans README/TODO/NOTES/WORKLOG.",
      inputSchema: {
        query: z.string().min(2),
        limit: z.number().int().min(1).max(50).default(10),
      },
      outputSchema: {
        query: z.string(),
        results: z.array(
          z.object({
            file: z.string(),
            line: z.number(),
            text: z.string(),
          })
        ),
      },
    },
    async ({ query, limit }) => {
      const results = await searchProjectDocs(query, limit);

      return {
        content: [{ type: "text", text: JSON.stringify({ query, results }, null, 2) }],
        structuredContent: { query, results },
      };
    }
  );

  server.registerTool(
    "create_task",
    {
      title: "Créer une tâche Systema",
      description: "Crée une tâche pour l'utilisateur MCP Systema configuré.",
      inputSchema: z.object({
        tabId: z.string().min(1).max(64),
        title: z.string().min(1).max(500),
        sortOrder: z.number().int().min(0).default(0),
      }),
      outputSchema: z.object({ task: taskSchema }),
    },
    async ({ tabId, title, sortOrder }) => {
      const userId = await resolveMcpUserId();
      const task = toTaskDto(await db.createTask({ userId, tabId, title, sortOrder, completed: false }));
      return jsonToolResult({ task });
    }
  );

  server.registerTool(
    "update_task",
    {
      title: "Modifier une tâche Systema",
      description: "Modifie le titre, l'état ou l'ordre d'une tâche existante.",
      inputSchema: taskPatchSchema,
      outputSchema: successOutputSchema,
    },
    async ({ id, title, completed, sortOrder }) => {
      const userId = await resolveMcpUserId();
      await db.updateTask(id, userId, { title, completed, sortOrder });
      return jsonToolResult({ success: true });
    }
  );

  server.registerTool(
    "complete_task",
    {
      title: "Compléter une tâche Systema",
      description: "Marque une tâche comme complétée.",
      inputSchema: z.object({ id: z.number().int() }),
      outputSchema: successOutputSchema,
    },
    async ({ id }) => {
      const userId = await resolveMcpUserId();
      await db.updateTask(id, userId, { completed: true });
      return jsonToolResult({ success: true });
    }
  );

  server.registerTool(
    "delete_task",
    {
      title: "Supprimer une tâche Systema",
      description: "Supprime une tâche existante pour l'utilisateur MCP Systema.",
      inputSchema: z.object({ id: z.number().int() }),
      outputSchema: successOutputSchema,
    },
    async ({ id }) => {
      const userId = await resolveMcpUserId();
      await db.deleteTask(id, userId);
      return jsonToolResult({ success: true });
    }
  );

  server.registerTool(
    "list_tasks",
    {
      title: "Lister les tâches Systema",
      description: "Liste les tâches de l'utilisateur MCP Systema, optionnellement filtrées par onglet.",
      inputSchema: z.object({ tabId: z.string().min(1).max(64).optional() }),
      outputSchema: z.object({ tasks: z.array(taskSchema) }),
    },
    async ({ tabId }) => {
      const userId = await resolveMcpUserId();
      const rows = tabId ? await db.getTasksByUserAndTab(userId, tabId) : await db.getAllTasksByUser(userId);
      return jsonToolResult({ tasks: rows.map(toTaskDto) });
    }
  );

  server.registerTool(
    "create_note",
    {
      title: "Créer une note Systema",
      description: "Crée une note dans un onglet Systema.",
      inputSchema: z.object({
        tabId: z.string().min(1).max(64),
        content: z.string().max(20_000),
        sortOrder: z.number().int().min(0).default(0),
      }),
      outputSchema: z.object({ note: noteSchema }),
    },
    async ({ tabId, content, sortOrder }) => {
      const userId = await resolveMcpUserId();
      const note = toNoteDto(await db.createNote({ userId, tabId, content, sortOrder }));
      return jsonToolResult({ note });
    }
  );

  server.registerTool(
    "update_note",
    {
      title: "Modifier une note Systema",
      description: "Modifie le contenu ou l'ordre d'une note existante.",
      inputSchema: notePatchSchema,
      outputSchema: successOutputSchema,
    },
    async ({ id, content, sortOrder }) => {
      const userId = await resolveMcpUserId();
      await db.updateNote(id, userId, { content, sortOrder });
      return jsonToolResult({ success: true });
    }
  );

  server.registerTool(
    "delete_note",
    {
      title: "Supprimer une note Systema",
      description: "Supprime une note existante pour l'utilisateur MCP Systema.",
      inputSchema: z.object({ id: z.number().int() }),
      outputSchema: successOutputSchema,
    },
    async ({ id }) => {
      const userId = await resolveMcpUserId();
      await db.deleteNote(id, userId);
      return jsonToolResult({ success: true });
    }
  );

  server.registerTool(
    "list_notes",
    {
      title: "Lister les notes Systema",
      description: "Liste les notes de l'utilisateur MCP Systema, optionnellement filtrées par onglet.",
      inputSchema: z.object({ tabId: z.string().min(1).max(64).optional() }),
      outputSchema: z.object({ notes: z.array(noteSchema) }),
    },
    async ({ tabId }) => {
      const userId = await resolveMcpUserId();
      const rows = tabId ? await db.getNotesByUserAndTab(userId, tabId) : await db.getAllNotesByUser(userId);
      return jsonToolResult({ notes: rows.map(toNoteDto) });
    }
  );

  server.registerTool(
    "create_floating_note",
    {
      title: "Créer une note volante Systema",
      description: "Crée une note volante sur le board Systema.",
      inputSchema: floatingNoteCreateSchema,
      outputSchema: z.object({ floatingNote: floatingNoteSchema }),
    },
    async ({ kind, title, body, checklist, x, y, w, h, accent, style }) => {
      const userId = await resolveMcpUserId();
      const resolvedKind = kind ?? "note";
      const floatingNote = toFloatingNoteDto(
        await db.createFloatingNote({
          userId,
          kind: resolvedKind,
          title: title ?? "",
          body: body ?? "",
          checklist: JSON.stringify(checklist ?? []),
          x,
          y,
          w,
          h,
          accent: accent ?? (resolvedKind === "task" ? "pink" : "lavender"),
          style: style ?? null,
        })
      );
      return jsonToolResult({ floatingNote });
    }
  );

  server.registerTool(
    "update_floating_note",
    {
      title: "Modifier une note volante Systema",
      description: "Modifie les champs d'une note volante existante.",
      inputSchema: floatingNoteUpdateSchema,
      outputSchema: successOutputSchema,
    },
    async ({ id, checklist, ...fields }) => {
      const userId = await resolveMcpUserId();
      const patch: Record<string, unknown> = { ...fields };
      if (checklist !== undefined) {
        patch.checklist = JSON.stringify(checklist);
      }
      await db.updateFloatingNote(id, userId, patch);
      return jsonToolResult({ success: true });
    }
  );

  server.registerTool(
    "archive_floating_note",
    {
      title: "Archiver une note volante Systema",
      description: "Archive une note volante existante.",
      inputSchema: z.object({ id: z.number().int() }),
      outputSchema: successOutputSchema,
    },
    async ({ id }) => {
      const userId = await resolveMcpUserId();
      await db.archiveFloatingNote(id, userId);
      return jsonToolResult({ success: true });
    }
  );

  server.registerTool(
    "list_floating_notes",
    {
      title: "Lister les notes volantes Systema",
      description: "Liste les notes volantes actives, avec option pour inclure les archives.",
      inputSchema: z.object({ includeArchived: z.boolean().default(false) }),
      outputSchema: z.object({ floatingNotes: z.array(floatingNoteSchema) }),
    },
    async ({ includeArchived }) => {
      const userId = await resolveMcpUserId();
      const activeRows = await db.listActiveFloatingNotes(userId);
      const archivedRows = includeArchived ? await db.listArchivedFloatingNotes(userId) : [];
      return jsonToolResult({ floatingNotes: [...activeRows, ...archivedRows].map(toFloatingNoteDto) });
    }
  );

  server.registerTool(
    "create_tab",
    {
      title: "Créer un onglet Systema",
      description: "Crée un onglet personnalisé Systema.",
      inputSchema: z.object({
        tabId: z.string().min(1).max(64),
        label: z.string().min(1).max(128),
        color: z.string().max(32).default("#FF69B4"),
        icon: z.string().max(64).default("file"),
        tabType: z.enum(["widgets", "whiteboard"]).default("whiteboard"),
        sortOrder: z.number().int().min(0).default(0),
      }),
      outputSchema: z.object({ tab: tabSchema }),
    },
    async ({ tabId, label, color, icon, tabType, sortOrder }) => {
      const userId = await resolveMcpUserId();
      const tab = toTabDto(await db.createCustomTab({ userId, tabId, label, color, icon, tabType, sortOrder }));
      return jsonToolResult({ tab });
    }
  );

  server.registerTool(
    "list_tabs",
    {
      title: "Lister les onglets Systema",
      description: "Liste les onglets personnalisés de l'utilisateur MCP Systema.",
      inputSchema: z.object({}),
      outputSchema: z.object({ tabs: z.array(tabSchema) }),
    },
    async () => {
      const userId = await resolveMcpUserId();
      const tabs = (await db.getCustomTabsByUser(userId)).map(toTabDto);
      return jsonToolResult({ tabs });
    }
  );

  server.registerTool(
    "update_tab",
    {
      title: "Modifier un onglet Systema",
      description: "Modifie un onglet personnalisé Systema à partir de son tabId.",
      inputSchema: tabPatchSchema,
      outputSchema: successOutputSchema,
    },
    async ({ tabId, label, color, icon, sortOrder }) => {
      const userId = await resolveMcpUserId();
      await db.updateCustomTabByTabId(tabId, userId, { label, color, icon, sortOrder });
      return jsonToolResult({ success: true });
    }
  );

  server.registerTool(
    "delete_tab",
    {
      title: "Supprimer un onglet Systema",
      description: "Supprime un onglet personnalisé Systema à partir de son tabId.",
      inputSchema: z.object({ tabId: z.string().min(1).max(64) }),
      outputSchema: successOutputSchema,
    },
    async ({ tabId }) => {
      const userId = await resolveMcpUserId();
      await db.deleteCustomTabByTabId(tabId, userId);
      return jsonToolResult({ success: true });
    }
  );

  const homeNewsItemSchema = z.object({
    id: z.string().max(64),
    category: z.string().max(40),
    title: z.string().max(500),
    meta: z.string().max(200).optional(),
    hot: z.boolean().optional(),
    color: z.string().max(32).optional(),
    url: z.string().max(500).optional(),
  });

  const homeProjectSchema = z.object({
    id: z.string().max(64),
    name: z.string().max(200),
    detail: z.string().max(500).optional(),
    progress: z.number().int().min(0).max(100),
    due: z.string().max(100).optional(),
    color: z.string().max(32).optional(),
    status: z.enum(["active", "planned", "queued"]).optional(),
  });

  server.registerTool(
    "get_home_data",
    {
      title: "Lire les données de la home Systema",
      description: "Retourne les raccourcis, news et projets actuels de la home page.",
      inputSchema: z.object({}),
      outputSchema: z.object({
        shortcuts: z.array(z.object({
          id: z.string(),
          label: z.string(),
          url: z.string(),
          color: z.string().optional(),
        })),
        news: z.array(homeNewsItemSchema),
        projects: z.array(homeProjectSchema),
      }),
    },
    async () => {
      const userId = await resolveMcpUserId();
      const row = await db.getHomeData(userId);
      const empty = { shortcuts: [], news: [], projects: [] };
      if (!row) return jsonToolResult(empty);
      try {
        const parsed = JSON.parse(row.data) as unknown;
        if (parsed !== null && typeof parsed === "object") {
          return jsonToolResult(parsed as typeof empty);
        }
      } catch {
        // fall through
      }
      return jsonToolResult(empty);
    }
  );

  server.registerTool(
    "set_home_news",
    {
      title: "Écrire les news de la home Systema",
      description: "Remplace la liste complète des news du jour affichées sur la home page. Les items existants sont écrasés.",
      inputSchema: z.object({
        items: z.array(homeNewsItemSchema).max(20),
      }),
      outputSchema: z.object({ success: z.boolean() }),
    },
    async ({ items }) => {
      const userId = await resolveMcpUserId();
      const row = await db.getHomeData(userId);
      let current: { shortcuts: unknown[]; news: unknown[]; projects: unknown[] } = { shortcuts: [], news: [], projects: [] };
      if (row) {
        try {
          const parsed = JSON.parse(row.data) as unknown;
          if (parsed !== null && typeof parsed === "object") {
            current = parsed as typeof current;
          }
        } catch {
          // use empty default
        }
      }
      const updated = { ...current, news: items };
      await db.upsertHomeData(userId, JSON.stringify(updated));
      return jsonToolResult({ success: true });
    }
  );

  server.registerTool(
    "set_home_projects",
    {
      title: "Écrire les projets de la home Systema",
      description: "Remplace la liste complète des projets en cours affichés sur la home page. Les items existants sont écrasés.",
      inputSchema: z.object({
        items: z.array(homeProjectSchema).max(20),
      }),
      outputSchema: z.object({ success: z.boolean() }),
    },
    async ({ items }) => {
      const userId = await resolveMcpUserId();
      const row = await db.getHomeData(userId);
      let current: { shortcuts: unknown[]; news: unknown[]; projects: unknown[] } = { shortcuts: [], news: [], projects: [] };
      if (row) {
        try {
          const parsed = JSON.parse(row.data) as unknown;
          if (parsed !== null && typeof parsed === "object") {
            current = parsed as typeof current;
          }
        } catch {
          // use empty default
        }
      }
      const updated = { ...current, projects: items };
      await db.upsertHomeData(userId, JSON.stringify(updated));
      return jsonToolResult({ success: true });
    }
  );

  server.registerPrompt(
    "systema-session-start",
    {
      title: "Démarrage session Systema",
      description: "Prépare une session agent alignée sur les règles Systema Agency.",
    },
    () => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text:
              "Lis les ressources Systema Agency disponibles via MCP, résume l'état réel du projet, puis propose la prochaine action sans modifier les fichiers lecture seule.",
          },
        },
      ],
    })
  );

  return server;
}
