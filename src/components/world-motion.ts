"use client";

import { useEffect, type RefObject } from "react";
import type { AppIconName } from "@/data/apps";

/** One owned, reversible timeline for both discovery chapters and project pages. */
export function useWorldMotion(
  ref: RefObject<HTMLElement | null>,
  icon: AppIconName,
) {
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (disposed || !ref.current) return;
        gsap.registerPlugin(ScrollTrigger);
        const root = ref.current;
        const runway = root.closest(
          ".chapter-runway, .project-cover-runway",
        ) as HTMLElement | null;
        if (!runway) return;
        const media = gsap.matchMedia();
        media.add(
          "(prefers-reduced-motion: no-preference)",
          () => {
            const scene = root.querySelector(".project-world");
            if (!scene) return;
            const q = gsap.utils.selector(root);
            const timeline = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: runway,
                start: "top 82%",
                end: "bottom bottom",
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
            timeline
              .fromTo(
                q(".scene-wide"),
                { scale: 0.88, rotation: -5, yPercent: 12 },
                { scale: 1.07, rotation: 0, yPercent: -5, duration: 0.55 },
                0,
              )
              .fromTo(
                q(".scene-macro"),
                { x: 0, xPercent: 100, rotation: 8 },
                { x: 0, xPercent: 0, rotation: 0, duration: 0.46 },
                0.46,
              );
            const chapterWord = q(".chapter-word");
            if (chapterWord.length) {
              timeline.fromTo(
                chapterWord,
                { xPercent: -12, y: 35 },
                { xPercent: 10, y: -25, duration: 1 },
                0,
              );
            }
            if (icon === "wolf") {
              timeline
                .fromTo(
                  q(".scene-moon"),
                  { xPercent: -75, yPercent: 40, scale: 0.5 },
                  { xPercent: 15, yPercent: -28, scale: 1.1, duration: 0.8 },
                  0.05,
                )
                .fromTo(
                  q(".scene-eclipse"),
                  { xPercent: 190 },
                  { xPercent: -20, duration: 0.65 },
                  0.35,
                )
                .fromTo(
                  q(".scene-orbit"),
                  { rotation: -35, scale: 0.65 },
                  { rotation: 30, scale: 1.2, duration: 1 },
                  0,
                );
            } else if (icon === "music") {
              timeline
                .fromTo(
                  q(".scene-vinyl"),
                  { rotation: -100, xPercent: 70, yPercent: 65, scale: 0.65 },
                  {
                    rotation: 190,
                    xPercent: -10,
                    yPercent: 0,
                    scale: 1,
                    duration: 1,
                  },
                  0,
                )
                .fromTo(
                  q(".scene-wave"),
                  { scaleY: 0.15, xPercent: -20 },
                  { scaleY: 1, xPercent: 15, duration: 1 },
                  0,
                );
            } else {
              timeline
                .fromTo(
                  q(".scene-bars i"),
                  { scaleY: 0.12 },
                  { scaleY: 1, stagger: 0.07, duration: 0.55 },
                  0.15,
                )
                .fromTo(
                  q(".scene-chart path"),
                  { strokeDashoffset: 1 },
                  { strokeDashoffset: 0, duration: 0.7 },
                  0.25,
                )
                .fromTo(
                  q(".scene-token"),
                  { yPercent: 140, rotation: -60 },
                  { yPercent: -65, rotation: 80, duration: 1 },
                  0,
                );
            }
            return () => {
              timeline.scrollTrigger?.kill();
              timeline.revert();
            };
          },
          root,
        );
        // Images have an intrinsic ratio: decode cannot alter geometry.
        const refresh = () => {
          if (!disposed) ScrollTrigger.refresh();
        };
        document.fonts.ready.then(refresh);
        cleanup = () => {
          media.revert();
        };
      },
    );
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [ref, icon]);
}
