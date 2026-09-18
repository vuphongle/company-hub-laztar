"use client";

import {
  ArrowUpRight,
  GameController,
  GithubLogo,
  MagnifyingGlass,
  MusicNotes,
  Receipt,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import {
  appCategories,
  type AppCategory,
  type AppIconName,
  type CompanyApp,
} from "@/data/apps";

const statusLabels = {
  live: "Đang hoạt động",
  beta: "Beta",
  coming_soon: "Sắp ra mắt",
} as const;

function AppGlyph({ name }: { name: AppIconName }) {
  const iconProps = { size: 30, weight: "duotone" as const, "aria-hidden": true };

  if (name === "music") return <MusicNotes {...iconProps} />;
  if (name === "receipt") return <Receipt {...iconProps} />;
  return <GameController {...iconProps} />;
}

function AppCard({ app }: { app: CompanyApp }) {
  return (
    <article className={`app-card app-card-${app.icon}`}>
      <div className="app-card-topline">
        <span className={`app-icon app-icon-${app.icon}`}>
          <AppGlyph name={app.icon} />
        </span>
        <span className={`status-badge status-${app.status}`}>
          {statusLabels[app.status]}
        </span>
      </div>
      <div className="app-card-copy">
        <p className="eyebrow">{app.category}</p>
        <h3>{app.name}</h3>
        <p>{app.description}</p>
      </div>
      <div className="app-card-actions">
        <a
          className="button button-primary app-open-button"
          href={app.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Mở ${app.name} trong tab mới`}
        >
          Mở app
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
        {app.githubUrl && (
          <a
            className="app-github-link"
            href={app.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Xem repository GitHub của ${app.name} trong tab mới`}
          >
            <GithubLogo size={18} weight="bold" aria-hidden="true" />
            GitHub
          </a>
        )}
      </div>
    </article>
  );
}

export function AppDirectory({ apps }: { apps: CompanyApp[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<AppCategory | "all">("all");

  const filteredApps = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");

    return apps.filter((app) => {
      const matchesCategory = category === "all" || app.category === category;
      const matchesQuery =
        !normalizedQuery ||
        app.name.toLocaleLowerCase("vi").includes(normalizedQuery) ||
        app.category.toLocaleLowerCase("vi").includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [apps, category, query]);

  return (
    <section className="directory-section" aria-labelledby="directory-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">App directory</p>
          <h2 id="directory-title">Hôm nay mình build gì, chơi gì?</h2>
        </div>
        <p>Những project nội bộ để mở ra, thử nghiệm và cùng làm tốt hơn.</p>
      </div>

      <div className="directory-controls">
        <label className="search-field">
          <span className="sr-only">Tìm ứng dụng theo tên hoặc category</span>
          <MagnifyingGlass size={20} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm Ma Sói, Jukebox, Sao kê..."
          />
        </label>

        <div className="filter-chips" aria-label="Lọc theo category">
          <button
            type="button"
            className={category === "all" ? "filter-chip active" : "filter-chip"}
            aria-pressed={category === "all"}
            onClick={() => setCategory("all")}
          >
            Tất cả
          </button>
          {appCategories.map((item) => (
            <button
              type="button"
              className={category === item ? "filter-chip active" : "filter-chip"}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="results-count" aria-live="polite">
        {filteredApps.length} project phù hợp
      </p>

      {filteredApps.length > 0 ? (
        <div className="app-grid">
          {filteredApps.map((app) => (
            <AppCard app={app} key={app.id} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">
            <MagnifyingGlass size={28} />
          </span>
          <h3>Chưa tìm thấy app phù hợp</h3>
          <p>Thử một từ khóa ngắn hơn hoặc chọn lại “Tất cả”.</p>
          <button
            className="button button-secondary"
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </section>
  );
}
