import type { Metadata } from "next";
import Link from "next/link";

import { FeedbackList } from "@/components/admin/feedback-list";
import { signOut } from "@/features/auth/actions";
import { requireAdmin } from "@/features/auth/authorization";
import { listFeedback } from "@/features/feedback/data";
import { feedbackStatusLabels, feedbackTypeLabels } from "@/features/feedback/presentation";
import {
  feedbackStatuses,
  feedbackTypes,
  type FeedbackStatus,
  type FeedbackType,
} from "@/features/feedback/types";

export const metadata: Metadata = { title: "Feedback Admin" };
export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams: Promise<{ status?: string; type?: string }>;
};

function isFeedbackStatus(value?: string): value is FeedbackStatus {
  return feedbackStatuses.includes(value as FeedbackStatus);
}

function isFeedbackType(value?: string): value is FeedbackType {
  return feedbackTypes.includes(value as FeedbackType);
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const user = await requireAdmin();
  const params = await searchParams;
  const status = isFeedbackStatus(params.status) ? params.status : undefined;
  const type = isFeedbackType(params.type) ? params.type : undefined;
  const feedback = await listFeedback({ status, type });

  return (
    <section className="page-section admin-page">
      <div className="shell">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">Admin workspace</p>
            <h1>Feedback inbox</h1>
            <p>Xin chào {user.email}. Đây là toàn bộ feedback phù hợp với bộ lọc.</p>
          </div>
          <form action={signOut}>
            <button className="button button-secondary" type="submit">
              Đăng xuất
            </button>
          </form>
        </div>

        <form className="admin-filters" method="get">
          <div className="form-field compact-field">
            <label htmlFor="status-filter">Trạng thái</label>
            <select id="status-filter" name="status" defaultValue={status ?? ""}>
              <option value="">Tất cả trạng thái</option>
              {feedbackStatuses.map((item) => (
                <option value={item} key={item}>
                  {feedbackStatusLabels[item]}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field compact-field">
            <label htmlFor="type-filter">Loại</label>
            <select id="type-filter" name="type" defaultValue={type ?? ""}>
              <option value="">Tất cả loại</option>
              {feedbackTypes.map((item) => (
                <option value={item} key={item}>
                  {feedbackTypeLabels[item]}
                </option>
              ))}
            </select>
          </div>
          <button className="button button-dark filter-submit" type="submit">
            Áp dụng bộ lọc
          </button>
          {(status || type) && (
            <Link className="button button-ghost" href="/admin">
              Xóa lọc
            </Link>
          )}
        </form>

        <FeedbackList feedback={feedback} />
      </div>
    </section>
  );
}
