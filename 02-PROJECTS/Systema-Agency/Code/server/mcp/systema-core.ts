import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

export const MCP_VERSION = "0.2.0";
export const DOC_FILES = ["README.md", "TODO.md", "NOTES.md", "NOTES_DE_PAULINE.md", "WORKLOG.md"] as const;

type DocFile = (typeof DOC_FILES)[number];

const DEFAULT_REMOTE_DOCS_BASE_URL =
  "https://raw.githubusercontent.com/paulineduluc07-svg/Systema-Central-Continuum/main/02-PROJECTS/Systema-Agency";

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
