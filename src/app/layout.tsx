import type { Metadata, Viewport } from "next";
import "./fonts.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/config/site";

import "./globals.css";
import "./playground.css";
import "./public-pages.css";
import "./motion-experience.css";
import "./mobile-header.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "LAZTAR Hub",
    template: "%s | LAZTAR Hub",
  },
  description: site.description,
  applicationName: site.name,
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#18151f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">
          Đi đến nội dung chính
        </a>
        <div className="site-frame">
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
