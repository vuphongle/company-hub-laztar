import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import { feedbackStatuses, feedbackTypes } from "@/features/feedback/types";

export const feedback = sqliteTable(
  "feedback",
  {
    id: text("id").primaryKey(),
    type: text("type", { enum: feedbackTypes }).notNull(),
    appSlug: text("app_slug"),
    title: text("title").notNull(),
    content: text("content").notNull(),
    status: text("status", { enum: feedbackStatuses }).notNull().default("new"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    check(
      "feedback_type_check",
      sql`${table.type} in ('bug', 'feature_request', 'idea', 'contribution')`,
    ),
    check("feedback_title_length_check", sql`length(${table.title}) between 4 and 120`),
    check("feedback_content_length_check", sql`length(${table.content}) between 20 and 5000`),
    check("feedback_status_check", sql`${table.status} in ('new', 'in_progress', 'done')`),
    index("feedback_created_at_idx").on(table.createdAt),
    index("feedback_status_idx").on(table.status),
  ],
);

export const adminUsers = sqliteTable(
  "admin_users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [uniqueIndex("admin_users_email_idx").on(table.email)],
);

export const adminSessions = sqliteTable(
  "admin_sessions",
  {
    tokenHash: text("token_hash").primaryKey(),
    adminUserId: text("admin_user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [index("admin_sessions_expires_at_idx").on(table.expiresAt)],
);
