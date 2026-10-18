import assert from "node:assert/strict";

import nextEnv from "@next/env";

import { apps } from "../src/data/apps";
import { site } from "../src/config/site";

nextEnv.loadEnvConfig(process.cwd());

const baseUrl = new URL(
  process.env.SEO_TEST_BASE_URL ?? `http://localhost:${process.env.PORT ?? "3000"}`,
);
const publicPaths = ["/", "/gioi-thieu", ...apps.map((app) => `/ung-dung/${app.id}`)];

async function get(path: string) {
  return fetch(new URL(path, baseUrl), {
    headers: { "user-agent": "Googlebot", accept: "text/html,application/xml,text/plain,*/*" },
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
  });
}

function attributes(tag: string): Record<string, string> {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], match[2]]),
  );
}

function meta(html: string, name: string) {
  for (const tag of html.match(/<meta\b[^>]*>/g) ?? []) {
    const attrs = attributes(tag);
    if (attrs.name === name || attrs.property === name) return attrs.content;
  }
}

const titles = new Set<string>();
for (const path of publicPaths) {
  const response = await get(path);
  assert.equal(response.status, 200, `${path}: HTTP status`);
  const html = await response.text();
  const head = html.split("</head>")[0];
  const title = head.match(/<title>([^<]+)<\/title>/)?.[1];
  assert(title && !titles.has(title), `${path}: missing or duplicate title`);
  titles.add(title);
  assert(meta(head, "description"), `${path}: missing description`);
  assert(!meta(html, "robots")?.includes("noindex"), `${path}: noindex present`);
  assert(!response.headers.get("x-robots-tag")?.includes("noindex"), `${path}: X-Robots-Tag`);
  const canonical = (head.match(/<link\b[^>]*>/g) ?? [])
    .map(attributes).filter((attrs) => attrs.rel === "canonical");
  assert.equal(canonical.length, 1, `${path}: canonical count`);
  assert.equal(new URL(canonical[0].href).href, `${site.url}${path}`, `${path}: canonical URL`);
  const openGraphUrl = meta(head, "og:url");
  assert(openGraphUrl, `${path}: missing Open Graph URL`);
  assert.equal(new URL(openGraphUrl).href, `${site.url}${path}`, `${path}: Open Graph URL`);
  assert.equal(meta(head, "twitter:card"), "summary_large_image", `${path}: Twitter card`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${path}: H1 count`);
  const imageUrl = meta(head, "og:image");
  assert(imageUrl && imageUrl.startsWith(`${site.url}/opengraph-image`), `${path}: Open Graph image`);

  const data = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
  if (path === "/") {
    assert(data.some((item) => item["@graph"]?.some((node: Record<string, string>) => node["@type"] === "WebSite")), "Missing WebSite data");
    for (const app of apps) {
      assert(html.includes(`href="/ung-dung/${app.id}"`), `Missing crawlable link: ${app.id}`);
    }
    const localImage = new URL(imageUrl);
    const imageResponse = await get(localImage.pathname + localImage.search);
    assert.equal(imageResponse.status, 200, "Open Graph image status");
    assert(imageResponse.headers.get("content-type")?.startsWith("image/png"), "Open Graph image type");
    assert((await imageResponse.arrayBuffer()).byteLength > 1000, "Open Graph image is empty");
  } else if (path.startsWith("/ung-dung/")) {
    assert(data.some((item) => item["@type"] === "BreadcrumbList"), `${path}: missing breadcrumb data`);
  }
}

const robots = await get("/robots.txt");
assert.equal(robots.status, 200, "robots.txt status");
assert(robots.headers.get("content-type")?.startsWith("text/plain"), "robots.txt content type");
const robotsText = await robots.text();
assert(robotsText.includes(`Sitemap: ${site.url}/sitemap.xml`), "Missing sitemap declaration");
assert(!/^Disallow:\s*\/\s*$/mi.test(robotsText), "Crawling is blocked");

const sitemap = await get("/sitemap.xml");
assert.equal(sitemap.status, 200, "sitemap status");
assert(sitemap.headers.get("content-type")?.includes("xml"), "sitemap content type");
const sitemapText = await sitemap.text();
const urls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.deepEqual(urls.sort(), publicPaths.map((path) => `${site.url}${path}`).sort(), "Sitemap URLs");

for (const path of ["/feedback", "/admin/login"]) {
  const response = await get(path);
  assert.equal(response.status, 200, `${path}: status`);
  assert(meta(await response.text(), "robots")?.includes("noindex"), `${path}: missing noindex`);
}
for (const path of ["/seo-check-missing-page", "/ung-dung/seo-check-missing-app"]) {
  assert.equal((await get(path)).status, 404, `${path}: expected real 404`);
}

console.log(`SEO checks passed: ${publicPaths.length} public pages, metadata, JSON-LD, image, robots, sitemap, noindex and 404s.`);
