import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { kitakanaDb } from "./db";
import { getHomeLearningStats, recordLearningSession } from "./learningSessions";

function getLocalDateDaysBack(daysBack: number, hour = 9): Date {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - daysBack,
    hour,
    0,
    0,
  );
}

beforeEach(async () => {
  await kitakanaDb.learningSessions.clear();
});

afterEach(async () => {
  await kitakanaDb.learningSessions.clear();
});

describe("getHomeLearningStats", () => {
  it("returns empty stats when there are no sessions", async () => {
    const stats = await getHomeLearningStats();

    expect(stats).toMatchObject({
      accuracy: null,
      correctAnswers: 0,
      sessionsCount: 0,
      streakDays: 0,
      totalAnswers: 0,
    });
    expect(stats.lastCompletedAt).toBeNull();
  });

  it("counts a session completed today as a one day streak", async () => {
    const today = getLocalDateDaysBack(0);

    await recordLearningSession({
      completedAt: today,
      correct: 8,
      source: "quiz",
      total: 10,
    });

    await expect(getHomeLearningStats()).resolves.toMatchObject({
      streakDays: 1,
    });
  });

  it("counts consecutive local dates as the current streak", async () => {
    await recordLearningSession({
      completedAt: getLocalDateDaysBack(0, 22),
      correct: 5,
      source: "practice",
      total: 5,
    });
    await recordLearningSession({
      completedAt: getLocalDateDaysBack(1, 8),
      correct: 4,
      source: "quiz",
      total: 5,
    });
    await recordLearningSession({
      completedAt: getLocalDateDaysBack(2, 23),
      correct: 3,
      source: "practice",
      total: 5,
    });

    await expect(getHomeLearningStats()).resolves.toMatchObject({
      streakDays: 3,
    });
  });

  it("rounds accuracy from all local answers", async () => {
    await recordLearningSession({
      completedAt: getLocalDateDaysBack(0, 9),
      correct: 7,
      source: "quiz",
      total: 10,
    });
    await recordLearningSession({
      completedAt: getLocalDateDaysBack(0, 10),
      correct: 2,
      source: "practice",
      total: 5,
    });

    await expect(getHomeLearningStats()).resolves.toMatchObject({
      accuracy: 60,
      correctAnswers: 9,
      sessionsCount: 2,
      totalAnswers: 15,
    });
  });
});
