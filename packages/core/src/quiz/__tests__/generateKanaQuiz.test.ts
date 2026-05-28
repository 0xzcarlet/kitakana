import { describe, expect, it } from "vitest";
import { hiragana } from "@kitakana/content";
import { generateKanaQuiz } from "../generateKanaQuiz";

describe("generateKanaQuiz", () => {
  it("respects the requested count when the pool is large enough", () => {
    const questions = generateKanaQuiz(hiragana, {
      count: 10,
      mode: "kana-to-romaji",
      seed: 1,
    });
    expect(questions).toHaveLength(10);
  });

  it("returns deterministic output for the same seed", () => {
    const a = generateKanaQuiz(hiragana, {
      count: 10,
      mode: "kana-to-romaji",
      seed: 42,
    });
    const b = generateKanaQuiz(hiragana, {
      count: 10,
      mode: "kana-to-romaji",
      seed: 42,
    });
    expect(a).toEqual(b);
  });

  it("gives every question exactly 4 unique options that include the correct answer", () => {
    const questions = generateKanaQuiz(hiragana, {
      count: 20,
      mode: "kana-to-romaji",
      seed: 7,
    });
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options).toContain(question.correctAnswer);
    }
  });

  it("does not repeat the same source kana in a session", () => {
    const questions = generateKanaQuiz(hiragana, {
      count: 30,
      mode: "kana-to-romaji",
      seed: 13,
    });
    const ids = questions.map((q) => q.sourceId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("returns an empty array when count is zero or negative", () => {
    expect(
      generateKanaQuiz(hiragana, { count: 0, mode: "kana-to-romaji" }),
    ).toEqual([]);
    expect(
      generateKanaQuiz(hiragana, { count: -3, mode: "kana-to-romaji" }),
    ).toEqual([]);
  });

  it("throws when the pool has fewer than 4 distinct romaji", () => {
    const tinyPool = hiragana.slice(0, 3);
    expect(() =>
      generateKanaQuiz(tinyPool, { count: 1, mode: "kana-to-romaji", seed: 1 }),
    ).toThrow();
  });

  describe("engine: typing", () => {
    it("generates questions with empty options array and engine field set", () => {
      const questions = generateKanaQuiz(hiragana, {
        count: 5,
        mode: "kana-to-romaji",
        engine: "typing",
        seed: 1,
      });
      expect(questions).toHaveLength(5);
      for (const q of questions) {
        expect(q.options).toEqual([]);
        expect(q.engine).toBe("typing");
        expect(q.correctAnswer).toBeTruthy();
      }
    });

    it("works with pools smaller than 4 unique romaji", () => {
      const tinyPool = hiragana.slice(0, 2);
      const questions = generateKanaQuiz(tinyPool, {
        count: 2,
        mode: "kana-to-romaji",
        engine: "typing",
        seed: 1,
      });
      expect(questions).toHaveLength(2);
    });

    it("returns deterministic output for the same seed", () => {
      const a = generateKanaQuiz(hiragana, {
        count: 10,
        mode: "kana-to-romaji",
        engine: "typing",
        seed: 42,
      });
      const b = generateKanaQuiz(hiragana, {
        count: 10,
        mode: "kana-to-romaji",
        engine: "typing",
        seed: 42,
      });
      expect(a).toEqual(b);
    });
  });

  describe("engine: multiple-choice (explicit)", () => {
    it("sets engine field to multiple-choice", () => {
      const questions = generateKanaQuiz(hiragana, {
        count: 3,
        mode: "kana-to-romaji",
        engine: "multiple-choice",
        seed: 1,
      });
      for (const q of questions) {
        expect(q.engine).toBe("multiple-choice");
        expect(q.options).toHaveLength(4);
      }
    });
  });
});
