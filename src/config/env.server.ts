import "server-only";

import { resolveSqlitePath } from "./database-url";

export type DatabaseConfig = {
  url: string;
  path: string;
};

export function requireDatabaseConfig(): DatabaseConfig {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("Missing server environment variable: DATABASE_URL.");
  }

  return { url, path: resolveSqlitePath(url) };
}
