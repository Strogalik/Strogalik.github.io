import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("desktop: real WebGL, dialogs, valve, flow, FAQ and final CTA", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("[data-scene-status]")).toHaveAttribute(
    "data-scene-status",
    "ready",
  );
  await expect(page.locator("canvas")).toHaveCount(1);
  await page.screenshot({ path: "test-results/desktop-hero.png" });
  const cta = page
    .getByRole("button", { name: "Получить расчёт", exact: true })
    .first();
  await cta.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("button", { name: "Проверить заявку", exact: true })
    .click();
  await expect(page.locator("#phone-error")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Телефон" })).toBeFocused();
  await page
    .getByRole("textbox", { name: "Телефон" })
    .fill("+7 (999) 000-00-00");
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Проверить заявку", exact: true })
    .click();
  await expect(page.getByText("Всё заполнено верно.")).toBeVisible();
  await expect(
    page.getByText("Это демонстрация формы.", { exact: false }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(cta).toBeFocused();
  await page
    .getByRole("button", { name: "Газификация жилых домов", exact: true })
    .click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "Газификация жилых домов" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.locator("#valve").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/desktop-valve.png" });
  await page
    .getByRole("button", { name: "Открыть вентиль", exact: true })
    .click();
  await expect(page.locator("[data-valve-state]")).toHaveAttribute(
    "data-valve-state",
    "open",
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator("[data-valve-state]")).toHaveAttribute(
    "data-valve-state",
    "open",
  );
  await page
    .getByRole("button", { name: "Пауза анимации", exact: true })
    .click();
  await expect(page.locator("[data-animation-mode]")).toHaveAttribute(
    "data-animation-mode",
    "paused",
  );
  await page
    .getByRole("button", { name: "Продолжить анимацию", exact: true })
    .click();
  await page
    .getByText("Сколько будет стоить подключение?", { exact: true })
    .click();
  await expect(
    page.getByText("Расчёт готовится для конкретного объекта.", {
      exact: false,
    }),
  ).toBeVisible();
  await page.locator("#contacts").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-boiler-state]")).toHaveAttribute(
    "data-boiler-state",
    "active",
    { timeout: 30000 },
  );
  await page.screenshot({ path: "test-results/desktop-boiler.png" });
  await expect(page.locator("[data-scene-status]")).toHaveAttribute(
    "data-scene-status",
    "ready",
  );
  await page
    .getByRole("button", { name: "Обсудить газификацию", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  expect(errors).toEqual([]);
});
test("mobile: menu, WebGL, phone, form, valve and overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("[data-scene-status]")).toHaveAttribute(
    "data-scene-status",
    "ready",
  );
  await page.screenshot({ path: "test-results/mobile-hero.png" });
  await page.getByRole("button", { name: "Открыть меню", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.screenshot({ path: "test-results/mobile-menu.png" });
  await page
    .getByRole("navigation", { name: "Мобильная навигация" })
    .getByRole("link", { name: "Услуги", exact: false })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Получить расчёт", exact: true })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.screenshot({ path: "test-results/mobile-form.png" });
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Открыть вентиль", exact: true })
    .click();
  await expect(page.locator("[data-valve-state]")).toHaveAttribute(
    "data-valve-state",
    "open",
  );
  await page.locator('[data-route="valve"]').scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/mobile-valve.png" });
  await page
    .getByText("С чего начать газификацию дома?", { exact: true })
    .click();
  await page.locator('[data-route="boiler"]').scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/mobile-boiler.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("responsive range, 200 percent text, image integrity and DOM controls", async ({
  page,
}) => {
  await page.goto("/");
  for (const width of [
    320, 360, 390, 430, 768, 1024, 1280, 1440, 1920, 2560, 915,
  ]) {
    await page.setViewportSize({ width, height: width === 915 ? 412 : 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `overflow at ${width}`,
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addStyleTag({ content: "html {font-size: 200% !important;}" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    "200% text overflow",
  ).toBe(true);
  expect(await page.locator('a[href="#"]').count()).toBe(0);
  for (const image of await page.locator("img:visible").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (img) =>
            (img as HTMLImageElement).complete &&
            (img as HTMLImageElement).naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
});
test("accessibility: homepage and calculation dialog", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator("[data-scene-status]")).toHaveAttribute(
    "data-scene-status",
    "ready",
  );
  let result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  await page
    .getByRole("button", { name: "Получить расчёт", exact: true })
    .first()
    .click();
  result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});
test("reduced motion, midpage reload and emergency fallback", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#contacts");
  await expect(page.locator("[data-scene-status]")).toHaveAttribute(
    "data-scene-status",
    "ready",
  );
  await expect(page.locator("[data-animation-mode]")).toHaveAttribute(
    "data-animation-mode",
    "reduced",
  );
  await page
    .getByRole("button", { name: "Продолжить демонстрацию", exact: true })
    .click();
  await expect(page.locator("[data-boiler-state]")).toHaveAttribute(
    "data-boiler-state",
    "active",
  );
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Продолжить демонстрацию", exact: true }),
  ).toBeVisible();
  await page.goto("/?graphics=fallback");
  await expect(page.locator("[data-scene-status]")).toHaveAttribute(
    "data-scene-status",
    "fallback",
  );
  await expect(page.locator(".pipe-fallback").first()).toBeVisible();
  await page
    .getByRole("button", { name: "Получить расчёт", exact: true })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
});
test("actual WebGL context loss keeps the site usable", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-scene-status]")).toHaveAttribute(
    "data-scene-status",
    "ready",
  );
  const lost = await page.locator("canvas").evaluate((canvas) => {
    const gl = (canvas as HTMLCanvasElement).getContext("webgl2");
    const extension = gl?.getExtension("WEBGL_lose_context");
    if (!extension) return false;
    extension.loseContext();
    return true;
  });
  expect(lost).toBe(true);
  await expect(page.locator("[data-scene-status]")).toHaveAttribute(
    "data-scene-status",
    "fallback",
  );
  await expect(page.locator(".pipe-fallback").first()).toBeVisible();
  await page
    .getByRole("button", { name: "Открыть вентиль", exact: true })
    .click();
  await expect(page.locator("[data-boiler-state]")).toHaveAttribute(
    "data-boiler-state",
    "active",
  );
  await page
    .getByRole("button", { name: "Получить расчёт", exact: true })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
});
test("form error preserves data and retry completes", async ({ page }) => {
  await page.goto("/?formTest=error");
  await page
    .getByRole("button", { name: "Получить расчёт", exact: true })
    .first()
    .click();
  await page.getByRole("textbox", { name: "Телефон" }).fill("+79990000000");
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Проверить заявку", exact: true })
    .click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Телефон" })).toHaveValue(
    "+79990000000",
  );
  await page
    .getByRole("button", { name: "Попробовать ещё раз", exact: true })
    .click();
  await expect(page.getByText("Всё заполнено верно.")).toBeVisible();
});
test("direct static service pages and 3D handle click", async ({ page }) => {
  await page.goto("/services/gazifikaciya/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Газификация жилых домов",
  );
  await page
    .getByRole("button", { name: "Обсудить задачу", exact: true })
    .click();
  await expect(page.getByRole("combobox")).toHaveValue("gazifikaciya");
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#valve");
  await expect(page.locator("[data-scene-status]")).toHaveAttribute(
    "data-scene-status",
    "ready",
  );
  await page.locator('[data-route="valve"]').scrollIntoViewIfNeeded();
  const box = await page.locator('[data-route="valve"]').boundingBox();
  if (!box) throw new Error("missing valve");
  await page.mouse.click(
    box.x + box.width * 0.53 - 70,
    box.y + box.height * 0.52,
  );
  await expect(page.locator("[data-valve-state]")).toHaveAttribute(
    "data-valve-state",
    "open",
  );
});
