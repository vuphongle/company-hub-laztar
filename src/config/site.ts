import type { Metadata } from "next";

export const site = {
  name: "LAZTAR Hub",
  url: "https://laztar.xyz",
  title: "LAZTAR Hub | Ứng dụng nội bộ, Ma Sói online và Office Jukebox",
  description:
    "LAZTAR Hub là nơi khám phá ứng dụng nội bộ của LAZTAR: chơi Ma Sói online, bình chọn nhạc với Office Jukebox, trải nghiệm Sao kê và góp ý cho các dự án.",
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
    creator: site.name,
    publisher: site.name,
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
