import { expect, test } from "@playwright/test";

test("kana page renders the chart and toggles kana type", async ({ page }) => {
  await page.goto("/kana");

  await expect(page.getByTestId("app-header")).toHaveCount(0);
  await expect(page.getByTestId("kana-chart")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Hiragana" }),
  ).toBeVisible();
  await expect(
    page.getByTestId("kana-tile").filter({ hasText: "あ" }).first(),
  ).toBeVisible();

  await page.getByTestId("kana-toggle-katakana").click();

  await expect(
    page.getByRole("heading", { name: "Katakana" }),
  ).toBeVisible();
  await expect(
    page.getByTestId("kana-tile").filter({ hasText: "ア" }).first(),
  ).toBeVisible();
});
