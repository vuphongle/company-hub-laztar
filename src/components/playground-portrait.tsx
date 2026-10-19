import Image from "next/image";

export function PlaygroundPortrait({ eager = false }: { eager?: boolean }) {
  return (
    <figure className="playground-portrait">
      <picture>
        <source
          media="(max-width: 600px)"
          srcSet="/artwork/living-playground-768.webp"
        />
        <Image
          src="/artwork/living-playground-1536.webp"
          alt="Minh họa ba thế giới thu nhỏ: mặt nạ Ma Sói dưới trăng, máy đĩa nhạc và cuộn giấy trên các khối dữ liệu."
          width={1536}
          height={1024}
          sizes="(max-width: 600px) 100vw, (max-width: 1200px) 90vw, 1200px"
          loading={eager ? "eager" : "lazy"}
          unoptimized
        />
      </picture>

    </figure>
  );
}
