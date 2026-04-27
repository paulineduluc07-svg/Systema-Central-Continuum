export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  // Owner credentials for email/password auth
  ownerEmail: process.env.OWNER_EMAIL ?? "",
  ownerPassword: process.env.OWNER_PASSWORD ?? "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  openaiModel: process.env.OPENAI_MODEL ?? "gpt-5",
  isProduction: process.env.NODE_ENV === "production",
};
