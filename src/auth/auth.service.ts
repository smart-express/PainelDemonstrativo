import type { AuthSession, Demonstrativo } from "../types/auth";

const SESSION_KEY = "painel.session";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDemonstrativo(value: unknown): value is Demonstrativo {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.nome_arquivo === "string" &&
    (typeof value.periodo === "string" || value.periodo === null) &&
    typeof value.tamanho_bytes === "number" &&
    typeof value.criado_em === "string" &&
    typeof value.url_visualizar === "string" &&
    typeof value.url_download === "string"
  );
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!isRecord(value) || !isRecord(value.user)) {
    return false;
  }

  return (
    typeof value.accessToken === "string" &&
    typeof value.tokenType === "string" &&
    typeof value.user.name === "string" &&
    (value.user.id === undefined || typeof value.user.id === "string") &&
    (value.user.email === undefined || typeof value.user.email === "string") &&
    (value.demonstrativo === null || isDemonstrativo(value.demonstrativo))
  );
}

export function getSession(): AuthSession | null {
  const storedSession = sessionStorage.getItem(SESSION_KEY);

  if (!storedSession) {
    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(storedSession);
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }

  if (isAuthSession(parsed)) {
    return parsed;
  }

  sessionStorage.removeItem(SESSION_KEY);
  return null;
}

export function saveSession(session: AuthSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function signOut(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
