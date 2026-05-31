import { expect, test } from "@playwright/test";

test("kanji page shows levels with N5 detail and practice actions", async ({
  page,
}) => {
  await page.goto("/kanji");

  await expect(
    page.getByRole("heading", { name: "Belajar Kanji" }),
  ).toBeVisible();
  await expect(page.getByTestId("kanji-level-n1")).toBeVisible();
  await expect(page.getByTestId("kanji-level-n2")).toBeVisible();
  await expect(page.getByTestId("kanji-level-n3")).toBeVisible();
  await expect(page.getByTestId("kanji-level-n4")).toBeVisible();
  await expect(page.getByTestId("kanji-level-n5")).toBeVisible();
  await expect(page.getByTestId("kanji-level-n1")).toContainText(
    "Coming soon",
  );
  await expect(page.getByTestId("kanji-level-n2")).toContainText(
    "Coming soon",
  );
  await expect(page.getByTestId("kanji-level-n3")).toContainText(
    "Coming soon",
  );
  await expect(page.getByTestId("kanji-level-n4")).toContainText(
    "Coming soon",
  );
  await expect(page.getByTestId("kanji-n5-detail-btn")).toBeVisible();
  await expect(page.getByTestId("kanji-n5-practice-btn")).toBeVisible();

  await page.getByTestId("kanji-n5-detail-btn").click();

  await expect(page.getByTestId("kanji-detail-view")).toBeVisible();
  await expect(page.getByTestId("kanji-detail-panel")).toBeVisible();
  await expect(page.getByTestId("kanji-detail-panel")).toContainText("日");
  await expect(page.getByTestId("kanji-detail-panel")).toContainText("On'yomi");
  expect(await page.getByTestId("kanji-detail-item").count()).toBeGreaterThan(
    70,
  );
});

test("mobile kanji detail opens inline below the selected kanji", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/kanji");

  await page.getByTestId("kanji-n5-detail-btn").click();
  await expect(page.getByTestId("kanji-detail-view")).toBeVisible();

  const selectedKanji = page.getByTestId("kanji-detail-item").nth(1);
  await selectedKanji.click();

  const inlinePanel = page.getByTestId("kanji-detail-inline-panel");
  await expect(inlinePanel).toBeVisible();
  await expect(inlinePanel).toContainText("一");
  await expect(inlinePanel).toContainText("satu");
  await expect(page.getByTestId("kanji-detail-panel")).toBeHidden();
  await expect(selectedKanji).toHaveAttribute("aria-pressed", "true");

  await expect
    .poll(async () =>
      selectedKanji.evaluate(
        (element) =>
          element.nextElementSibling?.getAttribute("data-testid") ?? null,
      ),
    )
    .toBe("kanji-detail-inline-panel");

  await expect
    .poll(async () => {
      const selectedBox = await selectedKanji.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return { bottom: rect.bottom };
      });
      const panelBox = await inlinePanel.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return { top: rect.top };
      });

      return panelBox.top >= selectedBox.bottom;
    })
    .toBe(true);
});

test("kanji practice works with multiple-choice engine", async ({ page }) => {
  await page.goto("/kanji");

  await page.getByTestId("kanji-n5-practice-btn").click();
  await expect(page.getByTestId("kanji-practice-setup")).toBeVisible();
  await page.getByTestId("kanji-select-all").click();
  await page.getByTestId("start-kanji-practice-btn").click();

  await expect(page.getByTestId("quiz-panel")).toBeVisible();
  await expect(page.getByTestId("kanji-prompt")).toBeVisible();
  await expect(page.getByTestId("quiz-option")).toHaveCount(4);
  await page.getByTestId("quiz-option").first().click();
  await expect(page.getByTestId("quiz-next")).toBeVisible();
});

test("kanji practice works with typing engine", async ({ page }) => {
  await page.goto("/kanji");

  await page.getByTestId("kanji-n5-practice-btn").click();
  await page.getByTestId("kanji-engine-typing").click();
  await page.getByTestId("kanji-target-reading").click();
  await page.getByTestId("kanji-select-all").click();
  await page.getByTestId("start-kanji-practice-btn").click();

  await expect(page.getByTestId("quiz-panel")).toBeVisible();
  await expect(page.getByTestId("kanji-prompt")).toBeVisible();
  await expect(page.getByTestId("typing-input")).toBeVisible();
  await page.getByTestId("typing-input").fill("x");
  await page.getByTestId("typing-input").press("Enter");
  await expect(page.getByTestId("typing-feedback-wrong")).toBeVisible();
  await expect(page.getByText(/Enter\s+untuk soal berikutnya/)).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page.getByTestId("quiz-progress")).toHaveText("2/10");
});
