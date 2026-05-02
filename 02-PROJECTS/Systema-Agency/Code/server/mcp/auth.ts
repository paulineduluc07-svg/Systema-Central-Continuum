import type express from "express";
import { getUserByOpenId } from "../db.js";

let cachedMcpUserId: number | null = null;

export async function resolveMcpUserId() {
  if (cachedMcpUserId !== null) {
    return cachedMcpUserId;
  }

  const openId = process.env.SYSTEMA_MCP_USER_OPEN_ID?.trim();
  if (!openId) {
    throw new Error("SYSTEMA_MCP_USER_OPEN_ID is required for Systema MCP write tools.");
  }

  const user = await getUserByOpenId(openId);
  if (!user) {
    throw new Error(`No Systema user found for SYSTEMA_MCP_USER_OPEN_ID=${openId}.`);
  }

  cachedMcpUserId = user.id;
  return cachedMcpUserId;
}

export function verifyMcpSecret(req: express.Request) {
  const expected = process.env.SYSTEMA_MCP_SECRET?.trim();
  if (!expected) {
    return false;
  }

  const received = req.header("x-systema-mcp-secret")?.trim();
  return received === expected;
}

export function resetMcpUserCacheForTests() {
  cachedMcpUserId = null;
}
