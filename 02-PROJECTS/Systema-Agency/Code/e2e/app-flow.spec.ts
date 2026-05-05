import { expect, test, type Page, type Route } from "@playwright/test";

type TrpcSuccess = {
  result: {
    data: {
      json: unknown;
    };
  };
};

const BACKUP_SCHEMA_VERSION = 1;

type MockUser = {
  id: number;
  openId: string;
  email: string;
  name: string;
  role: "user";
};

type MockState = {
  isAuthenticated: boolean;
  user: MockUser;
  tasks: Array<{
    id: number;
    tabId: string;
    title: string;
    completed: boolean;
    sortOrder: number;
  }>;
  notes: Array<{
    id: number;
    tabId: string;
    content: string;
    sortOrder: number;
  }>;
  promptVaultData: string | null;
};

function ok(data: unknown): TrpcSuccess {
  return {
    result: {
      data: {
        json: data,
      },
    },
  };
}

function parseProcedureNames(url: URL): string[] {
  const raw = url.pathname.replace(/^\/api\/trpc\//, "");
  return raw.split(",").map((name) => decodeURIComponent(name.trim())).filter(Boolean);
}

function parseInputByIndex(request: Route["request"], url: URL, index: number): unknown {
  const searchInput = url.searchParams.get("input");

  if (searchInput) {
    const parsed = JSON.parse(searchInput) as unknown;
    if (url.searchParams.get("batch") === "1") {
      const value = (parsed as Record<string, unknown>)[String(index)];
      if (value && typeof value === "object" && "json" in (value as Record<string, unknown>)) {
        return (value as { json: unknown }).json;
      }
      return value;
    }
    if (parsed && typeof parsed === "object" && "json" in (parsed as Record<string, unknown>)) {
      return (parsed as { json: unknown }).json;
    }
    return parsed;
  }

  const body = request.postData();
  if (!body) return undefined;
  const parsedBody = JSON.parse(body) as Record<string, unknown>;
  const value = parsedBody[String(index)] ?? parsedBody;
  if (value && typeof value === "object" && "json" in (value as Record<string, unknown>)) {
    return (value as { json: unknown }).json;
  }
  return value;
}

async function setupTrpcMock(page: Page, state: MockState): Promise<void> {
  await page.route("**/api/trpc/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const procedures = parseProcedureNames(url);

    const responses = procedures.map((procedure, idx) => {
      const input = parseInputByIndex(request, url, idx) as Record<string, unknown> | undefined;

      switch (procedure) {
        case "auth.me": {
          return ok(state.isAuthenticated ? state.user : null);
        }

        case "auth.login": {
          state.isAuthenticated = true;
          return ok({ success: true });
        }

        case "auth.logout": {
          state.isAuthenticated = false;
          return ok({ success: true });
        }

        case "tasks.list":
        case "tasks.listAll": {
          const tabId = typeof (input as { tabId?: unknown })?.tabId === "string"
            ? ((input as { tabId: string }).tabId)
            : null;

          if (tabId) {
            return ok(
              state.tasks
                .filter((task) => task.tabId === tabId)
                .sort((a, b) => a.sortOrder - b.sortOrder),
            );
          }

          return ok([...state.tasks].sort((a, b) => a.sortOrder - b.sortOrder));
        }

        case "notes.list":
        case "notes.listAll": {
          const tabId = typeof (input as { tabId?: unknown })?.tabId === "string"
            ? ((input as { tabId: string }).tabId)
            : null;

          if (tabId) {
            return ok(
              state.notes
                .filter((note) => note.tabId === tabId)
                .sort((a, b) => a.sortOrder - b.sortOrder),
            );
          }

          return ok([...state.notes].sort((a, b) => a.sortOrder - b.sortOrder));
        }

        case "preferences.get": {
          return ok(null);
        }

        case "preferences.update": {
          return ok({ success: true });
        }

        case "migration.hasCloudData": {
          return ok({ hasTasks: false, hasNotes: false, hasData: false });
        }

        case "migration.importTasks": {
          const tasks = Array.isArray((input as { tasks?: unknown[] })?.tasks)
            ? ((input as { tasks: unknown[] }).tasks.length)
            : 0;
          return ok({ success: true, imported: tasks });
        }

        case "migration.importNotes": {
          const notes = Array.isArray((input as { notes?: unknown[] })?.notes)
            ? ((input as { notes: unknown[] }).notes.length)
            : 0;
          return ok({ success: true, imported: notes });
        }

        case "migration.importPreferences": {
          return ok({ success: true });
        }

        case "promptVault.get": {
          if (!state.promptVaultData) return ok(null);
          return ok({ data: state.promptVaultData });
        }

        case "promptVault.save": {
          const data = (input as { data?: unknown })?.data;
          if (typeof data === "string") {
            state.promptVaultData = data;
          }
          return ok({ success: true });
        }

        case "backup.export": {
          return ok({
            version: BACKUP_SCHEMA_VERSION,
            exportedAt: "2026-03-31T12:00:00.000Z",
            data: {
              tasks: state.tasks.map((task) => ({
                tabId: task.tabId,
                title: task.title,
                completed: task.completed,
                sortOrder: task.sortOrder,
              })),
              notes: state.notes.map((note) => ({
                tabId: note.tabId,
                content: note.content,
                sortOrder: note.sortOrder,
              })),
              promptVault: state.promptVaultData ? JSON.parse(state.promptVaultData) : null,
            },
          });
        }

        case "backup.import": {
          const payload = ((input as { data?: unknown })?.data ?? input ?? {}) as {
            tasks?: Array<{ tabId: string; title: string; completed: boolean; sortOrder: number }>;
            notes?: Array<{ tabId: string; content: string; sortOrder: number }>;
            promptVault?: unknown;
          };

          const tasks = Array.isArray(payload.tasks) ? payload.tasks : [];
          state.tasks = tasks.map((task, index) => ({
            id: index + 1,
            tabId: task.tabId,
            title: task.title,
            completed: task.completed,
            sortOrder: task.sortOrder,
          }));

          const notes = Array.isArray(payload.notes) ? payload.notes : [];
          state.notes = notes.map((note, index) => ({
            id: index + 1,
            tabId: note.tabId,
            content: note.content,
            sortOrder: note.sortOrder,
          }));

          if (payload.promptVault === null) {
            state.promptVaultData = null;
          } else if (payload.promptVault !== undefined) {
            state.promptVaultData = JSON.stringify(payload.promptVault);
          }

          return ok({ success: true });
        }

        default: {
          return ok(null);
        }
      }
    });

    const isBatch = url.searchParams.get("batch") === "1";
    const body = JSON.stringify(isBatch ? responses : responses[0]);

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body,
    });
  });
}

test("login + prompt vault CRUD/sync", async ({ page }) => {
  test.setTimeout(120_000);

  const state: MockState = {
    isAuthenticated: false,
    user: {
      id: 1,
      openId: "owner@example.com",
      email: "owner@example.com",
      name: "Owner",
      role: "user",
    },
    tasks: [],
    notes: [],
    promptVaultData: null,
  };

  await setupTrpcMock(page, state);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Mode local actif — connecte-toi pour synchroniser.")).toBeVisible({
    timeout: 30_000,
  });

  await page.getByTitle("Connexion").click();
  await page.getByPlaceholder("ton@email.com").fill("owner@example.com");
  await page.getByPlaceholder("••••••••").fill("super-secret");
  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(page.getByText("Synchronisation cloud active.")).toBeVisible({
    timeout: 30_000,
  });

  await page.goto("/prompt-vault");
  await page.getByRole("button", { name: /NOUVEAU/ }).click();
  await page.getByPlaceholder("TITRE").fill("E2E Prompt");
  await page.getByPlaceholder("TAGS (séparés par virgules)").fill("e2e, prompt");
  await page.getByPlaceholder("TEXTE DU PROMPT...").fill("Texte initial e2e");
  await page.getByRole("button", { name: /AJOUTER AU VAULT/ }).click();

  await expect(page.getByText("E2E Prompt")).toBeVisible();

  await page.getByPlaceholder(/RECHERCHER/).fill("E2E Prompt");
  await page.locator('button[title="Modifier"]').first().click();

  const editTitleInput = page.locator('input[placeholder="TITRE"]').first();
  await editTitleInput.fill("E2E Prompt Updated");
  await page.getByRole("button", { name: /SAUVEGARDER/ }).click();
  await expect(page.getByText("E2E Prompt Updated")).toBeVisible();

  await expect.poll(() => {
    if (!state.promptVaultData) return false;
    const parsed = JSON.parse(state.promptVaultData) as { list: Array<{ title: string }> };
    return parsed.list.some((entry) => entry.title === "E2E Prompt Updated");
  }).toBe(true);

  await page.locator('button[title="Supprimer"]').first().click();
  await expect(page.getByText("E2E Prompt Updated")).toHaveCount(0);

  await expect.poll(() => {
    if (!state.promptVaultData) return false;
    const parsed = JSON.parse(state.promptVaultData) as { list: Array<{ title: string }> };
    return parsed.list.some((entry) => entry.title === "E2E Prompt Updated");
  }).toBe(false);
});

test("backup panel export + import restores unified cloud state", async ({ page }) => {
  test.setTimeout(120_000);

  const state: MockState = {
    isAuthenticated: true,
    user: {
      id: 1,
      openId: "owner@example.com",
      email: "owner@example.com",
      name: "Owner",
      role: "user",
    },
    tasks: [
      { id: 1, tabId: "tableau-blanc", title: "Cloud Task Initiale", completed: false, sortOrder: 0 },
    ],
    notes: [
      { id: 1, tabId: "tableau-blanc", content: "Cloud note initiale", sortOrder: 0 },
    ],
    promptVaultData: JSON.stringify({
      list: [{ id: 1, cat: "tech", title: "Prompt cloud initial", tags: ["cloud"], text: "init" }],
      cats: [{ id: "all", label: "TOUS", color: "#00f5ff" }, { id: "tech", label: "TECH/CODE", color: "#7bed9f" }],
      favs: [1],
      brightness: 70,
    }),
  };

  await setupTrpcMock(page, state);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Synchronisation cloud active.")).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByText("Cloud Task Initiale")).toBeVisible({
    timeout: 30_000,
  });

  await page.getByRole("button", { name: "Export/Import global" }).click();
  await page.getByRole("button", { name: "Générer export" }).click();

  const exportTextarea = page.locator("textarea[readonly]").first();
  await expect(exportTextarea).toContainText("\"source\": \"cloud\"");
  await expect(exportTextarea).toContainText("\"Cloud Task Initiale\"");

  const importedPayload = {
    version: BACKUP_SCHEMA_VERSION,
    exportedAt: "2026-03-31T19:30:00.000Z",
    source: "cloud",
    data: {
      tasks: [
        { tabId: "tableau-blanc", title: "Cloud Task Restaurée", completed: false, sortOrder: 0 },
      ],
      notes: [
        { tabId: "tableau-blanc", content: "Cloud note restaurée", sortOrder: 0 },
      ],
      promptVault: {
        list: [{ id: 77, cat: "tech", title: "Prompt restauré", tags: ["restore"], text: "hello" }],
        cats: [{ id: "all", label: "TOUS", color: "#00f5ff" }, { id: "tech", label: "TECH/CODE", color: "#7bed9f" }],
        favs: [77],
        brightness: 66,
      },
    },
  };

  const unsupportedVersionPayload = {
    ...importedPayload,
    version: BACKUP_SCHEMA_VERSION + 998,
  };

  await page.getByPlaceholder("Colle ici ton JSON de sauvegarde globale.").fill(
    JSON.stringify(unsupportedVersionPayload),
  );
  await page.getByRole("button", { name: "Restaurer" }).click();
  await expect(
    page.getByText(
      `Version de sauvegarde non supportee (${BACKUP_SCHEMA_VERSION + 998}). Version attendue: ${BACKUP_SCHEMA_VERSION}.`,
    ),
  ).toBeVisible();

  await page.getByPlaceholder("Colle ici ton JSON de sauvegarde globale.").fill(JSON.stringify(importedPayload));

  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });

  await page.getByRole("button", { name: "Restaurer" }).click();

  await expect.poll(() => state.tasks[0]?.title).toBe("Cloud Task Restaurée");
  await expect.poll(() => state.notes[0]?.content).toBe("Cloud note restaurée");
  await expect.poll(() => {
    if (!state.promptVaultData) return "";
    const parsed = JSON.parse(state.promptVaultData) as { list: Array<{ title: string }> };
    return parsed.list[0]?.title ?? "";
  }).toBe("Prompt restauré");

  await expect(page.getByText("Cloud Task Restaurée")).toBeVisible();
});
