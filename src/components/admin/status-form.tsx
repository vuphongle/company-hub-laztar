"use client";

import { Check, SpinnerGap } from "@phosphor-icons/react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { updateFeedbackStatus } from "@/features/feedback/actions";
import { initialStatusFormState } from "@/features/feedback/form-state";
import { feedbackStatusLabels } from "@/features/feedback/presentation";
import { feedbackStatuses, type FeedbackStatus } from "@/features/feedback/types";

function SaveStatusButton() {
  const { pending } = useFormStatus();
  return (
    <button className="button button-primary" type="submit" disabled={pending}>
      {pending ? (
        <SpinnerGap className="spin" size={19} aria-hidden="true" />
      ) : (
        <Check size={19} weight="bold" aria-hidden="true" />
      )}
      {pending ? "Đang lưu..." : "Lưu trạng thái"}
    </button>
  );
}

export function StatusForm({
  feedbackId,
  currentStatus,
}: {
  feedbackId: string;
  currentStatus: FeedbackStatus;
}) {
  const action = updateFeedbackStatus.bind(null, feedbackId);
  const [state, formAction] = useActionState(action, initialStatusFormState);

  return (
    <form className="status-form" action={formAction}>
      <div className="form-field">
        <label htmlFor="status">Trạng thái</label>
        <select id="status" name="status" defaultValue={currentStatus}>
          {feedbackStatuses.map((status) => (
            <option value={status} key={status}>
              {feedbackStatusLabels[status]}
            </option>
          ))}
        </select>
      </div>
      <SaveStatusButton />
      {state.error && (
        <p className="field-error" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="save-success" role="status">
          Đã cập nhật trạng thái.
        </p>
      )}
    </form>
  );
}
