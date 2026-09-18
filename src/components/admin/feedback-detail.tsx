import Link from "next/link";

import {
  feedbackStatusLabels,
  feedbackTypeLabels,
  formatFeedbackDate,
  getFeedbackAppName,
} from "@/features/feedback/presentation";
import type { Feedback } from "@/features/feedback/types";

import { StatusForm } from "./status-form";

export function FeedbackDetail({
  feedback,
  backHref = "/admin",
}: {
  feedback: Feedback;
  backHref?: string;
}) {
  return (
    <>
      <Link className="text-link back-link" href={backHref}>
        ← Quay lại feedback inbox
      </Link>

      <div className="detail-heading">
        <div>
          <p className="eyebrow">{feedbackTypeLabels[feedback.type]}</p>
          <h1>Chi tiết feedback</h1>
        </div>
        <span className={`status-badge status-${feedback.status}`}>
          {feedbackStatusLabels[feedback.status]}
        </span>
      </div>

      <div className="detail-layout">
        <article className="feedback-detail-card">
          <dl className="feedback-meta">
            <div>
              <dt>App / project</dt>
              <dd>{getFeedbackAppName(feedback.app_id)}</dd>
            </div>
            <div>
              <dt>Ngày gửi</dt>
              <dd>{formatFeedbackDate(feedback.created_at)}</dd>
            </div>
            <div>
              <dt>Mã feedback</dt>
              <dd className="technical-value">{feedback.id}</dd>
            </div>
          </dl>

          <div className="feedback-content">
            <h2>Nội dung</h2>
            <p>{feedback.content}</p>
          </div>
        </article>

        <aside className="status-panel" aria-labelledby="status-panel-title">
          <p className="eyebrow">Workflow</p>
          <h2 id="status-panel-title">Cập nhật trạng thái</h2>
          <p>Giữ trạng thái đơn giản để mọi người biết feedback đang ở đâu.</p>
          <StatusForm feedbackId={feedback.id} currentStatus={feedback.status} />
        </aside>
      </div>
    </>
  );
}
