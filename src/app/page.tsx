import Link from "next/link";

import { AppDirectory } from "@/components/app-directory";
import { PlaygroundPortrait } from "@/components/playground-portrait";
import { HeroScene } from "@/components/hero-scene";
import { PlaygroundMotion } from "@/components/playground-motion";
import { StructuredData } from "@/components/structured-data";
import { publicPageMetadata, site } from "@/config/site";
import { apps } from "@/data/apps";
import { ArrowMark } from "@/components/arrow-mark";

export const metadata = publicPageMetadata({
  title: site.title,
  description: site.description,
  path: "/",
});

export default function HomePage() {
  return (
    <PlaygroundMotion>
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
              description:
                "Nhóm nhân viên LAZTAR phát triển các dự án nội bộ và thử nghiệm.",
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
      <section className="hero-section" data-motion-region>
        <div className="hero-noise" aria-hidden="true" />
        <div className="shell hero-stage">
          <div className="hero-copy">
            <p className="hero-kicker" data-intro="0">
              <span aria-hidden="true" /> LAZTAR / THE LIVING PLAYGROUND
            </p>
            <h1 aria-label="Small ideas. Wild worlds.">
              <span>Small ideas.</span>
              <span>Wild worlds.</span>
            </h1>
            <p className="hero-description">
              Ba project đang sống ở đây. Chọn một mood, chạm vào một ý tưởng,
              xem nó đi đâu.
            </p>
          </div>
          <HeroScene apps={apps} />
          <div className="hero-footerline" data-intro="3">
            <span>
              <strong>{String(apps.length).padStart(2, "0")}</strong> project
              đang live
            </span>
            <a className="hero-jump" href="#directory-title">
              Đi vào playground <span aria-hidden="true"><ArrowMark direction="down" /></span>
            </a>
            <Link className="hero-feedback" href="/feedback">
              Ném một idea <ArrowMark />
            </Link>
          </div>
        </div>
        <div className="hero-marquee" aria-hidden="true">
          <div>
            {Array.from({ length: 3 }, (_, index) => (
              <span className="hero-marquee-copy" key={index}>
                PLAY <i>✳</i> BUILD <i>✳</i> EXPERIMENT <i>✳</i> SHARE <i>✳</i>{" "}
              </span>
            ))}
          </div>
          <div>
            {Array.from({ length: 3 }, (_, index) => (
              <span className="hero-marquee-copy" key={index}>
                PLAY <i>✳</i> BUILD <i>✳</i> EXPERIMENT <i>✳</i> SHARE <i>✳</i>{" "}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="shell">
        <AppDirectory apps={apps} />
      </div>

      <section
        className="principles-section"
        aria-labelledby="principles-title"
      >
        <div className="principles-sticky shell">
          <div className="principles-orbit" aria-hidden="true"><span>PLAY</span><span>BUILD</span><span>SHARE</span></div>
          <div className="principles-intro">
            <p className="eyebrow">There is always room for one more</p>
            <h2 id="principles-title">
              Thế giới tiếp theo?
              <br />
              <em>Bắt đầu từ bạn.</em>
            </h2>
            <p>
              Từ một ý tưởng nhỏ đến một app có thể dùng cùng nhau. Chơi thử,
              góp một ý, hoặc mang đến một project mới cho playground.
            </p>
          </div>
          <div className="principles-list">
            <div className="principle-row">
              <span>01</span>
              <strong>Play first</strong>
              <p>
                Mở app nhanh. Hiểu nó bằng cách dùng, không cần slide giới
                thiệu.
              </p>
              <b><ArrowMark /></b>
            </div>
            <div className="principle-row">
              <span>02</span>
              <strong>Build in public</strong>
              <p>Thử nghiệm nhỏ, feedback thật, thay đổi ngay khi còn dễ.</p>
              <b><ArrowMark /></b>
            </div>
            <div className="principle-row">
              <span>03</span>
              <strong>Share the spark</strong>
              <p>
                Một idea hay chỉ có giá trị khi người khác có thể chạm vào nó.
              </p>
              <b><ArrowMark /></b>
            </div>
          </div>
        </div>
      </section>

      <section className="discovery-section" aria-labelledby="discovery-title">
        <div className="shell home-about">
          <div className="home-about-heading">
            <p className="eyebrow">Không gian chung của team</p>
            <h2 id="discovery-title">
              Build một thứ.
              <br />
              Mở ra cho mọi người.
            </h2>
          </div>
          <PlaygroundPortrait />
          <div className="home-about-copy">
            <p>
              LAZTAR Hub là góc thử nghiệm nội bộ do nhân viên và thành viên
              LAZTAR xây dựng. Game, âm nhạc, dashboard: mỗi project bắt đầu từ
              một điều team muốn thử.
            </p>
            <div>
              <p>
                Khám phá app, chia sẻ feedback, hoặc mang đến một ý tưởng mới.
                Thông tin về công ty và dịch vụ ở{" "}
                <a className="text-link" href={site.companyUrl}>
                  laztar.com
                </a>
                .
              </p>
              <Link className="text-link" href="/about">
                Câu chuyện của playground <ArrowMark />
              </Link>
            </div>
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
                LAZTAR Hub là danh mục các ứng dụng nội bộ và dự án thử nghiệm
                của LAZTAR, gồm game, công cụ âm nhạc và các trải nghiệm web.
              </p>
            </details>
            <details>
              <summary>Ma Sói của LAZTAR có chơi online được không?</summary>
              <p>
                Có. Trang giới thiệu Ma Sói dẫn tới game web để nhóm bạn hoặc
                đồng nghiệp chuẩn bị và chơi một ván với quản trò tự động.
              </p>
            </details>
            <details>
              <summary>Office Jukebox dùng để làm gì?</summary>
              <p>
                Office Jukebox giúp mọi người trong văn phòng cùng chọn bài hát
                và bình chọn danh sách nhạc chung. Quyền truy cập tùy cấu hình
                nội bộ.
              </p>
            </details>
            <details>
              <summary>
                LAZTAR Hub có phải website chính của LAZTAR không?
              </summary>
              <p>
                Không. Đây là dự án nội bộ để thử nghiệm và chia sẻ ứng dụng.
                Thông tin về công ty và dịch vụ được đăng trên{" "}
                <a className="text-link" href={site.companyUrl}>
                  laztar.com
                </a>
                .
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="feedback-cta">
        <div className="closing-stage shell">
        <div className="closing-orbit" aria-hidden="true"><i /><i /><i /><span>✳</span></div>
        <div className="feedback-cta-card">
          <div>
            <p className="eyebrow">Cùng làm cho Hub hay hơn</p>
            <h2>
              Ý tưởng tiếp theo.
              <br />
              Có thể là của bạn.
            </h2>
            <p className="feedback-cta-copy">
              Báo lỗi, đề xuất feature, ném vào một idea hay nói với team rằng
              bạn muốn tham gia.
            </p>
          </div>
          <Link className="button button-dark" href="/feedback">
            Góp một ý <ArrowMark />
          </Link>
        </div>
        </div>
      </section>
    </PlaygroundMotion>
  );
}
