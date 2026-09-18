import type { Metadata } from "next";

import { FeedbackForm } from "@/components/feedback/feedback-form";

export const metadata: Metadata = {
  title: "Góp ý & tham gia",
  description: "Báo bug, đề xuất tính năng, chia sẻ ý tưởng hoặc tham gia xây project nội bộ.",
};

export default function FeedbackPage() {
  return (
    <section className="page-section feedback-page">
      <div className="shell narrow-shell">
        <div className="page-heading">
          <p className="eyebrow">Feedback & contribution</p>
          <h1>Có idea thì góp vào.</h1>
          <p>
            Hub này là của mọi người. Báo một bug, đề xuất feature, gửi idea hoặc nói
            với team rằng bạn muốn cùng build một project nào đó.
          </p>
        </div>
        <div className="form-panel">
          <FeedbackForm />
        </div>
      </div>
    </section>
  );
}
