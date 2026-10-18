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
              creator: { "@id": `${site.url}/#internal-team` },
              publisher: { "@id": `${site.url}/#internal-team` },
            },
            {
              "@type": "Organization",
              "@id": `${site.url}/#internal-team`,
              name: site.teamName,
              description: "Nhóm nhân viên LAZTAR phát triển các dự án nội bộ và thử nghiệm.",
              parentOrganization: {
                "@type": "Organization",
                name: site.companyName,
                url: `${site.companyUrl}/`,
              },
            },
            {
              "@type": "ItemList",
              name: "Các ứng dụng của LAZTAR",
              itemListElement: apps.map((app, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: app.name,
                url: `${site.url}/apps/${app.slug}`,
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
              Ứng dụng nội bộ LAZTAR
            </p>
            <h1>LAZTAR Hub</h1>
            <p className="hero-description">
              Khám phá các ứng dụng và dự án của LAZTAR.
              <span> Chơi Ma Sói online, chọn và bình chọn nhạc cùng Office Jukebox,
                trải nghiệm dashboard Sao kê và góp ý để cùng làm các project tốt hơn.</span>
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

      <section className="discovery-section" aria-labelledby="discovery-title">
        <div className="shell discovery-grid">
          <div>
            <p className="eyebrow">LAZTAR Hub là gì?</p>
            <h2 id="discovery-title">Một nơi để chơi, build và chia sẻ app nội bộ</h2>
          </div>
          <div className="discovery-copy">
            <p>
              <strong>LAZTAR Hub</strong> là dự án nội bộ do nhân viên và thành viên của <a className="text-link" href={site.companyUrl}>LAZTAR</a>
              xây dựng để thử nghiệm và chia sẻ các ứng dụng web, game và công cụ.
              Đây không phải website giới thiệu công ty hay dịch vụ; thông tin về công ty và dịch vụ được cung cấp tại <a className="text-link" href={site.companyUrl}>laztar.com</a>.
            </p>
            <p>
              Muốn chơi Ma Sói online với bạn bè hoặc đồng nghiệp? Hãy thử phiên bản
              có quản trò tự động. Muốn cả văn phòng cùng chọn nhạc? Office Jukebox
              hỗ trợ chọn bài và bình chọn trong một danh sách chung.
            </p>
            <Link className="text-link" href="/about">
              Đọc thêm về LAZTAR Hub
            </Link>
          </div>
        </div>
      </section>

      <section className="faq-section" aria-labelledby="faq-title">
        <div className="shell">
          <div className="page-heading">
            <p className="eyebrow">Câu hỏi thường gặp</p>
            <h2 id="faq-title">Tìm nhanh thông tin về các ứng dụng LAZTAR</h2>
          </div>
          <div className="faq-list">
            <details>
              <summary>LAZTAR Hub là gì?</summary>
              <p>
                LAZTAR Hub là danh mục các ứng dụng nội bộ và dự án thử nghiệm của
                LAZTAR, gồm game, công cụ âm nhạc và các trải nghiệm web.
              </p>
            </details>
            <details>
              <summary>Ma Sói của LAZTAR có chơi online được không?</summary>
              <p>
                Có. Trang giới thiệu Ma Sói dẫn tới game web để nhóm bạn hoặc đồng
                nghiệp chuẩn bị và chơi một ván với quản trò tự động.
              </p>
            </details>
            <details>
              <summary>Office Jukebox dùng để làm gì?</summary>
              <p>
                Office Jukebox giúp mọi người trong văn phòng cùng chọn bài hát và
                bình chọn danh sách nhạc chung. Quyền truy cập tùy cấu hình nội bộ.
              </p>
            </details>
            <details>
              <summary>LAZTAR Hub có phải website chính của LAZTAR không?</summary>
              <p>
                Không. Đây là dự án nội bộ để thử nghiệm và chia sẻ ứng dụng. Thông tin
                về công ty và dịch vụ được đăng trên <a className="text-link" href={site.companyUrl}>laztar.com</a>.
              </p>
            </details>
          </div>
        </div>
      </section>

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
