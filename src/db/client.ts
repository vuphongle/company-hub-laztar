import "server-only";

import { mkdirSync } from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

import { requireDatabaseConfig } from "@/config/env.server";

import * as schema from "./schema";

type CompanyHubDatabase = BetterSQLite3Database<typeof schema>;
type DatabaseGlobals = typeof globalThis & {
  companyHubSqlite?: Database.Database;
  companyHubDb?: CompanyHubDatabase;
};

const databaseGlobals = globalThis as DatabaseGlobals;

function createDatabase() {
  const config = requireDatabaseConfig();
  mkdirSync(path.dirname(config.path), { recursive: true });

  const sqlite = new Database(config.path);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  return { sqlite, db: drizzle(sqlite, { schema }) };
}

if (!databaseGlobals.companyHubDb || !databaseGlobals.companyHubSqlite) {
  const database = createDatabase();
  databaseGlobals.companyHubDb = database.db;
  databaseGlobals.companyHubSqlite = database.sqlite;
}

export const db = databaseGlobals.companyHubDb;
