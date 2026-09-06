import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  });
  page.on("pageerror", (e) => console.log("pageerror", e.message));
  page.on("console", (m) => {
    if (m.type() === "error") console.log("browser error", m.text());
  });
  await page.goto("http://127.0.0.1:3000/");
  await page.locator('[data-scene-status="ready"]').waitFor();
  for (const kind of ["hero", "curve", "valve", "boiler"]) {
    const stage = page.locator(`[data-route="${kind}"]`).first();
    await stage.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    console.log(
      kind,
      await page
        .locator("[data-scene-status]")
        .getAttribute("data-scene-status"),
    );
    const box = await stage.boundingBox();
    await page.screenshot({
      clip: box,
      path: `public/assets/fallback-${kind}.png`,
      style: ".stage-label,.hero-node-label{visibility:hidden}",
    });
  }
  console.log("Four static posters captured from the actual WebGL models.");
} finally {
  await browser.close();
}
