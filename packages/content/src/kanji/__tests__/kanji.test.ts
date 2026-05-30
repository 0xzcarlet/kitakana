import { describe, expect, it } from "vitest";
import {
  KANJI_LEVEL_META,
  getKanjiById,
  getKanjiByLevel,
  kanjiN5,
  parseKanji,
} from "../index";

describe("kanji loader helpers", () => {
  it("exposes levels with the available N5 content first", () => {
    expect(KANJI_LEVEL_META.map((level) => level.label)).toEqual([
      "N5",
      "N4",
      "N3",
      "N2",
      "N1",
    ]);
    expect(KANJI_LEVEL_META.filter((level) => level.isAvailable)).toEqual([
      { label: "N5", displayOrder: 1, isAvailable: true },
    ]);
  });

  it("returns N5 entries via getKanjiByLevel", () => {
    expect(getKanjiByLevel("N5")).toBe(kanjiN5);
    expect(getKanjiByLevel("N1")).toEqual([]);
  });

  it("looks up entries by id", () => {
    expect(getKanjiById("n5-hi")?.kanji).toBe("日");
    expect(getKanjiById("does-not-exist")).toBeUndefined();
  });

  it("keeps the N5 dataset valid and ordered", () => {
    expect(kanjiN5.length).toBeGreaterThanOrEqual(80);

    const ids = new Set<string>();
    for (let index = 0; index < kanjiN5.length; index++) {
      const item = kanjiN5[index];
      expect(item.level).toBe("N5");
      expect(item.order).toBe(index + 1);
      expect(item.kanji).toBeTruthy();
      expect(item.meanings.length).toBeGreaterThan(0);
      expect(item.quizReading).toBeTruthy();
      expect(item.strokes).toBeGreaterThan(0);
      expect(item.examples.length).toBeGreaterThan(0);
      expect(ids.has(item.id)).toBe(false);
      ids.add(item.id);
    }
  });
});

describe("parseKanji", () => {
  it("throws when given a non-array", () => {
    expect(() => parseKanji({})).toThrow();
  });

  it("throws on duplicate ids", () => {
    const duplicate = [
      {
        id: "x",
        kanji: "山",
        level: "N5",
        meanings: ["gunung"],
        onyomi: ["サン"],
        kunyomi: ["やま"],
        quizReading: "やま",
        strokes: 3,
        order: 1,
        examples: [{ word: "山", reading: "やま", meaning: "gunung" }],
      },
      {
        id: "x",
        kanji: "川",
        level: "N5",
        meanings: ["sungai"],
        onyomi: ["セン"],
        kunyomi: ["かわ"],
        quizReading: "かわ",
        strokes: 3,
        order: 2,
        examples: [{ word: "川", reading: "かわ", meaning: "sungai" }],
      },
    ];
    expect(() => parseKanji(duplicate)).toThrow(/Duplicate/);
  });

  it("throws on invalid entry shape", () => {
    expect(() =>
      parseKanji([{ id: "x", kanji: "山", level: "N5" }]),
    ).toThrow(/Invalid/);
  });
});
