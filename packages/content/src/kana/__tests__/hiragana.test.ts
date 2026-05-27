import { describe, expect, it } from "vitest";
import { hiragana } from "../index";

describe("hiragana dataset", () => {
  it("has at least the full gojuon (46 base kana)", () => {
    const basicGroups = new Set([
      "vowel",
      "k",
      "s",
      "t",
      "n",
      "h",
      "m",
      "y",
      "r",
      "w",
      "n-special",
    ]);
    const basicCount = hiragana.filter((item) =>
      basicGroups.has(item.group),
    ).length;
    expect(basicCount).toBeGreaterThanOrEqual(46);
  });

  it("contains no duplicate ids", () => {
    const ids = hiragana.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has every entry typed as hiragana", () => {
    for (const item of hiragana) {
      expect(item.type).toBe("hiragana");
    }
  });

  it("has non-empty kana and romaji on every entry", () => {
    for (const item of hiragana) {
      expect(item.kana.length).toBeGreaterThan(0);
      expect(item.romaji.length).toBeGreaterThan(0);
    }
  });

  it("places key vowels in the right slot", () => {
    const a = hiragana.find((item) => item.id === "hiragana-a");
    expect(a?.kana).toBe("あ");
    expect(a?.romaji).toBe("a");
  });
});
