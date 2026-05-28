import type { KanaItem } from "@kitakana/content";
import { createRng, shuffle } from "./random";
import type { QuizEngine, QuizMode, QuizQuestion } from "./types";

export type GenerateKanaQuizOptions = {
  count: number;
  mode: QuizMode;
  /** Quiz engine. Defaults to "multiple-choice". */
  engine?: QuizEngine;
  /** Seed for the deterministic RNG. Defaults to a time-based seed. */
  seed?: number;
};

const OPTIONS_PER_QUESTION = 4;

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
  const { count, mode, engine = "multiple-choice", seed = Date.now() } = options;

  if (count <= 0) return [];

  const uniqueRomaji = new Set(items.map((item) => item.romaji));

  if (engine === "multiple-choice" && uniqueRomaji.size < OPTIONS_PER_QUESTION) {
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

    if (engine === "typing") {
      questions.push({
        id: `${source.id}-q${index + 1}`,
        sourceId: source.id,
        prompt: source.kana,
        correctAnswer: source.romaji,
        options: [],
        engine,
        mode,
      });
      continue;
    }

    // ── multiple-choice: build distractor options ──
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
      engine,
      mode,
    });
  }

  return questions;
}
