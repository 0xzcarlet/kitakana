import { expect, test } from "@playwright/test";

test("settings saves kana learning preferences after reload", async ({ page }) => {
  await page.goto("/settings");

  await expect(page.getByTestId("settings-page")).toBeVisible();
  await page.getByTestId("setting-default-engine-typing").click();
  await page.getByTestId("setting-default-kana-type-katakana").click();
  await page.getByTestId("setting-question-count-5").click();
  await page.getByTestId("setting-show-romaji").uncheck();
  await expect(page.getByTestId("settings-save-status")).toContainText(
    "belum disimpan",
  );
  await page.getByTestId("settings-save").click();
  await expect(page.getByTestId("settings-save-status")).toContainText(
    "tersimpan",
  );

  await page.reload();

  await expect(page.getByTestId("setting-default-engine-typing")).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(
    page.getByTestId("setting-default-kana-type-katakana"),
  ).toHaveAttribute("aria-checked", "true");
  await expect(page.getByTestId("setting-question-count-5")).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(page.getByTestId("setting-show-romaji")).not.toBeChecked();
});

test("romaji preference hides kana helpers without blocking practice", async ({
  page,
}) => {
  await page.goto("/settings");
  await page.getByTestId("setting-show-romaji").uncheck();
  await page.getByTestId("settings-save").click();

  await page.goto("/kana");

  await expect(page.getByTestId("kana-chart")).toBeVisible();
  await expect(page.getByTestId("kana-tile").first()).not.toContainText("a");

  await page.goto("/kana/practice");

  await expect(page.getByTestId("group-card-vowel")).not.toContainText(
    "A I U E O",
  );
  await page.getByTestId("group-card-vowel").click();
  await page.getByTestId("start-practice-btn").click();

  await expect(page.getByTestId("quiz-panel")).toBeVisible();
});
