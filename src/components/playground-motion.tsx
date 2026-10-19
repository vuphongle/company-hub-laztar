"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Scroll owns the camera. No hidden server content, scroll interception or perpetual loops. */
export function PlaygroundMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const marquee = rootRef.current?.querySelector(".hero-marquee");
    if (!marquee) return;
    const observer = new IntersectionObserver(([entry]) => {
      marquee.classList.toggle("is-in-view", entry.isIntersecting);
    });
    observer.observe(marquee);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (disposed || !rootRef.current) return;
        gsap.registerPlugin(ScrollTrigger);
        const root = rootRef.current;
        const q = gsap.utils.selector(root);
        const layoutSize = new ResizeObserver(() => ScrollTrigger.refresh());
        layoutSize.observe(root);
        const header = document.querySelector(".site-header");
        const headerSize = new ResizeObserver(() => {
          root.style.setProperty(
            "--hub-header-height",
            `${header?.getBoundingClientRect().height ?? 80}px`,
          );
          ScrollTrigger.refresh();
        });
        if (header) headerSize.observe(header);
        const media = gsap.matchMedia();
        media.add(
          {
            motion: "(prefers-reduced-motion: no-preference)",
            mobile: "(max-width: 760px)",
          },
          ({ conditions }) => {
            if (!conditions?.motion) return;
            const mobile = conditions.mobile;
            const hero = root.querySelector(".hero-section");
            if (hero) {
              const t = gsap.timeline({
                scrollTrigger: {
                  trigger: hero,
                  start: "top top",
                  end: "bottom top",
                  scrub: true,
                },
                defaults: { ease: "none" },
              });
              t.to(q(".hero-copy"), { y: mobile ? -45 : -120, duration: 1 }, 0)
                .to(
                  q(".world-nodes"),
                  {
                    scale: 0.72,
                    y: mobile ? 35 : 100,
                    rotation: -8,
                    duration: 1,
                  },
                  0,
                )
                .to(q(".world-word"), { xPercent: 25, y: -70, duration: 1 }, 0)
                .to(
                  q(".world-orbit"),
                  { scale: 1.6, rotation: 40, duration: 1 },
                  0,
                );
            }
            const principles = root.querySelector(".principles-section");
            if (principles) {
              const t = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: principles,
                  start: "top 65%",
                  end: "bottom 80%",
                  scrub: true,
                },
              });
              q(".principles-orbit span").forEach((word, i) =>
                t.fromTo(
                  word,
                  // Keep the opposing word entrances inside the available gap.
                  {
                    xPercent: (i % 2 ? 1 : -1) * (mobile ? 4 : 8),
                    rotation: (i % 2 ? 1 : -1) * (mobile ? 2 : 3),
                  },
                  { xPercent: 0, rotation: 0, duration: 0.5 },
                  i * 0.2,
                ),
              );
              q(".principle-row").forEach((row, i) =>
                t.fromTo(
                  row,
                  { x: mobile ? 35 : 70 },
                  { x: 0, duration: 0.5 },
                  i * 0.2,
                ),
              );
            }
            q(".playground-portrait").forEach((portrait) => {
              const image = portrait.querySelector("img");
              gsap.fromTo(
                image,
                { scale: 1.3, yPercent: 7 },
                {
                  scale: 1,
                  yPercent: -5,
                  ease: "none",
                  scrollTrigger: {
                    trigger: portrait,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                  },
                },
              );
            });
            q(".about-project-row").forEach((row, i) => {
              gsap.fromTo(
                row.querySelector("h3"),
                { x: i % 2 ? 70 : -70 },
                {
                  x: 0,
                  ease: "none",
                  scrollTrigger: {
                    trigger: row,
                    start: "top bottom",
                    end: "top 35%",
                    scrub: true,
                  },
                },
              );
            });
            const closing = root.querySelector(".feedback-cta");
            if (closing) {
              const t = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: closing,
                  start: "top 80%",
                  end: "bottom bottom",
                  scrub: true,
                },
              });
              q(".closing-orbit i").forEach((piece, i) =>
                t.fromTo(
                  piece,
                  {
                    x: (i - 1) * (mobile ? 110 : 330),
                    y: (i % 2 ? -1 : 1) * 180,
                    rotation: i * 80,
                    scale: 1.6,
                  },
                  { x: 0, y: 0, rotation: 0, scale: 0.25, duration: 1 },
                  0,
                ),
              );
              t.fromTo(
                q(".closing-orbit > span"),
                { scale: 0.1, rotation: -150 },
                { scale: 1, rotation: 0, duration: 0.6 },
                0.4,
              ).fromTo(
                q(".feedback-cta-card h2"),
                { y: 65 },
                { y: 0, duration: 1 },
                0,
              );
            }
          },
          root,
        );
        const refresh = () => {
          if (!disposed) ScrollTrigger.refresh();
        };
        document.fonts.ready.then(refresh);
        window.addEventListener("laztar:layout-change", refresh);
        cleanup = () => {
          window.removeEventListener("laztar:layout-change", refresh);
          layoutSize.disconnect();
          headerSize.disconnect();
          media.revert();
        };
      },
    );
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);
  return (
    <div className="playground-experience" ref={rootRef}>
      {children}
    </div>
  );
}
