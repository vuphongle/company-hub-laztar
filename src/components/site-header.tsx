import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Company Hub - Trang chủ">
          <span className="brand-mark" aria-hidden="true">
            CH
          </span>
          <span className="brand-copy">
            <strong>Company Hub</strong>
            <small>One link, many good things</small>
          </span>
        </Link>

        <nav className="primary-nav" aria-label="Điều hướng chính">
          <Link href="/">Ứng dụng</Link>
          <Link href="/feedback">Gửi feedback</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
