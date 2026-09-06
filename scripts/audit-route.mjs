import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    await page.goto(
      `${process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000"}/?routeQA`,
    );
    await page.locator("[data-route-samples]").waitFor();
    const collisions = await page.evaluate(() => {
      const points = JSON.parse(
        document.querySelector("[data-route-samples]").dataset.routeSamples,
      );
      const collisions = [];
      for (const el of document.querySelectorAll(
        ".protected h1,.protected h2,.protected h3,.protected p,.protected button,.hero-bottom a,.hero-bottom button,.stage-label",
      )) {
        if (!el.getClientRects().length) continue;
        const rects = [];
        if (el.tagName === "BUTTON" || el.tagName === "A") {
          rects.push(el.getBoundingClientRect());
        } else {
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            if (!walker.currentNode.textContent.trim()) continue;
            const range = document.createRange();
            range.selectNodeContents(walker.currentNode);
            rects.push(...range.getClientRects());
          }
        }
        const hit = rects.some((r) =>
          points.some(
            ([x, y]) =>
              x > r.left - 24 &&
              x < r.right + 24 &&
              y > r.top + scrollY - 24 &&
              y < r.bottom + scrollY + 24,
          ),
        );
        if (hit)
          collisions.push({
            text: el.textContent.slice(0, 90),
            section: el.closest("section")?.id,
            rect: [
              el.getBoundingClientRect().left,
              el.getBoundingClientRect().top + scrollY,
              el.getBoundingClientRect().width,
              el.getBoundingClientRect().height,
            ],
          });
      }
      return collisions;
    });
    console.log(JSON.stringify({ width, collisions }));
    if (collisions.length) process.exitCode = 1;
    await page.close();
  }
} finally {
  await browser.close();
}
