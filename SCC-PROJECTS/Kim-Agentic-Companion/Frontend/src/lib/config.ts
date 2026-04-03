export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "https://kim-agentic-companion-staging.vercel.app",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Kim",
} as const;