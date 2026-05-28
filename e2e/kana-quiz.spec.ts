import { expect, test } from "@playwright/test";

test("kana page renders the chart and toggles kana type", async ({ page }) => {
  await page.goto("/kana");

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

test("quiz page gives feedback and reaches the result screen", async ({ page }) => {
  await page.goto("/quiz");

  await expect(page.getByTestId("quiz-panel")).toBeVisible();
  await expect(page.getByTestId("kana-prompt")).toBeVisible();
  await expect(page.getByTestId("quiz-option")).toHaveCount(4);

  for (let step = 0; step < 10; step++) {
    await page.getByTestId("quiz-option").first().click();

    const optionStates = await page
      .getByTestId("quiz-option")
      .evaluateAll((options) =>
        options.map((option) => option.getAttribute("data-state")),
      );
    expect(optionStates).toContain("correct");

    await expect(page.getByTestId("quiz-next")).toBeVisible();
    await page.getByTestId("quiz-next").click();

    if (await page.getByTestId("quiz-result").isVisible()) {
      break;
    }
  }

  await expect(page.getByTestId("quiz-result")).toBeVisible();
  await expect(page.getByTestId("quiz-result-accuracy")).toContainText("%");
});

test("practice page works with multiple-choice engine", async ({ page }) => {
  await page.goto("/kana/practice");

  await expect(page.getByTestId("kana-group-selector")).toBeVisible();
  
  // Select a group (e.g. vowel group)
  await page.getByTestId("group-card-vowel").click();
  
  // Start practice
  await page.getByTestId("start-practice-btn").click();
  
  // Verify quiz panel shows up
  await expect(page.getByTestId("quiz-panel")).toBeVisible();
  await expect(page.getByTestId("quiz-option")).toHaveCount(4);

  // Complete one question
  await page.getByTestId("quiz-option").first().click();
  await expect(page.getByTestId("quiz-next")).toBeVisible();
});

test("practice page works with typing engine", async ({ page }) => {
  await page.goto("/kana/practice");

  await expect(page.getByTestId("kana-group-selector")).toBeVisible();

  // Select typing engine
  await page.getByTestId("engine-toggle-typing").click();

  // Select a group
  await page.getByTestId("group-card-vowel").click();

  // Start practice
  await page.getByTestId("start-practice-btn").click();

  // Verify typing quiz panel shows up
  await expect(page.getByTestId("quiz-panel")).toBeVisible();
  await expect(page.getByTestId("typing-input")).toBeVisible();

  // Type an answer
  await page.getByTestId("typing-input").fill("a");
  await page.getByTestId("typing-submit").click();

  // Verify feedback is shown (either correct or wrong)
  const isCorrect = await page.getByTestId("typing-feedback-correct").isVisible();
  const isWrong = await page.getByTestId("typing-feedback-wrong").isVisible();
  expect(isCorrect || isWrong).toBe(true);

  // Verify Next button is visible
  await expect(page.getByTestId("quiz-next")).toBeVisible();
});

