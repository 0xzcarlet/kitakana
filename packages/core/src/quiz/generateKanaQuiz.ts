import type { KanaItem } from "@kitakana/content";
import { generateQuiz } from "./generateQuiz";
import type { QuizEngine, QuizMode, QuizQuestion } from "./types";

export type GenerateKanaQuizOptions = {
  count: number;
  mode: QuizMode;
  /** Quiz engine. Defaults to "multiple-choice". */
  engine?: QuizEngine;
  /** Seed for the deterministic RNG. Defaults to a time-based seed. */
  seed?: number;
};

/**
 * Build a kana quiz session from the given pool.
 *
 * Guarantees:
 *   - returns at most `count` questions (limited by pool size)
 *   - for multiple-choice: each question has exactly 4 unique options,
 *     correct answer is always among them, and the pool must have ≥ 4
 *     distinct romaji values
 *   - for typing: questions have an empty options array; pool only needs ≥ 1 item
 *   - no `sourceId` is repeated within a session
 */
export function generateKanaQuiz(
  items: readonly KanaItem[],
  options: GenerateKanaQuizOptions,
): QuizQuestion[] {
  return generateQuiz(
    items.map((item) => ({
      answer: item.romaji,
      id: item.id,
      prompt: item.kana,
    })),
    options,
  );
}
