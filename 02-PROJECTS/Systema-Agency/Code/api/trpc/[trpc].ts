import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../../server/routers.js";
import { createContext } from "../../server/_core/context.js";
import { consumeRateLimit, getClientIp } from "../../server/_core/rateLimit.js";

const app = express();

app.use((req, res, next) => {
  const ip = getClientIp(req);
  const limit = consumeRateLimit(`vercel-trpc:${ip}`, 120, 60_000);

  res.setHeader("X-RateLimit-Limit", "120");
  res.setHeader("X-RateLimit-Remaining", String(limit.remaining));

  if (!limit.allowed) {
    res.status(429).json({ error: "Too many requests" });
    return;
  }

  next();
});

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;
