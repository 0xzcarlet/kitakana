import { expect, test, type Page } from "@playwright/test";

async function completeMultipleChoiceQuiz(page: Page) {
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

async function getLearningSessionCount(page: Page): Promise<number> {
  return page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        const request = indexedDB.open("kitakana-local");

        request.onerror = () => resolve(0);
        request.onsuccess = () => {
          const db = request.result;

          if (!db.objectStoreNames.contains("learningSessions")) {
            db.close();
            resolve(0);
            return;
          }

          const transaction = db.transaction("learningSessions", "readonly");
          const countRequest = transaction
            .objectStore("learningSessions")
            .count();

          countRequest.onerror = () => {
            db.close();
            resolve(0);
          };
          countRequest.onsuccess = () => {
            const count = countRequest.result;
            db.close();
            resolve(count);
          };
        };
      }),
  );
}

test("home dashboard renders only the local learning cards", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("app-header")).toBeVisible();
  await expect(page.getByTestId("home-streak-card")).toBeVisible();
  await expect(page.getByTestId("home-kana-cta-card")).toBeVisible();
  await expect(page.getByTestId("home-accuracy-card")).toBeVisible();
  await expect(page.locator("[data-testid^='home-'][data-testid$='-card']")).toHaveCount(3);

  await expect(page.getByTestId("home-streak-card")).toContainText("0 hari");
  await expect(page.getByTestId("home-accuracy-card")).toContainText("Belum ada");
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

test("desktop sidebar stays pinned while content scrolls", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/kana");

  const sidebar = page.getByTestId("app-sidebar");
  await expect(sidebar).toBeVisible();
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
  await page.goto("/");

  const nav = page.getByTestId("mobile-bottom-nav");
  await expect(nav).toBeVisible();

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

test("quiz page advances with Enter after choosing an option", async ({ page }) => {
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
  const isCorrect = await page
    .getByTestId("typing-feedback-correct")
    .isVisible();
  const isWrong = await page.getByTestId("typing-feedback-wrong").isVisible();
  expect(isCorrect || isWrong).toBe(true);

  // Verify Next button is visible
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
