import type { CookieOptions, Request } from "express";

function isSecureRequest(req: Request) {
  if (req.protocol === "https") return true;

  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

function parseBooleanEnv(value: string | undefined) {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function shouldUseCrossSiteCookieMode() {
  return parseBooleanEnv(process.env.COOKIE_CROSS_SITE);
}

export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure"> {
  const secure = isSecureRequest(req);
  const useCrossSiteCookies = shouldUseCrossSiteCookieMode();
  const sameSite: CookieOptions["sameSite"] =
    useCrossSiteCookies && secure ? "none" : "lax";

  return {
    httpOnly: true,
    path: "/",
    sameSite,
    secure,
  };
}
