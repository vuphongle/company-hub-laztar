import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fredoka";
import "@fontsource-variable/nunito-sans";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Company Hub",
    template: "%s | Company Hub",
  },
  description: "Một điểm đến cho các app và ý tưởng trong công ty.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff8ef",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
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
