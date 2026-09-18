"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/features/auth/authorization";

import { createFeedback, updateFeedbackStatusRecord } from "./data";
import type { FeedbackFormState, StatusFormState } from "./form-state";
import {
  validateFeedbackFields,
  validateFeedbackStatus,
} from "./validation";

export async function submitFeedback(
  _previousState: FeedbackFormState,
  formData: FormData,
): Promise<FeedbackFormState> {
  const result = validateFeedbackFields({
    type: formData.get("type"),
    appId: formData.get("appId"),
    title: formData.get("title"),
    content: formData.get("content"),
    website: formData.get("website"),
  });

  if (!result.success) {
    return { success: false, errors: result.errors };
  }

  try {
    const submissionId = await createFeedback(result.data);
    return { success: true, submissionId, errors: {} };
  } catch {
    return {
      success: false,
      errors: {
        form:
          "Chưa thể lưu feedback. Kiểm tra cấu hình hoặc thử lại sau ít phút.",
      },
    };
  }
}

export async function updateFeedbackStatus(
  feedbackId: string,
  _previousState: StatusFormState,
  formData: FormData,
): Promise<StatusFormState> {
  await requireAdmin();

  const result = validateFeedbackStatus(formData.get("status"));
  if (!result.success) {
    return { success: false, error: result.error };
  }

  try {
    await updateFeedbackStatusRecord(feedbackId, result.data);
    revalidatePath("/admin");
    revalidatePath(`/admin/feedback/${feedbackId}`);
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Chưa thể cập nhật trạng thái. Hãy thử lại.",
    };
  }
}
