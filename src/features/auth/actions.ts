"use server";

import { redirect } from "next/navigation";

import { findAdminByEmail } from "./data";
import { verifyAdminPassword } from "./password";
import { createAdminSession, deleteAdminSession } from "./session";

export type LoginFormState = {
  error?: string;
};

export async function signIn(
  _previousState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Hãy nhập đầy đủ email và mật khẩu." };
  }

  const admin = findAdminByEmail(email);
  if (!admin || !(await verifyAdminPassword(admin.passwordHash, password))) {
    return { error: "Email hoặc mật khẩu không đúng." };
  }

  await createAdminSession(admin.id);
  redirect("/admin");
}

export async function signOut() {
  await deleteAdminSession();
  redirect("/admin/login");
}
