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
              Internal tools, without the treasure hunt
            </p>
            <h1>Một nơi để bắt đầu mọi thứ trong công ty.</h1>
            <p className="hero-description">
              Nhớ một URL duy nhất để mở app, khám phá công cụ mới và gửi ý tưởng
              giúp mọi thứ tốt hơn.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#directory-title">
                Khám phá ứng dụng
              </a>
              <Link className="button button-secondary" href="/feedback">
                Gửi feedback
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
            <p className="eyebrow">Có gì chưa ổn?</p>
            <h2>Một bug nhỏ hay một ý tưởng lớn đều đáng được lắng nghe.</h2>
          </div>
          <Link className="button button-dark" href="/feedback">
            Chia sẻ với team
          </Link>
        </div>
      </section>
    </>
  );
}
