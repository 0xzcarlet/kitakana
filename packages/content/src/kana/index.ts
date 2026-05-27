import type { KanaGroup, KanaItem, KanaType } from "../types";
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
