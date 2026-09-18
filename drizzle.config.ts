import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import { defineConfig } from "drizzle-kit";

import { resolveSqlitePath } from "./src/config/database-url";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env") as typeof import("@next/env");
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required. Copy .env.example to .env.local first.");
}

const databasePath = resolveSqlitePath(databaseUrl);
mkdirSync(path.dirname(databasePath), { recursive: true });

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: databasePath,
  },
});
