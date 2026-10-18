import type { Metadata } from "next";

export const site = {
  name: "LAZTAR Hub",
  teamName: "Đội ngũ phát triển nội bộ LAZTAR",
  companyName: "LAZTAR",
  companyUrl: "https://laztar.com",
  url: "https://laztar.xyz",
  title: "LAZTAR Hub | Dự án nội bộ của đội ngũ LAZTAR",
  description:
    "LAZTAR Hub là dự án nội bộ do đội ngũ LAZTAR xây dựng để thử nghiệm app, game và công cụ. Thông tin về công ty và dịch vụ: laztar.com.",
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
    authors: [{ name: site.teamName }],
    creator: site.teamName,
    publisher: site.teamName,
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
