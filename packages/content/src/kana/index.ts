import type { KanaGroup, KanaItem, KanaType } from "../types";
export type { KanaGroup } from "../types";
import hiraganaRaw from "./hiragana.json";
import katakanaRaw from "./katakana.json";

const VALID_TYPES = new Set<KanaType>(["hiragana", "katakana"]);
const VALID_GROUPS = new Set<KanaGroup>([
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
  "dakuten",
  "handakuten",
  "yoon",
]);

function isKanaItem(value: unknown): value is KanaItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;

  if (typeof item.id !== "string" || item.id.length === 0) return false;
  if (typeof item.kana !== "string" || item.kana.length === 0) return false;
  if (typeof item.romaji !== "string" || item.romaji.length === 0) return false;
  if (typeof item.order !== "number" || Number.isNaN(item.order)) return false;
  if (typeof item.type !== "string" || !VALID_TYPES.has(item.type as KanaType)) {
    return false;
  }
  if (
    typeof item.group !== "string" ||
    !VALID_GROUPS.has(item.group as KanaGroup)
  ) {
    return false;
  }

  if ("isDakuten" in item && typeof item.isDakuten !== "boolean") return false;
  if ("isHandakuten" in item && typeof item.isHandakuten !== "boolean") {
    return false;
  }
  if ("isYoon" in item && typeof item.isYoon !== "boolean") return false;

  return true;
}

/**
 * Validate a raw JSON array as a list of KanaItem.
 *
 * Throws if any entry is malformed or if duplicate ids exist within
 * the same array, so problems show up at boot rather than mid-quiz.
 */
export function parseKana(raw: unknown): KanaItem[] {
  if (!Array.isArray(raw)) {
    throw new Error("Expected kana data to be an array");
  }

  const seen = new Set<string>();
  const items: KanaItem[] = [];
  for (const entry of raw) {
    if (!isKanaItem(entry)) {
      throw new Error(`Invalid kana entry: ${JSON.stringify(entry)}`);
    }
    if (seen.has(entry.id)) {
      throw new Error(`Duplicate kana id: ${entry.id}`);
    }
    seen.add(entry.id);
    items.push(entry);
  }
  return items;
}

export const hiragana: KanaItem[] = parseKana(hiraganaRaw);
export const katakana: KanaItem[] = parseKana(katakanaRaw);

const allKana: KanaItem[] = [...hiragana, ...katakana];
const byId = new Map<string, KanaItem>(
  allKana.map((item) => [item.id, item]),
);

export function getKanaByType(type: KanaType): KanaItem[] {
  return type === "hiragana" ? hiragana : katakana;
}

export function getKanaById(id: string): KanaItem | undefined {
  return byId.get(id);
}

export function getKanaByGroup(
  type: KanaType,
  group: KanaGroup,
): KanaItem[] {
  return getKanaByType(type).filter((item) => item.group === group);
}

/**
 * Metadata for each kana group used to build the practice section selector UI.
 */
export type KanaGroupMeta = {
  group: KanaGroup;
  /** Human-readable label shown in the group card. */
  label: string;
  /** Controls rendering order in the UI. */
  displayOrder: number;
};

export const KANA_GROUP_META: KanaGroupMeta[] = [
  { group: "vowel",      label: "A I U E O",          displayOrder: 1 },
  { group: "k",          label: "Ka Ki Ku Ke Ko",      displayOrder: 2 },
  { group: "s",          label: "Sa Shi Su Se So",     displayOrder: 3 },
  { group: "t",          label: "Ta Chi Tsu Te To",    displayOrder: 4 },
  { group: "n",          label: "Na Ni Nu Ne No",      displayOrder: 5 },
  { group: "h",          label: "Ha Hi Fu He Ho",      displayOrder: 6 },
  { group: "m",          label: "Ma Mi Mu Me Mo",      displayOrder: 7 },
  { group: "y",          label: "Ya Yu Yo",            displayOrder: 8 },
  { group: "r",          label: "Ra Ri Ru Re Ro",      displayOrder: 9 },
  { group: "w",          label: "Wa Wo",               displayOrder: 10 },
  { group: "n-special",  label: "N (ん / ン)",         displayOrder: 11 },
  { group: "dakuten",    label: "Dakuten (voiced)",    displayOrder: 12 },
  { group: "handakuten", label: "Handakuten (ぱ row)", displayOrder: 13 },
  { group: "yoon",       label: "Yoon (combined)",     displayOrder: 14 },
];
