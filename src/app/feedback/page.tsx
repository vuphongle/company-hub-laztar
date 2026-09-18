import type { Metadata } from "next";

import { FeedbackForm } from "@/components/feedback/feedback-form";

export const metadata: Metadata = {
  title: "Gửi feedback",
  description: "Báo bug, đề xuất tính năng, chia sẻ ý tưởng hoặc đăng ký đóng góp.",
};

export default function FeedbackPage() {
  return (
    <section className="page-section feedback-page">
      <div className="shell narrow-shell">
        <div className="page-heading">
          <p className="eyebrow">Feedback & contribution</p>
          <h1>Chia sẻ điều bạn đang nghĩ.</h1>
          <p>
            Báo một lỗi, đề xuất tính năng, gửi ý tưởng hoặc cho team biết bạn muốn
            cùng xây dựng project nào đó.
          </p>
        </div>
        <div className="form-panel">
          <FeedbackForm />
        </div>
      </div>
    </section>
  );
}
