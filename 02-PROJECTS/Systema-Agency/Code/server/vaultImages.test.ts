import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { del, put } from "@vercel/blob";

vi.mock("./db", () => ({}));

vi.mock("@vercel/blob", () => ({
  put: vi.fn().mockResolvedValue({
    url: "https://store.public.blob.vercel-storage.com/prompt-vault/1/abc123.webp",
  }),
  del: vi.fn().mockResolvedValue(undefined),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "password",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

const VALID_PNG_BASE64 = Buffer.from("fake-image-bytes").toString("base64");

describe("vaultImages router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_test_token";
  });

  it("rejects upload when unauthenticated", async () => {
    const caller = appRouter.createCaller({ ...createAuthContext(), user: null } as unknown as TrpcContext);

    await expect(
      caller.vaultImages.upload({ fileName: "a.png", contentType: "image/png", data: VALID_PNG_BASE64 }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("fails closed when BLOB_READ_WRITE_TOKEN is missing", async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;
    const caller = appRouter.createCaller(createAuthContext());

    await expect(
      caller.vaultImages.upload({ fileName: "a.png", contentType: "image/png", data: VALID_PNG_BASE64 }),
    ).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
    expect(put).not.toHaveBeenCalled();
  });

  it("uploads under the user's own prompt-vault prefix", async () => {
    const caller = appRouter.createCaller(createAuthContext());

    const result = await caller.vaultImages.upload({
      fileName: "capture.png",
      contentType: "image/png",
      data: VALID_PNG_BASE64,
    });

    expect(result.url).toContain("prompt-vault/1/");
    expect(put).toHaveBeenCalledTimes(1);
    const [pathname, , options] = vi.mocked(put).mock.calls[0];
    expect(pathname).toMatch(/^prompt-vault\/1\/[A-Za-z0-9_-]+\.png$/);
    expect(options).toMatchObject({ access: "public", contentType: "image/png" });
  });

  it("rejects unsupported content types", async () => {
    const caller = appRouter.createCaller(createAuthContext());

    await expect(
      caller.vaultImages.upload({
        fileName: "script.svg",
        // @ts-expect-error volontaire : type non supporté
        contentType: "image/svg+xml",
        data: VALID_PNG_BASE64,
      }),
    ).rejects.toThrow();
    expect(put).not.toHaveBeenCalled();
  });

  it("removes only images under the user's own prefix", async () => {
    const caller = appRouter.createCaller(createAuthContext());

    await caller.vaultImages.remove({
      url: "https://store.public.blob.vercel-storage.com/prompt-vault/1/abc123.webp",
    });
    expect(del).toHaveBeenCalledTimes(1);

    await expect(
      caller.vaultImages.remove({
        url: "https://store.public.blob.vercel-storage.com/prompt-vault/999/other.webp",
      }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(del).toHaveBeenCalledTimes(1);
  });
});
