import type { KanaItem } from "@kitakana/content";
import { createRng, shuffle } from "./random";
import type { QuizMode, QuizQuestion } from "./types";

export type GenerateKanaQuizOptions = {
  count: number;
  mode: QuizMode;
  /** Seed for the deterministic RNG. Defaults to a time-based seed. */
  seed?: number;
};

const OPTIONS_PER_QUESTION = 4;

/**
 * Build a kana quiz session from the given pool.
 *
 * Guarantees:
 *   - returns at most `count` questions (limited by pool size)
 *   - each question has exactly 4 unique options
 *   - the correct answer is always among the options
 *   - no `sourceId` is repeated within a session
 *
 * Throws if the pool has fewer than 4 distinct romaji values, since
 * we cannot build a 4-option multiple choice from less.
 */
export function generateKanaQuiz(
  items: readonly KanaItem[],
  options: GenerateKanaQuizOptions,
): QuizQuestion[] {
  const { count, mode, seed = Date.now() } = options;

  if (count <= 0) return [];

  const uniqueRomaji = new Set(items.map((item) => item.romaji));
  if (uniqueRomaji.size < OPTIONS_PER_QUESTION) {
    throw new Error(
      `Need at least ${OPTIONS_PER_QUESTION} distinct romaji to build a quiz, got ${uniqueRomaji.size}`,
    );
  }

  const rng = createRng(seed);
  const shuffledPool = shuffle(items, rng);
  const sessionSize = Math.min(count, shuffledPool.length);

  const questions: QuizQuestion[] = [];
  for (let index = 0; index < sessionSize; index++) {
    const source = shuffledPool[index];
    const distractorPool = items.filter(
      (candidate) => candidate.romaji !== source.romaji,
    );
    const distractorRomajiSeen = new Set<string>();
    const distractors: string[] = [];
    for (const candidate of shuffle(distractorPool, rng)) {
      if (distractorRomajiSeen.has(candidate.romaji)) continue;
      distractorRomajiSeen.add(candidate.romaji);
      distractors.push(candidate.romaji);
      if (distractors.length === OPTIONS_PER_QUESTION - 1) break;
    }

    const optionPool = shuffle(
      [source.romaji, ...distractors],
      rng,
    );

    questions.push({
      id: `${source.id}-q${index + 1}`,
      sourceId: source.id,
      prompt: source.kana,
      correctAnswer: source.romaji,
      options: optionPool,
      mode,
    });
  }

  return questions;
}
