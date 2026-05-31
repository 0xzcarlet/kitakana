import { expect, type Page } from "@playwright/test";

export async function completeMultipleChoiceQuiz(page: Page) {
  for (let step = 0; step < 10; step++) {
    await page.getByTestId("quiz-option").first().click();
    await expect(page.getByTestId("quiz-next")).toBeVisible();
    await page.getByTestId("quiz-next").click();

    if (await page.getByTestId("quiz-result").isVisible()) {
      return;
    }
  }

  await expect(page.getByTestId("quiz-result")).toBeVisible();
}
