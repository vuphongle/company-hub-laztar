import type { Metadata } from "next";

export const site = {
  name: "LAZTAR Hub",
  url: "https://laztar.xyz",
  title: "LAZTAR Hub | Ma Sói, Office Jukebox và các ứng dụng",
  description:
    "Khám phá LAZTAR Hub: chơi Ma Sói, chọn nhạc cùng Office Jukebox, trải nghiệm Sao kê và góp ý xây dựng các dự án của LAZTAR.",
} as const;

export function publicPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `${site.url}${path}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: site.name,
      title,
      description,
      url: `${site.url}${path}`,
      images: [{
        url: `${site.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "LAZTAR Hub — Play. Build. Share.",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${site.url}/opengraph-image`],
    },
  };
}
