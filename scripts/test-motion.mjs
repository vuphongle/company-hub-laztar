import { chromium, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.BASE_URL || "http://localhost:3000";
const browser = await chromium.launch();
const report = { scroll: [], layouts: [], lifecycle: [], errors: [] };
const at = async (page, y) => {
  await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), y);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
};
const bounds = (locator) => locator.evaluate((e) => ({ top: e.getBoundingClientRect().top + scrollY, height: e.getBoundingClientRect().height }));
const sample = (locator) => locator.evaluate((e) => ({
  macro: e.querySelector(".scene-macro")?.style.transform,
  motif: e.querySelector(".scene-moon,.scene-vinyl,.scene-token,.principles-orbit span,.closing-orbit span")?.getAttribute("style"),
}));
try {
  for (const width of [320, 375, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.on("pageerror", (e) => report.errors.push(e.message));
    for (const path of ["/", "/apps/werewolf", "/apps/office-jukebox", "/apps/statements", "/about", "/feedback", "/admin/login", "/missing-motion-qa"]) {
      const response = await page.goto(base + path, { waitUntil: "networkidle" });
      expect(response.status()).toBe(path.includes("missing") ? 404 : 200);
      expect(await page.getByRole("button", { name: /Dừng chuyển động|Xem lại intro/ }).count()).toBe(0);
      const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
      expect(layout.scrollWidth).toBe(width);
      report.layouts.push({ path, ...layout });
      for (const selector of path === "/" ? [".chapter-runway-wolf", ".chapter-runway-music", ".chapter-runway-receipt", ".principles-section", ".feedback-cta"] : path.startsWith("/apps/") ? [".project-cover-runway"] : []) {
        const runway = page.locator(selector);
        const { top, height } = await bounds(runway);
        await at(page, Math.max(0, top - 450));
        const before = await sample(runway);
        if (selector === ".principles-section") {
          // Sample the entrance and reversal: endpoints alone missed colliding words.
          for (const offset of [-450, -250, 0, 200, 500, 200, 0, -450]) {
            await at(page, top + offset);
            const words = await runway.locator(".principles-orbit span").evaluateAll((elements) => elements.map((element) => {
              const rect = element.getBoundingClientRect();
              return { left: rect.left, right: rect.right };
            }));
            expect(words.every((word) => word.left >= 0 && word.right <= width)).toBe(true);
            expect(words.slice(1).every((word, i) => word.left >= words[i].right)).toBe(true);
          }
        }
        await at(page, top + height * .5);
        const after = await sample(runway);
        expect(after).not.toEqual(before);
        if (selector.includes("runway")) {
          const x = await runway.locator(".scene-macro").evaluate((e) => new DOMMatrixReadOnly(getComputedStyle(e).transform).m41);
          expect(Number.isFinite(x)).toBe(true);
        }
        await at(page, Math.max(0, top - 450));
        expect(await sample(runway)).toEqual(before);
        report.scroll.push({ width, path, selector, before, after, reversed: true });
      }
    }
    await page.goto(base, { waitUntil: "networkidle" });
    const fullMusic = page.locator(".chapter-runway-music");
    const fullBounds = await bounds(fullMusic);
    await at(page, fullBounds.top + fullBounds.height * .5);
    await page.waitForTimeout(120);
    const fullMacroX = await fullMusic.locator(".scene-macro").evaluate((e) => new DOMMatrixReadOnly(getComputedStyle(e).transform).m41);
    for (let i = 0; i < 3; i++) {
      await page.getByRole("searchbox").fill("Jukebox");
      await expect(page.locator(".app-card")).toHaveCount(1);
      const filteredMusic = page.locator(".chapter-runway-music");
      const filteredBounds = await bounds(filteredMusic);
      await at(page, filteredBounds.top + filteredBounds.height * .5);
      await expect.poll(async () => {
        const filteredMacroX = await filteredMusic.locator(".scene-macro").evaluate((e) => new DOMMatrixReadOnly(getComputedStyle(e).transform).m41);
        return Math.abs(filteredMacroX - fullMacroX);
      }, { timeout: 1500 }).toBeLessThan(3);
      await page.getByRole("searchbox").fill("");
      await expect(page.locator(".app-card")).toHaveCount(3);
    }
    await page.getByRole("link", { name: "Tìm hiểu Ma Sói" }).click();
    await expect(page).toHaveURL(/apps\/werewolf/);
    await page.goBack();
    await expect(page.locator(".app-card")).toHaveCount(3);
    await page.goForward();
    await expect(page.locator(".project-theater")).toBeVisible();
    await page.setViewportSize({ width: width === 1440 ? 390 : 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(".scene-wide")).toHaveCSS("transform", "none");
    await expect(page.locator(".scene-macro")).toHaveCSS("display", "none");
    await page.goto(base, { waitUntil: "networkidle" });
    await expect(page.locator(".app-card").first()).toHaveCSS("position", "relative");
    await expect(page.locator(".scene-macro").first()).toHaveCSS("display", "none");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(page.locator(".app-card").first()).toHaveCSS("position", "sticky");
    report.lifecycle.push({ width, remounts: 3, backForward: true, resize: true, mediaChange: true });
    await page.close();
  }
  expect(report.errors).toEqual([]);
  console.log(JSON.stringify({ layouts: report.layouts.length, scrollSequences: report.scroll.length, lifecycle: report.lifecycle, errors: report.errors }, null, 2));
  if (process.env.QA_OUT) { await mkdir(process.env.QA_OUT, { recursive: true }); await writeFile(`${process.env.QA_OUT}/motion-regression.json`, JSON.stringify(report, null, 2)); }
} finally { await browser.close(); }
