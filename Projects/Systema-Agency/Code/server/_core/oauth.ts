import type { Express, Request, Response } from "express";

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", (_req: Request, res: Response) => {
    // OAuth flow has been removed in favor of email/password auth.
    res.redirect(302, "/");
  });
}
