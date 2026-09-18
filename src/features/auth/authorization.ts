import "server-only";

import { redirect } from "next/navigation";

import { getAdminFromSession } from "./session";

export async function getAdminSession() {
  return getAdminFromSession();
}

export async function requireAdmin() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
