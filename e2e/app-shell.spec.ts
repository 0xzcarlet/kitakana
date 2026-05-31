import { expect, test } from "@playwright/test";

test("desktop sidebar stays pinned while content scrolls", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/kana");

  const sidebar = page.getByTestId("app-sidebar");
  await expect(sidebar).toBeVisible();
  await expect(sidebar.getByRole("link", { name: /Kitakana/ })).toHaveAttribute(
    "href",
    "/dashboard",
  );
  await expect(sidebar.locator('img[src="/icons/kitakana.svg"]')).toBeVisible();
  await expect
    .poll(() =>
      sidebar.evaluate((element) =>
        Math.round(element.getBoundingClientRect().top),
      ),
    )
    .toBe(0);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect
    .poll(() => page.evaluate(() => window.scrollY), { timeout: 5_000 })
    .toBeGreaterThan(100);
  await expect
    .poll(() =>
      sidebar.evaluate((element) =>
        Math.round(element.getBoundingClientRect().top),
      ),
    )
    .toBe(0);
});

test("mobile bottom nav is solid and full width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");

  const nav = page.getByTestId("mobile-bottom-nav");
  await expect(nav).toBeVisible();
  await expect(nav.getByText("Kanji")).toBeVisible();
  await expect(nav.getByText("Review")).toHaveCount(0);

  const metrics = await nav.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return {
      bottom: Math.round(window.innerHeight - rect.bottom),
      left: Math.round(rect.left),
      radius: style.borderRadius,
      width: Math.round(rect.width),
    };
  });

  expect(metrics.left).toBe(0);
  expect(metrics.bottom).toBe(0);
  expect(metrics.radius).toBe("0px");
  expect(metrics.width).toBeGreaterThanOrEqual(389);
});

test("dashboard header shows the Kitakana logo and brand", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/dashboard");

  const header = page.getByTestId("app-header");
  await expect(header).toBeVisible();
  await expect(header.locator('img[src="/icons/kitakana.svg"]')).toBeVisible();
  await expect(header.getByText("Kitakana")).toBeVisible();
});
