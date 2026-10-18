import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StructuredData } from "@/components/structured-data";
import { publicPageMetadata, site } from "@/config/site";
import { appGuides } from "@/data/app-guides";
import { apps, getAppBySlug } from "@/data/apps";

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
    <section className="page-section">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: site.name, item: `${site.url}/` },
                { "@type": "ListItem", position: 2, name: app.name, item: `${site.url}/apps/${app.slug}` },
              ],
            },
            {
              "@type": "SoftwareApplication",
              name: app.name,
              description: app.description,
              url: `${site.url}/apps/${app.slug}`,
              applicationCategory: app.category === "Game" ? "GameApplication" : "WebApplication",
              operatingSystem: "Web",
              publisher: { "@type": "Organization", name: "LAZTAR", url: `${site.url}/` },
            },
          ],
        }}
      />
      <article className="shell narrow-shell content-page">
        <nav aria-label="Đường dẫn trang" className="breadcrumbs">
          <Link href="/">LAZTAR Hub</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{app.name}</span>
        </nav>
        <div className="page-heading">
          <p className="eyebrow">Ứng dụng của LAZTAR · {app.category}</p>
          <h1>{app.name}</h1>
          <p>{app.description}</p>
        </div>
        <p>{guide.overview}</p>
        <h2>Bạn có thể làm gì với {app.name}?</h2>
        <ul>{guide.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
        <h2>Bắt đầu trải nghiệm</h2>
        <ol>{guide.steps.map((item) => <li key={item}>{item}</li>)}</ol>
        <p>{guide.note}</p>
        <div className="hero-actions">
          <a className="button button-primary" href={app.url} target="_blank" rel="noreferrer">
            Mở {app.name}<span className="sr-only"> trong tab mới</span>
          </a>
          {app.githubUrl && (
            <a className="button button-secondary" href={app.githubUrl} target="_blank" rel="noreferrer">
              Xem mã nguồn GitHub<span className="sr-only"> trong tab mới</span>
            </a>
          )}
        </div>
        <h2>Cùng cải thiện ứng dụng</h2>
        <p>
          Có lỗi cần báo hoặc tính năng muốn đề xuất? <Link href="/feedback">Gửi góp ý cho LAZTAR</Link>
          {" "}và chọn {app.name} trong mục ứng dụng liên quan.
        </p>
        <p><Link href="/">Khám phá các ứng dụng khác của LAZTAR Hub</Link></p>
      </article>
    </section>
  );
}
