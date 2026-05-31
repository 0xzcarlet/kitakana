import { expect, test } from "@playwright/test";
import { completeMultipleChoiceQuiz } from "./helpers/quiz";
import { getLearningSessionCount } from "./helpers/storage";

test("home dashboard renders only the local learning cards", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("app-header")).toBeVisible();
  await expect(page.getByRole("link", { name: /Kanji/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Review/ })).toHaveCount(0);
  await expect(page.getByTestId("home-streak-card")).toBeVisible();
  await expect(page.getByTestId("home-kana-cta-card")).toBeVisible();
  await expect(page.getByTestId("home-accuracy-card")).toBeVisible();
  await expect(
    page.locator("[data-testid^='home-'][data-testid$='-card']"),
  ).toHaveCount(3);

  await expect(page.getByTestId("home-streak-card")).toContainText("0 hari");
  await expect(page.getByTestId("home-accuracy-card")).toContainText(
    "Belum ada",
  );
  await expect(page.getByText("Review hari ini")).toHaveCount(0);
  await expect(page.getByText("Progress hari ini")).toHaveCount(0);
  await expect(page.getByText("Aktivitas terbaru")).toHaveCount(0);
});

test("home dashboard reads local streak and accuracy after a quiz", async ({
  page,
}) => {
  await page.goto("/quiz");

  await expect(page.getByTestId("quiz-panel")).toBeVisible();
  await completeMultipleChoiceQuiz(page);
  await expect(page.getByTestId("quiz-result")).toBeVisible();
  await expect
    .poll(() => getLearningSessionCount(page), { timeout: 5_000 })
    .toBeGreaterThan(0);

  await page.goto("/");

  await expect(page.getByTestId("home-streak-card")).toContainText("1 hari");
  await expect(page.getByTestId("home-accuracy-card")).toContainText(/\d+%/);
  await expect(page.getByTestId("home-accuracy-card")).toContainText(
    /\/10 jawaban benar/,
  );
});
