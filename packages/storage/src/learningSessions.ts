import { kitakanaDb } from "./db";
import type {
  HomeLearningStats,
  LearningSessionInput,
  LearningSessionRecord,
} from "./types";

function toCompletedAt(value: LearningSessionInput["completedAt"]): number {
  const date =
    value instanceof Date
      ? value
      : typeof value === "number" || typeof value === "string"
        ? new Date(value)
        : new Date();

  const timestamp = date.getTime();

  if (Number.isNaN(timestamp)) {
    throw new RangeError("Learning session completedAt must be a valid date.");
  }

  return timestamp;
}

function getLocalDayStart(timestamp: number): number {
  const date = new Date(timestamp);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function getShiftedLocalDayStart(from: Date, daysBack: number): number {
  return new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate() - daysBack,
  ).getTime();
}

function getCurrentStreakDays(
  sessions: readonly LearningSessionRecord[],
  now = new Date(),
): number {
  const activeDays = new Set(
    sessions.map((session) => getLocalDayStart(session.completedAt)),
  );

  let streakDays = 0;

  while (activeDays.has(getShiftedLocalDayStart(now, streakDays))) {
    streakDays += 1;
  }

  return streakDays;
}

export async function recordLearningSession(
  input: LearningSessionInput,
): Promise<number> {
  if (input.total <= 0) {
    throw new RangeError("Learning session total must be greater than zero.");
  }

  if (input.correct < 0 || input.correct > input.total) {
    throw new RangeError("Learning session correct count is out of range.");
  }

  return kitakanaDb.learningSessions.add({
    completedAt: toCompletedAt(input.completedAt),
    correct: input.correct,
    engine: input.engine,
    source: input.source,
    total: input.total,
  });
}

export async function getHomeLearningStats(): Promise<HomeLearningStats> {
  const sessions = await kitakanaDb.learningSessions.toArray();
  const correctAnswers = sessions.reduce(
    (sum, session) => sum + session.correct,
    0,
  );
  const totalAnswers = sessions.reduce((sum, session) => sum + session.total, 0);
  const lastCompletedAt = sessions.reduce<number | null>(
    (latest, session) =>
      latest === null ? session.completedAt : Math.max(latest, session.completedAt),
    null,
  );

  return {
    accuracy:
      totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : null,
    correctAnswers,
    lastCompletedAt,
    sessionsCount: sessions.length,
    streakDays: getCurrentStreakDays(sessions),
    totalAnswers,
  };
}

export const learningSessionTestUtils = {
  getCurrentStreakDays,
  getLocalDayStart,
};
