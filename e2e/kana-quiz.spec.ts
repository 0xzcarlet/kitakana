import { expect, test } from "@playwright/test";

test("quiz page gives feedback and reaches the result screen", async ({
  page,
}) => {
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

test("quiz page advances with Enter after choosing an option", async ({
  page,
}) => {
  await page.goto("/quiz");

  await expect(page.getByTestId("quiz-panel")).toBeVisible();
  const firstSourceId = await page
    .getByTestId("kana-prompt")
    .getAttribute("data-source-id");

  await page.getByTestId("quiz-option").first().click();
  await expect(page.getByText(/Enter\s+untuk soal berikutnya/)).toBeVisible();
  await page.keyboard.press("Enter");

  await expect(page.getByTestId("quiz-progress")).toHaveText("2/10");
  await expect(page.getByTestId("kana-prompt")).not.toHaveAttribute(
    "data-source-id",
    firstSourceId ?? "",
  );
});

test("quiz options stay in a two-column grid on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/quiz");

  await expect(page.getByTestId("quiz-panel")).toBeVisible();
  await expect(page.getByTestId("quiz-option")).toHaveCount(4);

  const boxes = await page.getByTestId("quiz-option").evaluateAll((options) =>
    options.map((option) => {
      const rect = option.getBoundingClientRect();
      return {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
      };
    }),
  );

  expect(boxes[1].x).toBeGreaterThan(boxes[0].x);
  expect(Math.abs(boxes[1].y - boxes[0].y)).toBeLessThanOrEqual(2);
  expect(Math.abs(boxes[2].x - boxes[0].x)).toBeLessThanOrEqual(2);
  expect(boxes[2].y).toBeGreaterThan(boxes[0].y);
  expect(Math.abs(boxes[3].x - boxes[1].x)).toBeLessThanOrEqual(2);
  expect(Math.abs(boxes[3].y - boxes[2].y)).toBeLessThanOrEqual(2);
});
