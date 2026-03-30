export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  openaiApiUrl: process.env.OPENAI_API_URL ?? "https://api.openai.com/v1/chat/completions",
  openaiModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  // Owner credentials for email/password auth
  ownerEmail: process.env.OWNER_EMAIL ?? "",
  ownerPassword: process.env.OWNER_PASSWORD ?? "",
  isProduction: process.env.NODE_ENV === "production",
};
