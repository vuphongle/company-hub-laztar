import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="LAZTAR Hub - Trang chủ">
          <span className="brand-copy">
            <strong>LAZTAR <em>Hub</em></strong>
            <small>Internal playground</small>
          </span>
        </Link>

        <nav className="primary-nav" aria-label="Điều hướng chính">
          <Link href="/">Khám phá app</Link>
          <Link href="/feedback">Góp ý</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
