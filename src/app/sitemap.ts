import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { apps } from "@/data/apps";

export default function sitemap(): MetadataRoute.Sitemap {
  // Only canonical, indexable pages on this host. No synthetic lastmod dates.
  return ["/", "/about", ...apps.map((app) => `/apps/${app.slug}`)].map(
    (path) => ({ url: `${site.url}${path}` }),
  );
}
