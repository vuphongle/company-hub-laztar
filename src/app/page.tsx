import Link from "next/link";

import { AppDirectory } from "@/components/app-directory";
import { StructuredData } from "@/components/structured-data";
import { publicPageMetadata, site } from "@/config/site";
import { apps } from "@/data/apps";

export const metadata = publicPageMetadata({
  title: site.title,
  description: site.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${site.url}/#website`,
              url: `${site.url}/`,
              name: site.name,
              alternateName: "LAZTAR",
              description: site.description,
              inLanguage: "vi",
            },
            {
              "@type": "ItemList",
              name: "Các ứng dụng của LAZTAR",
              itemListElement: apps.map((app, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: app.name,
                url: `${site.url}/ung-dung/${app.id}`,
              })),
            },
          ],
        }}
      />
      <section className="hero-section">
        <div className="shell hero-grid">
          <div className="hero-copy reveal">
            <p className="hero-kicker">
              <span aria-hidden="true" />
              Internal playground
            </p>
            <h1>LAZTAR Hub</h1>
            <p className="hero-description">
              Khám phá các ứng dụng và dự án của LAZTAR.
              <span> Chơi Ma Sói, chọn nhạc cùng Office Jukebox, trải nghiệm Sao kê
                và góp ý để cùng làm các project tốt hơn.</span>
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#directory-title">
                Khám phá ứng dụng
              </a>
              <Link className="button button-secondary" href="/feedback">
                Góp ý hoặc tham gia
              </Link>
            </div>
          </div>

          <div className="hero-visual reveal reveal-delay" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="hero-window">
              <div className="window-bar">
                <span />
                <span />
                <span />
              </div>
              <div className="window-content">
                <div className="mini-card mini-card-orange">Play</div>
                <div className="mini-card mini-card-blue">Build</div>
                <div className="mini-card mini-card-green">Share</div>
              </div>
            </div>
            <span className="spark spark-one">+</span>
            <span className="spark spark-two">+</span>
          </div>
        </div>
      </section>

      <div className="shell">
        <AppDirectory apps={apps} />
      </div>

      <section className="feedback-cta">
        <div className="shell feedback-cta-card">
          <div>
            <p className="eyebrow">Cùng làm cho Hub hay hơn</p>
            <h2>Đây là project của mọi người. Có idea thì góp vào.</h2>
            <p className="feedback-cta-copy">Báo lỗi, đề xuất feature, ném vào một idea hay nói với team rằng bạn muốn tham gia.</p>
          </div>
          <Link className="button button-dark" href="/feedback">
            Góp một ý
          </Link>
        </div>
      </section>
    </>
  );
}
