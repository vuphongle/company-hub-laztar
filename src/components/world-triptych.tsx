import Image from "next/image";

/** Reuses the existing scene files: no new image payload or product screenshots. */
export function WorldTriptych({ className }: { className: string }) {
  return (
    <div className={className} aria-hidden="true">
      {(["wolf", "music", "receipt"] as const).map((world) => (
        <div className="journey-plane" data-world={world} key={world}>
          <picture>
            <source media="(max-width: 600px)" srcSet={`/artwork/${world}-scene-768.webp`} />
            <Image
              src={`/artwork/${world}-scene-1536.webp`}
              alt=""
              width={1536}
              height={1024}
              loading="lazy"
              unoptimized
            />
          </picture>
        </div>
      ))}
    </div>
  );
}
