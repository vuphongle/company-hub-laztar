export const feedbackTypes = [
  "bug",
  "feature_request",
  "idea",
  "contribution",
] as const;

export const feedbackStatuses = ["new", "in_progress", "done"] as const;

export type FeedbackType = (typeof feedbackTypes)[number];
export type FeedbackStatus = (typeof feedbackStatuses)[number];

export type Feedback = {
  id: string;
  type: FeedbackType;
  app_id: string | null;
  content: string;
  status: FeedbackStatus;
  created_at: string;
  updated_at: string;
};

export type FeedbackInput = Pick<Feedback, "type" | "app_id" | "content">;
