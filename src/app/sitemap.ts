import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { apps } from "@/data/apps";

export default function sitemap(): MetadataRoute.Sitemap {
  // Only canonical, indexable pages on this host. No synthetic lastmod dates.
  return ["/", "/gioi-thieu", ...apps.map((app) => `/ung-dung/${app.id}`)].map(
    (path) => ({ url: `${site.url}${path}` }),
  );
}
