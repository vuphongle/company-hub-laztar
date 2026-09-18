import { getAppById } from "@/data/apps";

import type { FeedbackStatus, FeedbackType } from "./types";

export const feedbackTypeLabels: Record<FeedbackType, string> = {
  bug: "Bug",
  feature_request: "Feature Request",
  idea: "Idea",
  contribution: "Contribution",
};

export const feedbackStatusLabels: Record<FeedbackStatus, string> = {
  new: "New",
  in_progress: "In Progress",
  done: "Done",
};

export function getFeedbackAppName(appId: string | null) {
  if (!appId) return "Company Hub / Chung";
  return getAppById(appId)?.name ?? appId;
}

export function formatFeedbackDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function feedbackExcerpt(content: string, maxLength = 120) {
  if (content.length <= maxLength) return content;
  return `${content.slice(0, maxLength).trimEnd()}…`;
}
