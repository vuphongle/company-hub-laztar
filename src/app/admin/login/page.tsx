import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/admin/login-form";
import { getAdminSession } from "@/features/auth/authorization";

export const metadata: Metadata = { title: "Admin login" };
export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const [{ error }, session] = await Promise.all([searchParams, getAdminSession()]);

  return (
    <section className="page-section login-page">
      <div className="shell login-shell">
        <div className="login-copy">
          <p className="eyebrow">Private area</p>
          <h1>Quản lý feedback gọn gàng, không cần một dashboard khổng lồ.</h1>
          <p>Chỉ tài khoản đã được thêm vào danh sách admin mới có thể truy cập.</p>
          <Link className="text-link" href="/">
            ← Quay lại Company Hub
          </Link>
        </div>

        <div className="login-panel">
          <h2>Admin login</h2>
          <p>Dùng tài khoản Supabase Auth được cấp quyền admin.</p>
          {!session.configured && (
            <div className="inline-alert" role="status">
              Supabase chưa được cấu hình. Hãy tạo file `.env.local` từ `.env.example`.
            </div>
          )}
          {error === "not-authorized" && (
            <div className="inline-alert" role="alert">
              Tài khoản hiện tại không nằm trong danh sách admin.
            </div>
          )}
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
