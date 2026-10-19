"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowMark } from "@/components/arrow-mark";

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/">
          <Image
            className="brand-mark"
            src="/brand-mark.webp"
            alt=""
            width={48}
            height={48}
            unoptimized
          />
          <span className="brand-copy">
            <strong>
              LAZTAR <em>/ Hub</em>
            </strong>
            <small>play · build · share</small>
          </span>
        </Link>

        <nav className="primary-nav" aria-label="Điều hướng chính">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
            Projects <ArrowMark direction="down-right" />
          </Link>
          <Link
            href="/about"
            aria-current={pathname === "/about" ? "page" : undefined}
          >
            About
          </Link>
          <Link
            className="nav-feedback"
            href="/feedback"
            aria-current={pathname === "/feedback" ? "page" : undefined}
          >
            Góp ý <ArrowMark />
          </Link>
          <Link
            className="nav-admin"
            href="/admin"
            aria-current={pathname.startsWith("/admin") ? "page" : undefined}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
