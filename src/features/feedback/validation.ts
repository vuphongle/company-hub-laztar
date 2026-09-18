import { getAppById } from "@/data/apps";

import {
  feedbackStatuses,
  feedbackTypes,
  type FeedbackInput,
  type FeedbackStatus,
  type FeedbackType,
} from "./types";

type FeedbackFields = {
  type: unknown;
  appId: unknown;
  content: unknown;
  website: unknown;
};

export type FeedbackFieldErrors = Partial<
  Record<"form" | "type" | "appId" | "content", string>
>;

type FeedbackValidationResult =
  | { success: true; data: FeedbackInput }
  | { success: false; errors: FeedbackFieldErrors };

type StatusValidationResult =
  | { success: true; data: FeedbackStatus }
  | { success: false; error: string };

const MIN_CONTENT_LENGTH = 20;
const MAX_CONTENT_LENGTH = 5000;

function isFeedbackType(value: string): value is FeedbackType {
  return feedbackTypes.includes(value as FeedbackType);
}

export function validateFeedbackFields(
  fields: FeedbackFields,
): FeedbackValidationResult {
  const type = typeof fields.type === "string" ? fields.type : "";
  const appId = typeof fields.appId === "string" ? fields.appId : "";
  const content = typeof fields.content === "string" ? fields.content.trim() : "";
  const website = typeof fields.website === "string" ? fields.website.trim() : "";

  if (website) {
    return {
      success: false,
      errors: { form: "Không thể gửi feedback lúc này. Hãy thử lại." },
    };
  }

  const errors: FeedbackFieldErrors = {};

  if (!isFeedbackType(type)) {
    errors.type = "Hãy chọn một loại feedback hợp lệ.";
  }

  if (appId && !getAppById(appId)) {
    errors.appId = "App được chọn không tồn tại.";
  }

  if (content.length < MIN_CONTENT_LENGTH) {
    errors.content = "Nội dung cần có ít nhất 20 ký tự.";
  } else if (content.length > MAX_CONTENT_LENGTH) {
    errors.content = "Nội dung không được vượt quá 5000 ký tự.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      type: type as FeedbackType,
      app_id: appId || null,
      content,
    },
  };
}

export function validateFeedbackStatus(value: unknown): StatusValidationResult {
  if (
    typeof value === "string" &&
    feedbackStatuses.includes(value as FeedbackStatus)
  ) {
    return { success: true, data: value as FeedbackStatus };
  }

  return {
    success: false,
    error: "Trạng thái feedback không hợp lệ.",
  };
}
