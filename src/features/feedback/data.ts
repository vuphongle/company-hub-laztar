import "server-only";

import { randomUUID } from "node:crypto";

import { and, desc, eq, type SQL } from "drizzle-orm";

import { db } from "@/db/client";
import { feedback } from "@/db/schema";

import type {
  Feedback,
  FeedbackInput,
  FeedbackStatus,
  FeedbackType,
} from "./types";

export type FeedbackFilters = {
  status?: FeedbackStatus;
  type?: FeedbackType;
};

export async function createFeedback(input: FeedbackInput) {
  const id = randomUUID();
  db.insert(feedback).values({ id, ...input }).run();
  return id;
}

export async function listFeedback(filters: FeedbackFilters = {}) {
  const conditions: SQL[] = [];

  if (filters.status) {
    conditions.push(eq(feedback.status, filters.status));
  }

  if (filters.type) {
    conditions.push(eq(feedback.type, filters.type));
  }

  return db
    .select()
    .from(feedback)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(feedback.createdAt))
    .all() as Feedback[];
}

export async function getFeedbackById(id: string) {
  return (db.select().from(feedback).where(eq(feedback.id, id)).get() as Feedback | undefined) ?? null;
}

export async function updateFeedbackStatusRecord(
  id: string,
  status: FeedbackStatus,
) {
  db.update(feedback)
    .set({ status, updatedAt: new Date() })
    .where(eq(feedback.id, id))
    .run();
}
