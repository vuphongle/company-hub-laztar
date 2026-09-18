import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("feedback")
    .insert(input)
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create feedback", error.message);
    throw new Error("Could not create feedback.");
  }

  return data.id as string;
}

export async function listFeedback(filters: FeedbackFilters = {}) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("feedback")
    .select("id,type,app_id,content,status,created_at,updated_at")
    .order("created_at", { ascending: false });

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.type) {
    query = query.eq("type", filters.type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to list feedback", error.message);
    throw new Error("Could not load feedback.");
  }

  return (data ?? []) as Feedback[];
}

export async function getFeedbackById(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("feedback")
    .select("id,type,app_id,content,status,created_at,updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load feedback", error.message);
    throw new Error("Could not load feedback.");
  }

  return data as Feedback | null;
}

export async function updateFeedbackStatusRecord(
  id: string,
  status: FeedbackStatus,
) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("feedback")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Failed to update feedback", error.message);
    throw new Error("Could not update feedback.");
  }
}
