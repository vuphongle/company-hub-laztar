import Link from "next/link";

import { PlaygroundPortrait } from "@/components/playground-portrait";
import { PlaygroundMotion } from "@/components/playground-motion";
import { StructuredData } from "@/components/structured-data";
import { publicPageMetadata } from "@/config/site";
import { site } from "@/config/site";
import { apps } from "@/data/apps";

export const metadata = publicPageMetadata({
  title: "LAZTAR Hub là gì? Dự án nội bộ của đội ngũ LAZTAR",
  description:
    "Tìm hiểu LAZTAR Hub, dự án nội bộ do đội ngũ LAZTAR xây dựng để thử nghiệm Ma Sói, Office Jukebox, Sao kê và các ứng dụng web.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PlaygroundMotion>
      <section className="about-page">
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "@id": `${site.url}/about#about-page`,
            url: `${site.url}/about`,
            name: "LAZTAR Hub là gì?",
            about: { "@id": `${site.url}/#website` },
            isPartOf: { "@id": `${site.url}/#website` },
            publisher: { "@id": `${site.url}/#internal-team` },
          }}
        />
        <article className="shell about-editorial">
          <header className="about-heading">
            <p className="eyebrow">LAZTAR Hub / về playground này</p>
            <h1>
              Ý tưởng nhỏ.
              <br />
              Không gian lớn.
            </h1>
            <div className="about-lede">
              <span aria-hidden="true">✳</span>
              <p>
                Chỗ dành cho những thứ team muốn chơi, muốn build, muốn chia sẻ.
                Kể cả khi chúng vẫn đang là thử nghiệm.
              </p>
            </div>
          </header>
          <PlaygroundPortrait eager />
          <section className="about-story" aria-labelledby="about-story-title">
            <h2 id="about-story-title">
              Một góc riêng
              <br />
              của đội ngũ LAZTAR.
            </h2>
            <div>
              <p>
                LAZTAR Hub tại laztar.xyz là dự án nội bộ do nhân viên và thành
                viên{" "}
                <a className="text-link" href={site.companyUrl}>
                  LAZTAR
                </a>{" "}
                xây dựng. Từ một ván game sau giờ làm, một playlist chung, đến
                một cách trình bày dữ liệu khác thường.
              </p>
              <p>
                Đây là nơi các project được tìm thấy và dùng cùng nhau. Tìm theo
                tên, lọc theo nhóm, hoặc chọn một thế giới từ homepage.
              </p>
              <p>
                Hub không thay thế website giới thiệu công ty hay dịch vụ. Thông
                tin chính thức về doanh nghiệp nằm ở{" "}
                <a className="text-link" href={site.companyUrl}>
                  laztar.com
                </a>
                .
              </p>
            </div>
          </section>
          <section
            className="about-project-index"
            aria-labelledby="about-project-title"
          >
            <div className="about-index-heading">
              <h2 id="about-project-title">Đang sống ở đây.</h2>
              <p>{apps.length} project, mỗi cái một nhịp.</p>
            </div>
            {apps.map((app) => (
              <Link
                href={`/apps/${app.slug}`}
                key={app.id}
                className={`about-project-row about-project-${app.icon}`}
              >
                <span>{app.category}</span>
                <div>
                  <h3>{app.name}</h3>
                  <p>{app.description}</p>
                </div>
                <b aria-hidden="true">↗</b>
              </Link>
            ))}
          </section>
          <section className="about-join" aria-labelledby="about-join-title">
            <p className="eyebrow">Còn chỗ cho ý tưởng của bạn</p>
            <h2 id="about-join-title">
              Chơi thử.
              <br />
              Góp một ý.
              <br />
              Build cùng nhau.
            </h2>
            <div>
              <p>
                Bạn có thể xem danh mục và giới thiệu project ngay trên Hub. Một
                số ứng dụng có thể yêu cầu quyền truy cập riêng của nhóm hoặc
                văn phòng.
              </p>
              <p>
                Có bug, đề xuất tính năng hoặc muốn tham gia? Khi góp ý, thêm
                project liên quan và các bước tái hiện để team hiểu đúng ngữ
                cảnh. Với app có GitHub, mã nguồn được liên kết ngay trên trang
                project.
              </p>
              <Link className="button button-primary" href="/feedback">
                Góp vào playground
              </Link>
            </div>
          </section>
        </article>
      </section>
    </PlaygroundMotion>
  );
}
