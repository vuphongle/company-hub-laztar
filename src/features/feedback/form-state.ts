import type { FeedbackFieldErrors } from "./validation";

export type FeedbackFormState = {
  success: boolean;
  submissionId?: string;
  errors: FeedbackFieldErrors;
};

export type StatusFormState = {
  success: boolean;
  error?: string;
};

export const initialFeedbackFormState: FeedbackFormState = {
  success: false,
  errors: {},
};

export const initialStatusFormState: StatusFormState = {
  success: false,
};
