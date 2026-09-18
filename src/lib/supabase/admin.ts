import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getServiceRoleConfig } from "./config";

export function createAdminSupabaseClient() {
  const config = getServiceRoleConfig();

  if (!config) {
    throw new Error("Supabase service-role configuration is missing.");
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
