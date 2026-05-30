import type { KanjiItem, KanjiLevel } from "../types";
export type { KanjiExample, KanjiItem, KanjiLevel } from "../types";
import kanjiN5Raw from "./n5.json";

const VALID_LEVELS = new Set<KanjiLevel>(["N1", "N2", "N3", "N4", "N5"]);

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((entry) => typeof entry === "string")
  );
}

function hasNonEmptyStrings(value: unknown): value is string[] {
  return isStringArray(value) && value.some((entry) => entry.trim().length > 0);
}

function isKanjiItem(value: unknown): value is KanjiItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;

  if (typeof item.id !== "string" || item.id.trim().length === 0) return false;
  if (typeof item.kanji !== "string" || item.kanji.trim().length === 0) {
    return false;
  }
  if (
    typeof item.level !== "string" ||
    !VALID_LEVELS.has(item.level as KanjiLevel)
  ) {
    return false;
  }
  if (!hasNonEmptyStrings(item.meanings)) return false;
  if (!isStringArray(item.onyomi)) return false;
  if (!isStringArray(item.kunyomi)) return false;
  if (
    typeof item.quizReading !== "string" ||
    item.quizReading.trim().length === 0
  ) {
    return false;
  }
  if (typeof item.strokes !== "number" || item.strokes <= 0) return false;
  if (typeof item.order !== "number" || Number.isNaN(item.order)) return false;
  if (!Array.isArray(item.examples) || item.examples.length === 0) return false;

  return item.examples.every((example) => {
    if (!example || typeof example !== "object") return false;
    const entry = example as Record<string, unknown>;
    return (
      typeof entry.word === "string" &&
      entry.word.trim().length > 0 &&
      typeof entry.reading === "string" &&
      entry.reading.trim().length > 0 &&
      typeof entry.meaning === "string" &&
      entry.meaning.trim().length > 0
    );
  });
}

export function parseKanji(raw: unknown): KanjiItem[] {
  if (!Array.isArray(raw)) {
    throw new Error("Expected kanji data to be an array");
  }

  const seen = new Set<string>();
  const items: KanjiItem[] = [];
  for (const entry of raw) {
    if (!isKanjiItem(entry)) {
      throw new Error(`Invalid kanji entry: ${JSON.stringify(entry)}`);
    }
    if (seen.has(entry.id)) {
      throw new Error(`Duplicate kanji id: ${entry.id}`);
    }
    seen.add(entry.id);
    items.push(entry);
  }
  return items.sort((a, b) => a.order - b.order);
}

export type KanjiLevelMeta = {
  displayOrder: number;
  isAvailable: boolean;
  label: KanjiLevel;
};

export const KANJI_LEVEL_META: KanjiLevelMeta[] = [
  { label: "N1", displayOrder: 1, isAvailable: false },
  { label: "N2", displayOrder: 2, isAvailable: false },
  { label: "N3", displayOrder: 3, isAvailable: false },
  { label: "N4", displayOrder: 4, isAvailable: false },
  { label: "N5", displayOrder: 5, isAvailable: true },
];

export const kanjiN5: KanjiItem[] = parseKanji(kanjiN5Raw);

const kanjiById = new Map<string, KanjiItem>(
  kanjiN5.map((item) => [item.id, item]),
);

const kanjiByLevel = new Map<KanjiLevel, KanjiItem[]>([
  ["N1", []],
  ["N2", []],
  ["N3", []],
  ["N4", []],
  ["N5", kanjiN5],
]);

export function getKanjiById(id: string): KanjiItem | undefined {
  return kanjiById.get(id);
}

export function getKanjiByLevel(level: KanjiLevel): KanjiItem[] {
  return kanjiByLevel.get(level) ?? [];
}
