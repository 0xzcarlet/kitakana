import { describe, expect, it } from "vitest";
import {
  getKanaByGroup,
  getKanaById,
  getKanaByType,
  hiragana,
  katakana,
  parseKana,
} from "../index";

describe("kana loader helpers", () => {
  it("returns hiragana entries via getKanaByType", () => {
    expect(getKanaByType("hiragana")).toBe(hiragana);
    expect(getKanaByType("hiragana").length).toBe(hiragana.length);
  });

  it("returns katakana entries via getKanaByType", () => {
    expect(getKanaByType("katakana")).toBe(katakana);
  });

  it("looks up entries by id across both kana sets", () => {
    expect(getKanaById("hiragana-a")?.kana).toBe("あ");
    expect(getKanaById("katakana-a")?.kana).toBe("ア");
    expect(getKanaById("does-not-exist")).toBeUndefined();
  });

  it("filters by group", () => {
    const vowels = getKanaByGroup("hiragana", "vowel");
    expect(vowels.length).toBe(5);
    expect(vowels.every((item) => item.group === "vowel")).toBe(true);
  });
});

describe("parseKana", () => {
  it("throws when given a non-array", () => {
    expect(() => parseKana({})).toThrow();
  });

  it("throws on duplicate ids", () => {
    const duplicate = [
      { id: "x", kana: "a", romaji: "a", type: "hiragana", group: "vowel", order: 1 },
      { id: "x", kana: "b", romaji: "b", type: "hiragana", group: "vowel", order: 2 },
    ];
    expect(() => parseKana(duplicate)).toThrow(/Duplicate/);
  });

  it("throws on invalid entry shape", () => {
    expect(() =>
      parseKana([{ id: "x", kana: "a", romaji: "a", type: "hiragana" }]),
    ).toThrow(/Invalid/);
  });
});
