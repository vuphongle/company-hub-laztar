import { chromium, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
const errors = [];

function contrastRatio(foreground, background) {
  const luminance = (color) => {
    const channels = color
      .match(/[\d.]+/g)
      .slice(0, 3)
      .map(Number)
      .map((value) => {
        const channel = value / 255;
        return channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4;
      });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const values = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );
  return (values[0] + 0.05) / (values[1] + 0.05);
}

try {
  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  desktop.on("pageerror", (error) => errors.push(error.message));
  desktop.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("WebSocket"))
      errors.push(message.text());
  });
  await desktop.addInitScript(() => {
    window.__introQa = { samples: [], complete: false };
    let first;
    const sample = (time) => {
      const description = document.querySelector(".hero-copy h1 > span");
      if (description) {
        first ??= time;
        window.__introQa.samples.push(
          Number(getComputedStyle(description).opacity),
        );
      }
      if (first === undefined || time - first < 1500)
        requestAnimationFrame(sample);
      else window.__introQa.complete = true;
    };
    requestAnimationFrame(sample);
  });
  await desktop.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await desktop.waitForFunction(() => window.__introQa.complete);
  const introFlash = await desktop.evaluate(() =>
    window.__introQa.samples.some(
      (opacity, index, samples) =>
        index > 0 && samples[index - 1] - opacity > 0.25,
    ),
  );
  if (introFlash)
    throw new Error(
      "Hero content flashed from visible to hidden during hydration",
    );
  await desktop.locator(".hero-scene").evaluate(async (scene) => {
    const animated = [scene, ...scene.querySelectorAll("[data-intro]")];
    await Promise.all(
      animated.flatMap((element) =>
        element.getAnimations().map((animation) => animation.finished),
      ),
    );
  });
  const heroChannels = desktop.getByRole("group", {
    name: "Chọn project xem trước",
  });
  await heroChannels.getByRole("button", { name: /Ma Sói/ }).click();
  const heroTitle = await desktop.locator(".console-info h2").textContent();
  await heroChannels.getByRole("button", { name: /Office Jukebox/ }).click();
  await expect(desktop.locator(".console-info h2")).toHaveText("Office Jukebox");
  await expect(desktop.getByRole("button", { name: /Dừng chuyển động|Xem lại intro/ })).toHaveCount(0);
  await desktop.locator('input[type="search"]').fill("Jukebox");
  await desktop.waitForTimeout(100);
  const searchCount = await desktop.locator(".app-card").count();
  await desktop.locator('input[type="search"]').fill("");
  await desktop
    .locator(".filter-chips")
    .getByRole("button", { name: "Game", exact: true })
    .click();
  const gameCount = await desktop.locator(".app-card").count();
  const externalHref = await desktop
    .getByRole("link", { name: /Mở app Ma Sói/ })
    .getAttribute("href");
  const wolfButton = desktop.getByRole("link", { name: /Mở app Ma Sói/ });
  const wolfDefault = await wolfButton.evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    color: getComputedStyle(element).color,
  }));
  await wolfButton.hover();
  await desktop.waitForTimeout(250);
  const wolfHover = await wolfButton.evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    color: getComputedStyle(element).color,
  }));
  await wolfButton.focus();
  await desktop.keyboard.press("Shift+Tab");
  await desktop.keyboard.press("Tab");
  const wolfFocus = await wolfButton.evaluate((element) => ({
    color: getComputedStyle(element).color,
    background: getComputedStyle(element).backgroundColor,
    outline: getComputedStyle(element).outlineColor,
    outlineWidth: parseFloat(getComputedStyle(element).outlineWidth),
    surface: getComputedStyle(element.closest(".app-card")).backgroundColor,
  }));
  for (const [state, colors] of Object.entries({
    default: wolfDefault,
    hover: wolfHover,
    focus: wolfFocus,
  })) {
    if (contrastRatio(colors.color, colors.background) < 4.5)
      throw new Error(`Ma Sói ${state} button text contrast is below WCAG AA`);
  }
  if (
    wolfFocus.outlineWidth < 2 ||
    contrastRatio(wolfFocus.outline, wolfFocus.surface) < 3
  )
    throw new Error("Ma Sói keyboard focus indicator lost contrast");

  const detail = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  detail.on("pageerror", (error) => errors.push(error.message));
  for (const slug of ["werewolf", "office-jukebox", "statements"]) {
    await detail.goto(`${baseUrl}/apps/${slug}`, {
      waitUntil: "domcontentloaded",
    });
    const theater = detail.locator(".project-sculpture");
    await theater.locator("img").first().evaluate((image) => image.decode());
    await theater.focus();
    await detail.keyboard.press("Enter");
    await expect(theater).toHaveAttribute("aria-pressed", "true");
    await expect(theater).toHaveAccessibleName("Thu về toàn cảnh");
    await detail.keyboard.press("Enter");
    await expect(theater).toHaveAttribute("aria-pressed", "false");
    await expect(theater).toHaveAccessibleName("Xem gần hơn");
  }
  await detail.close();
  const desktopLayout = await desktop.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: "reduce",
  });
  await mobile.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await mobile
    .getByRole("group", { name: "Chọn project xem trước" })
    .getByRole("button", { name: /Ma Sói/ })
    .tap();
  await expect(mobile.locator(".console-info h2")).toHaveText("Ma Sói");
  await mobile.locator('input[type="search"]').fill("Ma Sói");
  await mobile.locator('input[type="search"]').fill("Jukebox");
  await mobile.locator(".app-card-music").scrollIntoViewIfNeeded();
  await expect(mobile.locator(".app-card-music")).toBeVisible();
  await mobile.locator('input[type="search"]').fill("");
  const mobileLayout = await mobile.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
    adminVisible: [...document.querySelectorAll(".primary-nav a")].some(
      (link) => link.textContent?.includes("Admin"),
    ),
    cards: document.querySelectorAll(".app-card").length,
  }));
  const tablet = await browser.newPage({
    viewport: { width: 768, height: 900 },
  });
  await tablet.goto(baseUrl, { waitUntil: "domcontentloaded" });
  const tabletLayout = await tablet.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));

  if (searchCount !== 1)
    throw new Error(`Search expected 1 card, received ${searchCount}`);
  if (heroTitle?.trim() !== "Ma Sói")
    throw new Error(`Hero channel expected Ma Sói, received ${heroTitle}`);
  if (gameCount !== 1)
    throw new Error(`Game filter expected 1 card, received ${gameCount}`);
  if (externalHref !== "https://werewolves-game.laztar.xyz/")
    throw new Error("External app link changed");
  if (desktopLayout.scrollWidth !== desktopLayout.viewport)
    throw new Error("Desktop horizontal overflow detected");
  if (mobileLayout.scrollWidth !== mobileLayout.viewport)
    throw new Error("Mobile horizontal overflow detected");
  if (tabletLayout.scrollWidth !== tabletLayout.viewport)
    throw new Error("Tablet horizontal overflow detected");
  if (!mobileLayout.adminVisible || mobileLayout.cards !== 3)
    throw new Error("Mobile navigation or app directory regression");
  if (errors.length) throw new Error(errors.join("\n"));

  console.log(
    JSON.stringify(
      {
        heroTitle,
        searchCount,
        gameCount,
        externalHref,
        wolfDefault,
        wolfHover,
        wolfFocus,
        desktopLayout,
        tabletLayout,
        mobileLayout,
        errors,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
