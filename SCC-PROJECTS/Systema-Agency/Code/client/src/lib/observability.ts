import { toast } from "sonner";

type ErrorSource =
  | "window.error"
  | "window.unhandledrejection"
  | "react.error-boundary"
  | "trpc.query"
  | "trpc.mutation";

type ErrorMetadata = Record<string, unknown>;

type ErrorPayload = {
  source: ErrorSource;
  message: string;
  stack?: string;
  metadata?: ErrorMetadata;
  timestamp: string;
  path: string;
  userAgent: string;
};

const seenFingerprints = new Set<string>();
let userAlertShown = false;

function normalizeError(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) {
    return {
      message: error.message || "Unknown error",
      stack: error.stack,
    };
  }

  if (typeof error === "string") {
    return { message: error };
  }

  try {
    return { message: JSON.stringify(error) };
  } catch {
    return { message: String(error) };
  }
}

function fingerprintFor(payload: ErrorPayload): string {
  const stackHead = payload.stack?.split("\n")[0] ?? "";
  return `${payload.source}:${payload.message}:${stackHead}`;
}

function postToEndpoint(payload: ErrorPayload) {
  const endpoint = import.meta.env.VITE_ERROR_LOG_ENDPOINT?.trim();
  if (!endpoint) return;

  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(endpoint, blob);
    return;
  }

  void fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  }).catch((error: unknown) => {
    console.warn("[FrontendError] failed_to_send", error);
  });
}

function notifyUserOnce() {
  if (userAlertShown) return;
  userAlertShown = true;
  toast.error("Une erreur inattendue est survenue. Tu peux recharger la page si besoin.");
}

export function reportFrontendError(source: ErrorSource, error: unknown, metadata?: ErrorMetadata) {
  if (typeof window === "undefined") return;

  const normalized = normalizeError(error);

  const payload: ErrorPayload = {
    source,
    message: normalized.message,
    stack: normalized.stack,
    metadata,
    timestamp: new Date().toISOString(),
    path: window.location.href,
    userAgent: window.navigator.userAgent,
  };

  const fingerprint = fingerprintFor(payload);
  if (seenFingerprints.has(fingerprint)) return;
  seenFingerprints.add(fingerprint);

  console.error("[FrontendError]", payload);
  postToEndpoint(payload);
  notifyUserOnce();
}

export function setupGlobalErrorMonitoring() {
  if (typeof window === "undefined") return;

  window.addEventListener("error", (event) => {
    reportFrontendError("window.error", event.error ?? event.message, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    reportFrontendError("window.unhandledrejection", event.reason);
  });
}
