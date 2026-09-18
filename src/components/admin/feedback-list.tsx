import Link from "next/link";

import {
  feedbackExcerpt,
  feedbackStatusLabels,
  feedbackTypeLabels,
  formatFeedbackDate,
  getFeedbackAppName,
} from "@/features/feedback/presentation";
import type { Feedback } from "@/features/feedback/types";

export function FeedbackList({
  feedback,
  detailsBasePath = "/admin/feedback",
  resetHref = "/admin",
}: {
  feedback: Feedback[];
  detailsBasePath?: string;
  resetHref?: string;
}) {
  return (
    <>
      <div className="admin-list-heading">
        <h2>{feedback.length} feedback</h2>
        <p>Sắp xếp mới nhất trước</p>
      </div>

      {feedback.length === 0 ? (
        <div className="empty-state admin-empty-state">
          <h3>Không có feedback phù hợp</h3>
          <p>Thử xóa bộ lọc hoặc quay lại sau khi có submission mới.</p>
          <Link className="button button-secondary" href={resetHref}>
            Xem tất cả
          </Link>
        </div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Feedback</th>
                  <th scope="col">App</th>
                  <th scope="col">Trạng thái</th>
                  <th scope="col">Ngày gửi</th>
                  <th scope="col">
                    <span className="sr-only">Hành động</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {feedback.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="type-label">{feedbackTypeLabels[item.type]}</span>
                      <strong>{item.title}</strong>
                      <small>{feedbackExcerpt(item.content)}</small>
                    </td>
                    <td>{getFeedbackAppName(item.appSlug)}</td>
                    <td>
                      <span className={`status-badge status-${item.status}`}>
                        {feedbackStatusLabels[item.status]}
                      </span>
                    </td>
                    <td>{formatFeedbackDate(item.createdAt)}</td>
                    <td>
                      <Link className="table-link" href={`${detailsBasePath}/${item.id}`}>
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-card-list">
            {feedback.map((item) => (
              <article className="admin-feedback-card" key={item.id}>
                <div className="admin-card-topline">
                  <span className="type-label">{feedbackTypeLabels[item.type]}</span>
                  <span className={`status-badge status-${item.status}`}>
                    {feedbackStatusLabels[item.status]}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <p className="admin-feedback-excerpt">
                  {feedbackExcerpt(item.content, 150)}
                </p>
                <dl>
                  <div>
                    <dt>App</dt>
                    <dd>{getFeedbackAppName(item.appSlug)}</dd>
                  </div>
                  <div>
                    <dt>Ngày gửi</dt>
                    <dd>{formatFeedbackDate(item.createdAt)}</dd>
                  </div>
                </dl>
                <Link className="button button-secondary" href={`${detailsBasePath}/${item.id}`}>
                  Xem chi tiết
                </Link>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
