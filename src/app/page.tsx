import Link from "next/link";

import { AppDirectory } from "@/components/app-directory";
import { apps } from "@/data/apps";

export default function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="shell hero-grid">
          <div className="hero-copy reveal">
            <p className="hero-kicker">
              <span aria-hidden="true" />
              Internal playground
            </p>
            <h1>LAZTAR Hub</h1>
            <p className="hero-description">
              Chơi một chút. Build một chút. Góp ý một chút.
              <span> Nơi những project nội bộ được dùng, thử và làm tốt hơn cùng nhau.</span>
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
