import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FeedbackDetail } from "@/components/admin/feedback-detail";
import { requireAdmin } from "@/features/auth/authorization";
import { getFeedbackById } from "@/features/feedback/data";

export const metadata: Metadata = { title: "Chi tiết feedback" };
export const dynamic = "force-dynamic";

type FeedbackDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function FeedbackDetailPage({ params }: FeedbackDetailPageProps) {
  await requireAdmin();
  const { id } = await params;
  const feedback = await getFeedbackById(id);

  if (!feedback) {
    notFound();
  }

  return (
    <section className="page-section admin-detail-page">
      <div className="shell detail-shell">
        <FeedbackDetail feedback={feedback} />
      </div>
    </section>
  );
}
