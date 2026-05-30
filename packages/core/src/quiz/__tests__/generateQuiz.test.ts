import { describe, expect, it } from "vitest";
import { generateQuiz, type QuizSource } from "../generateQuiz";

const sources: QuizSource[] = [
  { id: "kanji-yama", prompt: "山", answer: "gunung" },
  { id: "kanji-kawa", prompt: "川", answer: "sungai" },
  { id: "kanji-mizu", prompt: "水", answer: "air" },
  { id: "kanji-hi", prompt: "火", answer: "api" },
  { id: "kanji-ame", prompt: "雨", answer: "hujan" },
];

describe("generateQuiz", () => {
  it("builds multiple-choice questions with unique options", () => {
    const questions = generateQuiz(sources, {
      count: 5,
      mode: "kanji-to-meaning",
      seed: 1,
    });

    expect(questions).toHaveLength(5);
    for (const question of questions) {
      expect(question.mode).toBe("kanji-to-meaning");
      expect(question.engine).toBe("multiple-choice");
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options).toContain(question.correctAnswer);
    }
  });

  it("builds typing questions without options", () => {
    const questions = generateQuiz([{ id: "kanji-yama", prompt: "山", answer: "やま" }], {
      count: 1,
      engine: "typing",
      mode: "kanji-to-reading",
      seed: 1,
    });

    expect(questions).toEqual([
      {
        id: "kanji-yama-q1",
        sourceId: "kanji-yama",
        prompt: "山",
        correctAnswer: "やま",
        options: [],
        engine: "typing",
        mode: "kanji-to-reading",
      },
    ]);
  });

  it("throws when multiple-choice has fewer than 4 unique answers", () => {
    expect(() =>
      generateQuiz(sources.slice(0, 3), {
        count: 1,
        mode: "kanji-to-meaning",
        seed: 1,
      }),
    ).toThrow(/4 distinct answers/);
  });

  it("does not repeat a source within a session", () => {
    const questions = generateQuiz(sources, {
      count: 5,
      mode: "kanji-to-reading",
      seed: 2,
    });
    const sourceIds = questions.map((question) => question.sourceId);
    expect(new Set(sourceIds).size).toBe(sourceIds.length);
  });
});
