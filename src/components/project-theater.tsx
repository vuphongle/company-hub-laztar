"use client";

import { useRef, useState } from "react";
import type { AppIconName } from "@/data/apps";
import { useWorldMotion } from "@/components/world-motion";
import { ProjectWorld } from "@/components/project-world";

export function ProjectTheater({ icon }: { icon: AppIconName }) {
  const ref = useRef<HTMLElement>(null);
  useWorldMotion(ref, icon);
  const [alternate, setAlternate] = useState(false);
  return (
    <figure
      ref={ref}
      className={`project-theater project-gallery scene-${icon}`}
      data-alternate={alternate}
    >
      <button
        type="button"
        className="project-sculpture project-image-stage"
        onClick={() => setAlternate(!alternate)}
        aria-pressed={alternate}
        aria-labelledby={`scene-action-${icon}`}
      >
        <ProjectWorld icon={icon} eager />
        <span className="art-action" id={`scene-action-${icon}`}>
          {alternate ? "Thu về toàn cảnh" : "Xem gần hơn"}{" "}
          <span aria-hidden="true">{alternate ? "−" : "+"}</span>
        </span>
      </button>
    </figure>
  );
}
