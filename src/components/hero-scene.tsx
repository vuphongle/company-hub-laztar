"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { LivingArtwork } from "@/components/living-artwork";
import type { CompanyApp } from "@/data/apps";

export function HeroScene({ apps }: { apps: CompanyApp[] }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState(apps[1]?.id ?? apps[0]?.id);
  const selected = apps.find((app) => app.id === selectedId) ?? apps[0];

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce), (pointer: coarse)",
    );
    let frame = 0;
    let bounds: DOMRect | undefined;
    let clientX = 0;
    let clientY = 0;

    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      bounds = undefined;
      scene.style.setProperty("--pointer-x", "0px");
      scene.style.setProperty("--pointer-y", "0px");
    };
    const refreshBounds = () => {
      bounds = scene.getBoundingClientRect();
    };
    const move = (event: PointerEvent) => {
      if (media.matches) return;
      clientX = event.clientX;
      clientY = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        bounds ??= scene.getBoundingClientRect();
        scene.style.setProperty(
          "--pointer-x",
          `${((clientX - bounds.left) / bounds.width - 0.5) * 18}px`,
        );
        scene.style.setProperty(
          "--pointer-y",
          `${((clientY - bounds.top) / bounds.height - 0.5) * 18}px`,
        );
      });
    };
    scene.addEventListener("pointerenter", refreshBounds);
    scene.addEventListener("pointermove", move);
    scene.addEventListener("pointerleave", reset);
    window.addEventListener("resize", reset);
    window.addEventListener("scroll", reset, { passive: true });
    media.addEventListener("change", reset);
    return () => {
      reset();
      scene.removeEventListener("pointerenter", refreshBounds);
      scene.removeEventListener("pointermove", move);
      scene.removeEventListener("pointerleave", reset);
      window.removeEventListener("resize", reset);
      window.removeEventListener("scroll", reset);
      media.removeEventListener("change", reset);
    };
  }, []);

  if (!selected) return null;

  return (
    <div className="hero-scene" ref={sceneRef} data-mode={selected.icon}>
      <div className="world-grid" aria-hidden="true" />
      <div className="world-word" aria-hidden="true">
        {selected.icon === "wolf"
          ? "AFTER DARK"
          : selected.icon === "music"
            ? "GOOD VIBES"
            : "WHAT IF?"}
      </div>
      <div className="world-orbit" aria-hidden="true" />
      <div
        className="world-nodes"
        role="group"
        aria-label="Chọn project xem trước"
      >
        {apps.map((app, index) => {
          const selectedIndex = apps.findIndex(
            (item) => item.id === selected.id,
          );
          const position =
            index === selectedIndex
              ? "active"
              : index === (selectedIndex + 1) % apps.length
                ? "next"
                : "previous";
          return (
            <button
              className={`world-node world-node-${position}`}
              key={app.id}
              style={{ "--node-index": index } as CSSProperties}
              type="button"
              aria-pressed={selected.id === app.id}
              aria-labelledby={`node-caption-${app.id}`}
              onClick={() => setSelectedId(app.id)}
            >
              <div className="node-sculpture">
                <LivingArtwork name={app.icon} />
              </div>
              <span className="node-caption" id={`node-caption-${app.id}`}>
                <b>0{index + 1}</b> {app.name}
                <span aria-hidden="true">↗</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="world-instruction">
        <span aria-hidden="true">↔</span> Chọn một thế giới để đổi mood
      </div>
      <div className="console-info" aria-live="polite" aria-atomic="true">
        <div>
          <p className="eyebrow">{selected.category} / đang hoạt động</p>
          <h2>{selected.name}</h2>
        </div>
        <Link
          href={`/apps/${selected.slug}`}
          aria-label={`Khám phá ${selected.name}`}
        >
          Khám phá <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
}
