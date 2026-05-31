import { expect, test } from "@playwright/test";

test("kana preferences seed practice defaults", async ({
  page,
}) => {
  await page.goto("/settings");

  await page.getByTestId("setting-default-engine-typing").click();
  await page.getByTestId("setting-default-kana-type-katakana").click();
  await page.getByTestId("settings-save").click();

  await page.goto("/kana/practice");

  await expect(page.getByTestId("engine-toggle-typing")).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(page.getByTestId("type-toggle-hiragana")).toHaveAttribute(
    "aria-checked",
    "false",
  );
  await expect(page.getByTestId("type-toggle-katakana")).toHaveAttribute(
    "aria-checked",
    "true",
  );

  await page.getByTestId("group-card-vowel").click();
  await page.getByTestId("start-practice-btn").click();

  await expect(page.getByTestId("typing-input")).toBeVisible();
  await expect(page.getByTestId("quiz-progress")).toHaveText("1/5");
  await expect(page.getByTestId("kana-prompt")).toHaveAttribute(
    "data-source-id",
    /katakana-/,
  );
});

test("practice page works with multiple-choice engine", async ({ page }) => {
  await page.goto("/kana/practice");

  await expect(page.getByTestId("kana-group-selector")).toBeVisible();
  const vowelCard = page.getByTestId("group-card-vowel");
  await expect(vowelCard).toBeVisible();
  await expect(page.getByTestId("group-card-vowel-indicator")).toBeVisible();
  const cardMetrics = await vowelCard.evaluate((card) => {
    const indicator = card.querySelector<HTMLElement>(
      '[data-testid="group-card-vowel-indicator"]',
    );
    if (!indicator) return null;

    const cardRect = card.getBoundingClientRect();
    const indicatorRect = indicator.getBoundingClientRect();

    return {
      cardHeight: Math.round(cardRect.height),
      indicatorCenterY: Math.round(
        indicatorRect.top + indicatorRect.height / 2 - cardRect.top,
      ),
    };
  });

  expect(cardMetrics).not.toBeNull();
  expect(cardMetrics?.cardHeight).toBeGreaterThanOrEqual(144);
  expect(cardMetrics?.indicatorCenterY).toBeGreaterThan(
    (cardMetrics?.cardHeight ?? 0) / 2,
  );

  await vowelCard.click();
  await page.getByTestId("start-practice-btn").click();

  await expect(page.getByTestId("quiz-panel")).toBeVisible();
  await expect(page.getByTestId("quiz-option")).toHaveCount(4);

  await page.getByTestId("quiz-option").first().click();
  await expect(page.getByTestId("quiz-next")).toBeVisible();
});

test("practice page works with typing engine", async ({ page }) => {
  await page.goto("/kana/practice");

  await expect(page.getByTestId("kana-group-selector")).toBeVisible();

  await page.getByTestId("engine-toggle-typing").click();
  await page.getByTestId("group-card-vowel").click();
  await page.getByTestId("start-practice-btn").click();

  await expect(page.getByTestId("quiz-panel")).toBeVisible();
  await expect(page.getByTestId("typing-input")).toBeVisible();

  await page.getByTestId("typing-input").fill("a");
  await page.getByTestId("typing-submit").click();

  const isCorrect = await page
    .getByTestId("typing-feedback-correct")
    .isVisible();
  const isWrong = await page.getByTestId("typing-feedback-wrong").isVisible();
  expect(isCorrect || isWrong).toBe(true);

  await expect(page.getByTestId("quiz-next")).toBeVisible();
});

test(
  "practice typing uses first Enter to validate and second Enter to advance",
  async ({ page }) => {
    await page.goto("/kana/practice");

    await page.getByTestId("engine-toggle-typing").click();
    await page.getByTestId("group-card-vowel").click();
    await page.getByTestId("start-practice-btn").click();

    await expect(page.getByTestId("typing-input")).toBeVisible();
    await page.getByTestId("typing-input").fill("a");
    await page.getByTestId("typing-input").press("Enter");

    const isCorrect = await page
      .getByTestId("typing-feedback-correct")
      .isVisible();
    const isWrong = await page
      .getByTestId("typing-feedback-wrong")
      .isVisible();
    expect(isCorrect || isWrong).toBe(true);
    await expect(page.getByText(/Enter\s+untuk soal berikutnya/)).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(page.getByTestId("quiz-progress")).toHaveText("2/5");
    await expect(page.getByTestId("typing-input")).toBeEnabled();
  },
);
