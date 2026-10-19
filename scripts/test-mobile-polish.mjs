import { chromium, webkit, expect } from "@playwright/test";

const base = process.env.BASE_URL || "http://localhost:3000";
for (const engine of [chromium, webkit].filter((engine) => !process.env.BROWSER || engine.name() === process.env.BROWSER)) {
  const browser = await engine.launch();
  try {
    for (const width of [320, 375, 390, 430, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const marquee = page.locator(".hero-marquee");
      await marquee.scrollIntoViewIfNeeded();
      await expect(marquee).toHaveClass(/is-in-view/);
      await expect(marquee.locator("div").first()).toHaveCSS("animation-play-state", "running");
      const start = await marquee.locator("div").first().evaluate((e) => e.getBoundingClientRect().x);
      await expect.poll(() => marquee.locator("div").first().evaluate((e) => e.getBoundingClientRect().x)).toBeLessThan(start - 1);
      // Probe the complete loop, including the seam, without waiting a full cycle.
      await marquee.evaluate((element) => {
        const tracks = [...element.children];
        for (const progress of [0, 0.25, 0.5, 0.999, 1]) {
          tracks.forEach((track) => {
            const animation = track.getAnimations()[0];
            if (!animation) throw new Error("Marquee animation missing");
            animation.pause();
            animation.currentTime = animation.effect.getTiming().duration * progress;
          });
          const bounds = element.getBoundingClientRect();
          const [first, second] = tracks.map((track) => track.getBoundingClientRect());
          if (first.width < bounds.width || first.left > bounds.left + 1 || second.right < bounds.right - 1 || Math.abs(first.right - second.left) > 1)
            throw new Error("Marquee loop leaves an uncovered gap");
        }
        tracks.forEach((track) => track.getAnimations()[0].play());
      });
      await page.locator("footer").scrollIntoViewIfNeeded();
      await expect(marquee.locator("div").first()).toHaveCSS("animation-play-state", "paused");
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(marquee.locator("div").first()).toHaveCSS("animation-name", "none");
      await page.emulateMedia({ reducedMotion: "no-preference" });
      if (width <= 780) {
        // Start menu checks after a fresh load, independent of GSAP media reversion.
        await page.reload({ waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        const trigger = page.getByRole("button", { name: "Mở menu" });
        const dialog = page.getByRole("dialog");
        await page.evaluate(() => scrollTo({ top: 450, behavior: "instant" }));
        const y = await page.evaluate(() => scrollY);
        const openMenu = async () => {
          const bounds = await trigger.boundingBox();
          // Click the rendered sticky trigger without Playwright's auto-scroll.
          await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        };
        for (const close of ["Escape", "button", "backdrop"]) {
          await openMenu();
          await expect(dialog).toBeVisible();
          await expect(dialog.getByRole("link", { name: "Projects" })).toBeFocused();
          // WebKit follows Safari's default Tab behavior; Option+Tab includes links.
          const tabKey = engine.name() === "webkit" ? "Alt+Tab" : "Tab";
          await page.keyboard.press(tabKey);
          await page.keyboard.press(tabKey);
          expect(await dialog.evaluate((e) => e.contains(document.activeElement))).toBe(true);
          if (close === "Escape") await page.keyboard.press("Escape");
          else if (close === "button") {
            const closeButton = page.getByRole("button", { name: "Đóng menu" });
            const bounds = await closeButton.boundingBox();
            await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
          }
          else await page.mouse.click(width / 2, 850);
          await expect(dialog).not.toBeVisible();
          await expect(trigger).toBeFocused();
          await expect.poll(() => page.evaluate(() => scrollY)).toBe(y);
        }
        await openMenu();
        await page.setViewportSize({ width: 1440, height: 900 });
        await expect(dialog).not.toBeVisible();
        expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe("hidden");
        await page.setViewportSize({ width, height: 900 });
      }
      await page.goto(`${base}/feedback`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const heights = await page.locator(".choice-card-body").evaluateAll((elements) => elements.map((e) => e.getBoundingClientRect().height));
      expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
      await page.getByRole("radio", { name: /^Báo lỗi/ }).check({ force: true });
      await page.getByRole("radio", { name: /^Báo lỗi/ }).focus();
      await page.keyboard.press("ArrowRight");
      await expect(page.getByRole("radio", { name: /^Đề xuất tính năng/ })).toBeChecked();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      expect(errors).toEqual([]);
      console.log(`${engine.name()} ${width}: marquee loop, visibility, reduced motion, menu lifecycle, feedback selection passed`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
