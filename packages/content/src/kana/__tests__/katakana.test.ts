import { describe, expect, it } from "vitest";
import { katakana } from "../index";

describe("katakana dataset", () => {
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
    const basicCount = katakana.filter((item) =>
      basicGroups.has(item.group),
    ).length;
    expect(basicCount).toBeGreaterThanOrEqual(46);
  });

  it("contains no duplicate ids", () => {
    const ids = katakana.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has every entry typed as katakana", () => {
    for (const item of katakana) {
      expect(item.type).toBe("katakana");
    }
  });

  it("places key vowels in the right slot", () => {
    const a = katakana.find((item) => item.id === "katakana-a");
    expect(a?.kana).toBe("ア");
    expect(a?.romaji).toBe("a");
  });
});
