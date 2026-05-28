export type QuizMode = "kana-to-romaji";

export type QuizEngine = "multiple-choice" | "typing";

export type QuizQuestion = {
  id: string;
  sourceId: string;
  prompt: string;
  correctAnswer: string;
  /** Option labels for multiple-choice; empty array for typing engine. */
  options: string[];
  engine: QuizEngine;
  mode: QuizMode;
};

export type QuizAnswer = {
  questionId: string;
  answer: string;
};

export type QuizSummary = {
  total: number;
  correct: number;
  wrong: number;
  /** Accuracy as a number between 0 and 1. */
  accuracy: number;
};
