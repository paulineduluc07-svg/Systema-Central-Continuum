function normalizeHeader(headerValue: string | undefined): string | null {
  if (!headerValue) {
    return null;
  }

  const trimmed = headerValue.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function isBearerAuthorized(authHeader: string | undefined, expectedToken: string | undefined): boolean {
  if (!expectedToken) {
    return true;
  }

  const normalized = normalizeHeader(authHeader);
  if (!normalized) {
    return false;
  }

  const prefix = "Bearer ";
  if (!normalized.startsWith(prefix)) {
    return false;
  }

  const providedToken = normalized.slice(prefix.length).trim();
  return providedToken.length > 0 && providedToken === expectedToken;
}