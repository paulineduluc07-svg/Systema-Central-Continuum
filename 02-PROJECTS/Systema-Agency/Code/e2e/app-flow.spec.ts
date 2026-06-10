import { expect, test, type Page, type Route } from "@playwright/test";

type TrpcSuccess = {
  result: {
    data: {
      json: unknown;
    };
  };
};

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
