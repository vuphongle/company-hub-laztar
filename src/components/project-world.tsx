import Image from "next/image";
import type { AppIconName } from "@/data/apps";

const worlds = {
  wolf: {
    file: "wolf",
    alt: "Mặt nạ sói đất nung, trăng và sân chơi giữa rừng tím.",
  },
  music: {
    file: "music",
    alt: "Đảo âm nhạc với máy đĩa, vinyl và những nhịp sóng màu lime.",
  },
  receipt: {
    file: "receipt",
    alt: "Dải giấy uốn qua những bậc dữ liệu xanh và khối đồng.",
  },
};

/** Illustrative worlds, never presented as screenshots or real product data. */
export function ProjectWorld({
  icon,
  eager = false,
}: {
  icon: AppIconName;
  eager?: boolean;
}) {
  const world = worlds[icon];
  return (
    <div className={`project-world world-${icon}`}>
      <div className="scene-wide">
        <picture>
          <source
            media="(max-width: 600px)"
            srcSet={`/artwork/${world.file}-scene-768.webp`}
          />
          <Image
            src={`/artwork/${world.file}-scene-1536.webp`}
            alt={world.alt}
            width={1536}
            height={1024}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
            unoptimized
          />
        </picture>
      </div>
      <div className="scene-macro" aria-hidden="true">
        <picture>
          <source
            media="(max-width: 600px)"
            srcSet={`/artwork/${world.file}-macro-768.webp`}
          />
          <Image
            src={`/artwork/${world.file}-macro-1536.webp`}
            alt=""
            width={1536}
            height={1024}
            loading="lazy"
            unoptimized
          />
        </picture>
      </div>
      <div className="scene-props" aria-hidden="true">
        {icon === "wolf" ? (
          <>
            <span className="scene-moon" />
            <span className="scene-eclipse" />
            <span className="scene-orbit" />
          </>
        ) : icon === "music" ? (
          <>
            <span className="scene-vinyl">
              <i />
            </span>
            <svg className="scene-wave" viewBox="0 0 600 150">
              <path d="M0 75 Q30 -30 60 75 T120 75 T180 75 T240 75 T300 75 T360 75 T420 75 T480 75 T540 75 T600 75" />
            </svg>
          </>
        ) : (
          <>
            <div className="scene-bars">
              {[35, 60, 45, 85, 100].map((h, i) => (
                <i key={i} style={{ height: `${h}%` }} />
              ))}
            </div>
            <span className="scene-token">✳</span>
            <svg className="scene-chart" viewBox="0 0 500 220">
              <path
                pathLength="1"
                d="M10 190L100 110L190 145L290 50L380 90L490 10"
              />
            </svg>
          </>
        )}
      </div>
    </div>
  );
}
