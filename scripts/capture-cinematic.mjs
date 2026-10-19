import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.BASE_URL || "http://localhost:3000";
const out = process.env.QA_OUT || "docs/visual-qa/cinematic/after";
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
try {
  for (const [name, width, height] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
    const options = { viewport: { width, height }, hasTouch: name === "mobile" };
    const page = await browser.newPage(options);
    await page.addInitScript(() => {
      window.__capture = { cls: 0, lcp: 0, longTasks: [] };
      new PerformanceObserver(list => list.getEntries().forEach(e => {
        if (!e.hadRecentInput) window.__capture.cls += e.value;
      })).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver(list => list.getEntries().forEach(e => {
        window.__capture.lcp = e.startTime;
      })).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver(list => list.getEntries().forEach(e => {
        window.__capture.longTasks.push(e.duration);
      })).observe({ type: "longtask", buffered: true });
    });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    const measures = await page.evaluate(async () => {
      const frames = [];
      let last = performance.now(), y = 0;
      await new Promise(resolve => {
        function tick(now) {
          frames.push(now - last); last = now; y += 22;
          scrollTo({ top: y, behavior: "instant" });
          if (y < document.documentElement.scrollHeight - innerHeight) requestAnimationFrame(tick);
          else resolve();
        }
        requestAnimationFrame(tick);
      });
      frames.sort((a, b) => a - b);
      return {
        frames: frames.length, p50: frames[Math.floor(frames.length * .5)],
        p95: frames[Math.floor(frames.length * .95)], over50ms: frames.filter(x => x > 50).length,
        ...window.__capture,
        transferredBytes: performance.getEntriesByType("resource").reduce((sum, e) => sum + e.transferSize, 0),
      };
    });
    const shots = [];
    for (let y = 0; y <= max; y += Math.round(height * .65)) {
      await page.evaluate(top => scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(180);
      const file = `${name}-${String(shots.length).padStart(2, "0")}.png`;
      await page.screenshot({ path: `${out}/${file}` }); shots.push({ file, y });
    }
    await page.close();

    // The deliverable video is a continuous journey, separate from measurement/screenshot jumps.
    const context = await browser.newContext({ ...options, recordVideo: { dir: out, size: { width, height } } });
    const recording = await context.newPage();
    await recording.goto(base, { waitUntil: "networkidle" });
    await recording.waitForTimeout(1600);
    for (const [from, to, speed] of [[0, max, 450], [max, 0, 1000], [0, max, 2800], [max, 0, 3500]]) {
      await recording.evaluate(async ({ from, to, duration }) => {
        await new Promise(resolve => {
          let start;
          function step(time) {
            start ??= time;
            const progress = Math.min(1, (time - start) / duration);
            scrollTo({ top: from + (to - from) * progress, behavior: "instant" });
            if (progress < 1) requestAnimationFrame(step); else resolve();
          }
          requestAnimationFrame(step);
        });
      }, { from, to, duration: Math.abs(to - from) / speed * 1000 });
      await recording.waitForTimeout(500);
    }
    const video = recording.video();
    await context.close();
    await video.saveAs(`${out}/${name}.webm`);
    await writeFile(`${out}/${name}.json`, JSON.stringify({ name, width, height, max, measures, shots }, null, 2));
    console.log(JSON.stringify({ name, max, measures }));
  }
} finally { await browser.close(); }
