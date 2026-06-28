/**
 * Logger structuré minimal (JSON par ligne) — capté par les logs Vercel.
 * Usage : log.info("agent.request", { sessionId }) / log.error("contact.db", { err })
 */
type Level = "info" | "warn" | "error";

function emit(level: Level, event: string, data?: Record<string, unknown>) {
  const line = JSON.stringify({ t: new Date().toISOString(), level, event, ...data });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const log = {
  info: (event: string, data?: Record<string, unknown>) => emit("info", event, data),
  warn: (event: string, data?: Record<string, unknown>) => emit("warn", event, data),
  error: (event: string, data?: Record<string, unknown>) => emit("error", event, data),
};

export function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
