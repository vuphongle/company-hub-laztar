import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { getAdminSession } from "@/features/auth/authorization";

export const metadata: Metadata = { title: "Admin login" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <section className="page-section login-page">
      <div className="shell login-shell">
        <div className="login-copy">
          <p className="eyebrow">Private area</p>
          <h1>Quản lý feedback gọn gàng, không cần một dashboard khổng lồ.</h1>
          <p>Chỉ tài khoản đã được thêm vào danh sách admin mới có thể truy cập.</p>
          <Link className="text-link" href="/">
            ← Quay lại LAZTAR Hub
          </Link>
        </div>

        <div className="login-panel">
          <h2>Admin login</h2>
          <p>Dùng tài khoản admin được lưu an toàn trong database nội bộ.</p>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
