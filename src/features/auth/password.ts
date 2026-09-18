import "server-only";

import { hash, verify } from "argon2";

export function hashAdminPassword(password: string) {
  return hash(password, { type: 2 });
}

export function verifyAdminPassword(passwordHash: string, password: string) {
  return verify(passwordHash, password);
}
