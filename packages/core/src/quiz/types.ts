export type QuizMode = "kana-to-romaji";

export type QuizQuestion = {
  id: string;
  sourceId: string;
  prompt: string;
  correctAnswer: string;
  options: string[];
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
