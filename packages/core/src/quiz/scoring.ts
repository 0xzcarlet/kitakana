import type { QuizAnswer, QuizQuestion, QuizSummary } from "./types";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function checkAnswer(
  question: QuizQuestion,
  answer: string,
): boolean {
  return normalize(question.correctAnswer) === normalize(answer);
}

export function summarizeQuiz(
  questions: readonly QuizQuestion[],
  answers: readonly QuizAnswer[],
): QuizSummary {
  const total = questions.length;
  if (total === 0) {
    return { total: 0, correct: 0, wrong: 0, accuracy: 0 };
  }

  const answerByQuestionId = new Map(
    answers.map((entry) => [entry.questionId, entry.answer] as const),
  );

  let correct = 0;
  for (const question of questions) {
    const userAnswer = answerByQuestionId.get(question.id);
    if (userAnswer === undefined) continue;
    if (checkAnswer(question, userAnswer)) correct++;
  }

  const wrong = total - correct;
  return {
    total,
    correct,
    wrong,
    accuracy: correct / total,
  };
}
