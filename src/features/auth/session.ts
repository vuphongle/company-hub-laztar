import "server-only";

import { createHash, randomBytes } from "node:crypto";

import { cookies } from "next/headers";

import {
  createAdminSessionRecord,
  deleteAdminSessionRecord,
  deleteExpiredAdminSessions,
  getAdminBySessionTokenHash,
} from "./data";

const ADMIN_SESSION_COOKIE = "company_hub_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createAdminSession(adminUserId: string) {
  deleteExpiredAdminSessions();

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);
  createAdminSessionRecord({
    tokenHash: hashSessionToken(token),
    adminUserId,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function getAdminFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) return null;
  return getAdminBySessionTokenHash(hashSessionToken(token));
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (token) {
    deleteAdminSessionRecord(hashSessionToken(token));
  }

  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
