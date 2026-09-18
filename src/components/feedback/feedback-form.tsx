"use client";

import {
  BugBeetle,
  CheckCircle,
  HandHeart,
  Lightbulb,
  PaperPlaneTilt,
  RocketLaunch,
  WarningCircle,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { apps } from "@/data/apps";
import { submitFeedback } from "@/features/feedback/actions";
import { initialFeedbackFormState } from "@/features/feedback/form-state";

const feedbackOptions = [
  { value: "bug", label: "Báo lỗi", hint: "Có gì đó chưa chạy như mong đợi", icon: BugBeetle },
  {
    value: "feature_request",
    label: "Đề xuất tính năng",
    hint: "Có một feature sẽ giúp mọi người dùng tốt hơn",
    icon: RocketLaunch,
  },
  { value: "idea", label: "Có ý tưởng", hint: "Một hướng mới, một thử nghiệm hay ho", icon: Lightbulb },
  {
    value: "contribution",
    label: "Muốn tham gia",
    hint: "Bạn muốn cùng team làm một project nào đó",
    icon: HandHeart,
  },
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="button button-primary submit-button" type="submit" disabled={pending}>
      <PaperPlaneTilt size={20} weight="bold" aria-hidden="true" />
      {pending ? "Đang gửi..." : "Gửi cho team"}
    </button>
  );
}

export function FeedbackSuccess({ submissionId }: { submissionId?: string }) {
  return (
    <div className="form-success" role="status">
      <span className="success-icon" aria-hidden="true">
        <CheckCircle size={34} weight="fill" />
      </span>
      <p className="eyebrow">Đã ghi nhận</p>
      <h2>Cảm ơn bạn đã làm LAZTAR Hub hay hơn.</h2>
      <p>
        Feedback đã được lưu vào hệ thống
        {submissionId ? ` với mã ${submissionId.slice(0, 8)}` : ""}.
      </p>
      <div className="success-actions">
        <Link className="button button-primary" href="/">
          Về trang ứng dụng
        </Link>
        <button
          className="button button-secondary"
          type="button"
          onClick={() => window.location.reload()}
        >
          Gửi góp ý khác
        </button>
      </div>
    </div>
  );
}

export function FeedbackForm() {
  const [state, formAction] = useActionState(submitFeedback, initialFeedbackFormState);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state.success && Object.keys(state.errors).length > 0) {
      errorSummaryRef.current?.focus();
    }
  }, [state]);

  if (state.success) {
    return <FeedbackSuccess submissionId={state.submissionId} />;
  }

  const fieldErrors = Object.entries(state.errors).filter(([key]) => key !== "form");

  return (
    <form className="feedback-form" action={formAction} noValidate>
      {Object.keys(state.errors).length > 0 && (
        <div
          className="error-summary"
          ref={errorSummaryRef}
          role="alert"
          tabIndex={-1}
          aria-labelledby="error-summary-title"
        >
          <WarningCircle size={24} weight="fill" aria-hidden="true" />
          <div>
            <h2 id="error-summary-title">Có một vài điểm cần kiểm tra</h2>
            {state.errors.form && <p>{state.errors.form}</p>}
            {fieldErrors.length > 0 && (
              <ul>
                {fieldErrors.map(([field, message]) => (
                  <li key={field}>
                    <a href={`#${field}`}>{message}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <fieldset
        className="form-fieldset"
        aria-describedby={state.errors.type ? "type-error" : undefined}
      >
        <legend>
          Bạn muốn góp gì? <span aria-hidden="true">*</span>
        </legend>
        <div className="feedback-type-grid" id="type">
          {feedbackOptions.map((option) => {
            const Icon = option.icon;

            return (
              <label className="choice-card" key={option.value}>
                <input type="radio" name="type" value={option.value} required />
                <span className="choice-card-body">
                  <Icon size={24} weight="duotone" aria-hidden="true" />
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.hint}</small>
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        {state.errors.type && (
          <p className="field-error" id="type-error" role="alert">
            {state.errors.type}
          </p>
        )}
      </fieldset>

      <div className="form-field">
        <label htmlFor="appId">App / project liên quan</label>
        <select id="appId" name="appId" aria-describedby="appId-help appId-error">
          <option value="">LAZTAR Hub / Góp ý chung</option>
          {apps.map((app) => (
            <option value={app.id} key={app.id}>
              {app.name}
            </option>
          ))}
        </select>
        <p className="field-help" id="appId-help">
          Chọn project giúp team đọc đúng ngữ cảnh nhanh hơn.
        </p>
        {state.errors.appId && (
          <p className="field-error" id="appId-error" role="alert">
            {state.errors.appId}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="title">
          Tiêu đề <span aria-hidden="true">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          minLength={4}
          maxLength={120}
          required
          aria-describedby="title-help title-error"
          placeholder="Tóm tắt idea hoặc vấn đề trong một câu ngắn"
        />
        <p className="field-help" id="title-help">
          Từ 4 đến 120 ký tự.
        </p>
        {state.errors.title && (
          <p className="field-error" id="title-error" role="alert">
            {state.errors.title}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="content">
          Nội dung <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          rows={7}
          minLength={20}
          maxLength={5000}
          required
          aria-describedby="content-help content-error"
          placeholder="Kể team nghe điều bạn gặp phải, điều muốn thử hoặc cách bạn muốn góp sức..."
        />
        <p className="field-help" id="content-help">
          Tối thiểu 20 ký tự. Với bug, hãy thêm bước tái hiện nếu có thể.
        </p>
        {state.errors.content && (
          <p className="field-error" id="content-error" role="alert">
            {state.errors.content}
          </p>
        )}
      </div>

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-actions">
        <SubmitButton />
        <p>Góp ý sẽ vào inbox của team để mọi người cùng theo dõi.</p>
      </div>
    </form>
  );
}
