import { createRng, shuffle } from "./random";
import type { QuizEngine, QuizMode, QuizQuestion } from "./types";

export type QuizSource = {
  id: string;
  prompt: string;
  answer: string;
};

export type GenerateQuizOptions = {
  count: number;
  mode: QuizMode;
  /** Quiz engine. Defaults to "multiple-choice". */
  engine?: QuizEngine;
  /** Seed for the deterministic RNG. Defaults to a time-based seed. */
  seed?: number;
};

const OPTIONS_PER_QUESTION = 4;

export function generateQuiz(
  sources: readonly QuizSource[],
  options: GenerateQuizOptions,
): QuizQuestion[] {
  const { count, mode, engine = "multiple-choice", seed = Date.now() } = options;

  if (count <= 0) return [];

  const uniqueAnswers = new Set(sources.map((source) => source.answer));

  if (engine === "multiple-choice" && uniqueAnswers.size < OPTIONS_PER_QUESTION) {
    throw new Error(
      `Need at least ${OPTIONS_PER_QUESTION} distinct answers to build a quiz, got ${uniqueAnswers.size}`,
    );
  }

  const rng = createRng(seed);
  const sessionSources: QuizSource[] = [];
  while (sessionSources.length < count && sources.length > 0) {
    const shuffledPool = shuffle(sources, rng);
    const remaining = count - sessionSources.length;
    sessionSources.push(...shuffledPool.slice(0, remaining));
  }

  const questions: QuizQuestion[] = [];
  for (let index = 0; index < sessionSources.length; index++) {
    const source = sessionSources[index];

    if (engine === "typing") {
      questions.push({
        id: `${source.id}-q${index + 1}`,
        sourceId: source.id,
        prompt: source.prompt,
        correctAnswer: source.answer,
        options: [],
        engine,
        mode,
      });
      continue;
    }

    const distractorPool = sources.filter(
      (candidate) => candidate.answer !== source.answer,
    );
    const distractorAnswerSeen = new Set<string>();
    const distractors: string[] = [];
    for (const candidate of shuffle(distractorPool, rng)) {
      if (distractorAnswerSeen.has(candidate.answer)) continue;
      distractorAnswerSeen.add(candidate.answer);
      distractors.push(candidate.answer);
      if (distractors.length === OPTIONS_PER_QUESTION - 1) break;
    }

    const optionPool = shuffle([source.answer, ...distractors], rng);

    questions.push({
      id: `${source.id}-q${index + 1}`,
      sourceId: source.id,
      prompt: source.prompt,
      correctAnswer: source.answer,
      options: optionPool,
      engine,
      mode,
    });
  }

  return questions;
}
