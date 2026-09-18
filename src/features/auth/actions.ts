"use server";

import { redirect } from "next/navigation";

import { getPublicSupabaseConfig } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type LoginFormState = {
  error?: string;
};

export async function signIn(
  _previousState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  if (!getPublicSupabaseConfig()) {
    return { error: "Supabase chưa được cấu hình cho môi trường này." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Hãy nhập đầy đủ email và mật khẩu." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email hoặc mật khẩu không đúng." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user?.id ?? "")
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    return { error: "Tài khoản này không có quyền admin." };
  }

  redirect("/admin");
}

export async function signOut() {
  if (getPublicSupabaseConfig()) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  }

  redirect("/admin/login");
}
