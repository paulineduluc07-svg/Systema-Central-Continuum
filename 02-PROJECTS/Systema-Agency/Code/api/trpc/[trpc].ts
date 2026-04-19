import "dotenv/config";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";
import { consumeRateLimit, getClientIp } from "../../server/_core/rateLimit";

const trpcHandler = createExpressMiddleware({
  router: appRouter,
  createContext,
});

export default function handler(req: any, res: any) {
  const ip = getClientIp(req);
  const limit = consumeRateLimit(`vercel-trpc:${ip}`, 120, 60_000);

  res.setHeader("X-RateLimit-Limit", "120");
  res.setHeader("X-RateLimit-Remaining", String(limit.remaining));

  if (!limit.allowed) {
    res.status(429).json({ error: "Too many requests" });
    return;
  }

  return trpcHandler(req, res, () => {
    res.status(404).end();
  });
}