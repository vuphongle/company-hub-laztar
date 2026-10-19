import type { Metadata } from "next";

import { FeedbackForm } from "@/components/feedback/feedback-form";

export const metadata: Metadata = {
  title: "Góp ý & tham gia",
  description:
    "Báo bug, đề xuất tính năng, chia sẻ ý tưởng hoặc tham gia xây project nội bộ.",
  robots: { index: false, follow: true },
};

export default function FeedbackPage() {
  return (
    <section className="page-section feedback-page">
      <div className="shell feedback-layout">
        <div className="page-heading feedback-heading">
          <p className="eyebrow">Feedback & contribution</p>
          <h1>Có idea thì góp vào.</h1>
          <p>
            Hub này là của mọi người. Báo một bug, đề xuất feature, gửi idea
            hoặc nói với team rằng bạn muốn cùng build một project nào đó.
          </p>
          <div className="feedback-spark" aria-hidden="true"><span>✳</span><i /></div>
          <div className="feedback-side-note">
            <span aria-hidden="true">✳</span>
            <p>
              Một ý tưởng chưa cần hoàn hảo.
              <br />
              Chỉ cần đủ rõ để cùng bắt đầu.
            </p>
          </div>
          <p className="feedback-privacy">
            Góp ý được gửi vào inbox riêng của team. Không hiển thị công khai
            trên Hub.
          </p>
        </div>
        <div className="form-panel">
          <FeedbackForm />
        </div>
      </div>
    </section>
  );
}
