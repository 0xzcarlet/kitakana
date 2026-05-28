export type LearningSessionSource = "quiz" | "practice";

export type LearningSessionInput = {
  completedAt?: Date | number | string;
  correct: number;
  engine?: "multiple-choice" | "typing";
  source: LearningSessionSource;
  total: number;
};

export type LearningSessionRecord = {
  completedAt: number;
  correct: number;
  engine?: "multiple-choice" | "typing";
  id?: number;
  source: LearningSessionSource;
  total: number;
};

export type HomeLearningStats = {
  accuracy: number | null;
  correctAnswers: number;
  lastCompletedAt: number | null;
  sessionsCount: number;
  streakDays: number;
  totalAnswers: number;
};
