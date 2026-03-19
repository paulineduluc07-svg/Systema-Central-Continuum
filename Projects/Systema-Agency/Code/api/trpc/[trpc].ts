import "dotenv/config";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";`nimport { consumeRateLimit, getClientIp } from "../../server/_core/rateLimit";

const trpcHandler = createExpressMiddleware({
  router: appRouter,
  createContext,
});

export default function handler(req: any, res: any) {`n  const ip = getClientIp(req);`n  const limit = consumeRateLimit(`vercel-trpc:${ip}`, 120, 60_000);`n  res.setHeader("X-RateLimit-Limit", "120");`n  res.setHeader("X-RateLimit-Remaining", String(limit.remaining));`n  if (!limit.allowed) {`n    res.status(429).json({ error: "Too many requests" });`n    return;`n  }
  return trpcHandler(req, res, () => {
    res.status(404).end();
  });
}
