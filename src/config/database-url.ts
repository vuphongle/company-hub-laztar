import path from "node:path";

export function resolveSqlitePath(databaseUrl: string, cwd = process.cwd()) {
  if (!databaseUrl.startsWith("file:")) {
    throw new Error("DATABASE_URL must use the file: scheme for SQLite.");
  }

  const filePath = decodeURIComponent(databaseUrl.slice("file:".length));
  if (!filePath) {
    throw new Error("DATABASE_URL must include a SQLite database path.");
  }

  return path.isAbsolute(filePath) ? path.normalize(filePath) : path.resolve(cwd, filePath);
}
