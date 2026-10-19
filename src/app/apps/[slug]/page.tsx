import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectTheater } from "@/components/project-theater";
import { PlaygroundMotion } from "@/components/playground-motion";
import { StructuredData } from "@/components/structured-data";
import { publicPageMetadata, site } from "@/config/site";
import { appGuides } from "@/data/app-guides";
import { apps, getAppBySlug } from "@/data/apps";
import { ArrowMark } from "@/components/arrow-mark";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return apps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) notFound();

  return publicPageMetadata({
    title: `${app.name} — Giới thiệu ứng dụng | LAZTAR Hub`,
    description: app.description,
    path: `/apps/${app.slug}`,
  });
}

export default async function AppPage({ params }: Props) {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  const guide = app ? appGuides[app.id] : undefined;
  if (!app || !guide) notFound();

  return (
    <PlaygroundMotion>
      <section className={`project-page project-page-${app.icon}`}>
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: site.name,
                    item: `${site.url}/`,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: app.name,
                    item: `${site.url}/apps/${app.slug}`,
                  },
                ],
              },
              {
                "@type": "SoftwareApplication",
                name: app.name,
                description: app.description,
                url: `${site.url}/apps/${app.slug}`,
                applicationCategory:
                  app.category === "Game"
                    ? "GameApplication"
                    : "WebApplication",
                operatingSystem: "Web",
                publisher: { "@id": `${site.url}/#internal-team` },
              },
            ],
          }}
        />
        <article className="shell project-article">
          <nav aria-label="Đường dẫn trang" className="breadcrumbs">
            <Link href="/">Playground</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{app.name}</span>
          </nav>
          <header className="project-heading">
            <p className="eyebrow">{app.category} / LAZTAR project</p>
            <h1>{app.name}</h1>
            <span className="project-live">
              <i aria-hidden="true" /> Đang hoạt động
            </span>
          </header>
          <div className="project-cover-runway" data-world={app.icon}>
          <div className="project-cover">
            <ProjectTheater icon={app.icon} />
            <div className="project-intro">
              <p className="project-deck">{app.description}</p>
              <p>{guide.overview}</p>
              <div className="hero-actions">
                <a
                  className="button button-primary project-open"
                  href={app.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Mở {app.name} <ArrowMark />
                  <span className="sr-only"> trong tab mới</span>
                </a>
                {app.githubUrl && (
                  <a
                    className="project-source"
                    href={app.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub{" "}
                    <span className="sr-only">
                      của {app.name}, mở trong tab mới
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
          </div>
          <section
            className="project-capabilities"
            aria-labelledby="capabilities-title"
          >
            <div className="project-section-title">
              <p className="eyebrow">Trong project này</p>
              <h2 id="capabilities-title">
                Một cách khác
                <br />
                để cùng nhau.
              </h2>
            </div>
            <ul>
              {guide.highlights.map((item, index) => (
                <li key={item}>
                  <span aria-hidden="true">{["✦", <ArrowMark key="arrow" />, "✳"][index]}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </section>
          <section
            className="project-get-started"
            aria-labelledby="start-title"
          >
            <div>
              <p className="eyebrow">Từ đây đến app</p>
              <h2 id="start-title">Bắt đầu trải nghiệm</h2>
              <p className="project-note">{guide.note}</p>
            </div>
            <ol>
              {guide.steps.map((item, index) => (
                <li key={item}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>
          </section>
          <aside className="project-feedback">
            <div>
              <h2>Thử rồi? Kể team nghe.</h2>
              <p>
                Có lỗi cần báo hoặc ý tưởng muốn thử? Chọn {app.name} trong mục
                ứng dụng liên quan.
              </p>
            </div>
            <Link className="button button-primary" href="/feedback">
              Gửi góp ý
            </Link>
          </aside>
          <nav className="next-projects" aria-label="Các project khác">
            <p className="eyebrow">Đi tiếp trong playground</p>
            {apps
              .filter((item) => item.id !== app.id)
              .map((item) => (
                <Link href={`/apps/${item.slug}`} key={item.id}>
                  <span>{item.category}</span>
                  <strong>{item.name}</strong>
                  <b aria-hidden="true"><ArrowMark /></b>
                </Link>
              ))}
          </nav>
        </article>
      </section>
    </PlaygroundMotion>
  );
}
