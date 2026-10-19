import Link from "next/link";
import { apps } from "@/data/apps";
import { ArrowMark } from "@/components/arrow-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-brand">
          <Link href="/" aria-label="LAZTAR Hub trang chủ">
            LAZTAR<span aria-hidden="true">✳</span>
          </Link>
          <p>
            Chơi cùng nhau.
            <br />
            Build cùng nhau.
          </p>
        </div>
        <nav aria-label="Project trong footer">
          <h2>Playground</h2>
          {apps.map((app) => (
            <Link key={app.id} href={`/apps/${app.slug}`}>
              {app.name}
              <ArrowMark />
            </Link>
          ))}
        </nav>
        <nav aria-label="Thông tin trong footer">
          <h2>Ở đây còn có</h2>
          <Link href="/about">Về Hub</Link>
          <Link href="/feedback">Góp ý & tham gia</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
      <div className="shell footer-bottom">
        <p>Dự án nội bộ của đội ngũ LAZTAR.</p>
        <p>
          Thông tin công ty & dịch vụ:{" "}
          <a href="https://laztar.com">laztar.com <ArrowMark /></a>
        </p>
      </div>
    </footer>
  );
}
