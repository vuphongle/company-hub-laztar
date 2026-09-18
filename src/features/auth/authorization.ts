import "server-only";

import { redirect } from "next/navigation";

import { getPublicSupabaseConfig } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAdminSession() {
  if (!getPublicSupabaseConfig()) {
    return { configured: false, user: null, isAdmin: false } as const;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { configured: true, user: null, isAdmin: false } as const;
  }

  const { data } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return { configured: true, user, isAdmin: Boolean(data) } as const;
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session.configured) {
    redirect("/admin/login?error=not-configured");
  }

  if (!session.user) {
    redirect("/admin/login");
  }

  if (!session.isAdmin) {
    redirect("/admin/login?error=not-authorized");
  }

  return session.user;
}
