import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-section">
      <div className="shell narrow-shell empty-state not-found-state">
        <p className="eyebrow">404</p>
        <h1>Trang này không còn ở đây.</h1>
        <p>Quay lại LAZTAR Hub để tìm đúng app hoặc khu vực bạn cần.</p>
        <Link className="button button-primary" href="/">
          Về trang chủ
        </Link>
      </div>
    </section>
  );
}
