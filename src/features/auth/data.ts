import "server-only";

import { and, eq, gt, lt } from "drizzle-orm";

import { db } from "@/db/client";
import { adminSessions, adminUsers } from "@/db/schema";

export function findAdminByEmail(email: string) {
  return db.select().from(adminUsers).where(eq(adminUsers.email, email)).get() ?? null;
}

export function createAdminSessionRecord(input: {
  tokenHash: string;
  adminUserId: string;
  expiresAt: Date;
}) {
  db.insert(adminSessions).values(input).run();
}

export function getAdminBySessionTokenHash(tokenHash: string) {
  const now = new Date();

  return (
    db
      .select({
        id: adminUsers.id,
        email: adminUsers.email,
        expiresAt: adminSessions.expiresAt,
      })
      .from(adminSessions)
      .innerJoin(adminUsers, eq(adminSessions.adminUserId, adminUsers.id))
      .where(and(eq(adminSessions.tokenHash, tokenHash), gt(adminSessions.expiresAt, now)))
      .get() ?? null
  );
}

export function deleteAdminSessionRecord(tokenHash: string) {
  db.delete(adminSessions).where(eq(adminSessions.tokenHash, tokenHash)).run();
}

export function deleteExpiredAdminSessions() {
  db.delete(adminSessions).where(lt(adminSessions.expiresAt, new Date())).run();
}
