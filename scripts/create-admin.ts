import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { createInterface } from "node:readline/promises";

import { hash } from "argon2";
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";

import { resolveSqlitePath } from "../src/config/database-url";
import { adminUsers } from "../src/db/schema";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env") as typeof import("@next/env");
loadEnvConfig(process.cwd(), true);

function readHidden(prompt: string): Promise<string> {
  if (!process.stdin.isTTY || !process.stdin.setRawMode) {
    const readline = createInterface({ input: process.stdin, output: process.stdout });
    return readline.question(prompt).finally(() => readline.close());
  }

  return new Promise((resolve, reject) => {
    let value = "";
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    const finish = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener("data", onData);
      process.stdout.write("\n");
    };

    const onData = (input: string) => {
      for (const character of input) {
        if (character === "\r" || character === "\n") {
          finish();
          resolve(value);
          return;
        }

        if (character === "\u0003") {
          finish();
          reject(new Error("Admin creation cancelled."));
          return;
        }

        if (character === "\u007f" || character === "\b") {
          if (value.length > 0) {
            value = value.slice(0, -1);
            process.stdout.write("\b \b");
          }
          continue;
        }

        value += character;
        process.stdout.write("*");
      }
    };

    process.stdin.on("data", onData);
  });
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required. Copy .env.example to .env.local first.");
}

const readline = createInterface({ input: process.stdin, output: process.stdout });
const email = (await readline.question("Email: ")).trim().toLowerCase();
readline.close();

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  throw new Error("Enter a valid admin email address.");
}

const password = await readHidden("Password: ");
const passwordConfirmation = await readHidden("Confirm password: ");

if (password.length < 12) {
  throw new Error("Admin password must contain at least 12 characters.");
}
if (password !== passwordConfirmation) {
  throw new Error("Password confirmation does not match.");
}

const databasePath = resolveSqlitePath(databaseUrl);
mkdirSync(path.dirname(databasePath), { recursive: true });
const sqlite = new Database(databasePath);
sqlite.pragma("foreign_keys = ON");
const db = drizzle(sqlite);

try {
  const existingAdmin = db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .get();

  if (existingAdmin) {
    throw new Error(`An admin account already exists for ${email}.`);
  }

  db.insert(adminUsers)
    .values({
      id: randomUUID(),
      email,
      passwordHash: await hash(password, { type: 2 }),
    })
    .run();

  console.log(`Created Company Hub admin ${email}.`);
} catch (error) {
  if (error instanceof Error && error.message.includes("no such table")) {
    throw new Error("Database tables are missing. Run npm run db:migrate first.");
  }
  throw error;
} finally {
  sqlite.close();
}
