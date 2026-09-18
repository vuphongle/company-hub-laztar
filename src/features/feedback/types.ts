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
  appSlug: string | null;
  title: string;
  content: string;
  status: FeedbackStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type FeedbackInput = Pick<Feedback, "type" | "appSlug" | "title" | "content">;
