import { describe, expect, it } from "vitest";
import { checkAnswer, summarizeQuiz } from "../scoring";
import type { QuizQuestion } from "../types";

const baseQuestion: QuizQuestion = {
  id: "q1",
  sourceId: "hiragana-a",
  prompt: "あ",
  correctAnswer: "a",
  options: ["a", "i", "u", "e"],
  engine: "multiple-choice",
  mode: "kana-to-romaji",
};

describe("checkAnswer", () => {
  it("matches case-insensitively and trims whitespace", () => {
    expect(checkAnswer(baseQuestion, "a")).toBe(true);
    expect(checkAnswer(baseQuestion, " A ")).toBe(true);
    expect(checkAnswer(baseQuestion, "i")).toBe(false);
  });
});

describe("summarizeQuiz", () => {
  const q1: QuizQuestion = { ...baseQuestion, id: "q1", correctAnswer: "a" };
  const q2: QuizQuestion = { ...baseQuestion, id: "q2", correctAnswer: "i" };
  const q3: QuizQuestion = { ...baseQuestion, id: "q3", correctAnswer: "u" };

  it("scores all correct as 100% accuracy", () => {
    const summary = summarizeQuiz(
      [q1, q2, q3],
      [
        { questionId: "q1", answer: "a" },
        { questionId: "q2", answer: "i" },
        { questionId: "q3", answer: "u" },
      ],
    );
    expect(summary).toEqual({
      total: 3,
      correct: 3,
      wrong: 0,
      accuracy: 1,
    });
  });

  it("scores all wrong as 0% accuracy", () => {
    const summary = summarizeQuiz(
      [q1, q2, q3],
      [
        { questionId: "q1", answer: "x" },
        { questionId: "q2", answer: "y" },
        { questionId: "q3", answer: "z" },
      ],
    );
    expect(summary.correct).toBe(0);
    expect(summary.wrong).toBe(3);
    expect(summary.accuracy).toBe(0);
  });

  it("handles a mixed result", () => {
    const summary = summarizeQuiz(
      [q1, q2, q3],
      [
        { questionId: "q1", answer: "a" },
        { questionId: "q2", answer: "wrong" },
        { questionId: "q3", answer: "u" },
      ],
    );
    expect(summary.correct).toBe(2);
    expect(summary.wrong).toBe(1);
    expect(summary.accuracy).toBeCloseTo(2 / 3);
  });

  it("returns zeroes when there are no questions", () => {
    expect(summarizeQuiz([], [])).toEqual({
      total: 0,
      correct: 0,
      wrong: 0,
      accuracy: 0,
    });
  });
});
