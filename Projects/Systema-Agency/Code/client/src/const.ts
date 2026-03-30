export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export function getLoginUrl(): string {
  const configuredLoginUrl = import.meta.env.VITE_LOGIN_URL;
  if (typeof configuredLoginUrl === "string" && configuredLoginUrl.trim().length > 0) {
    return configuredLoginUrl.trim();
  }

  return "/";
}
