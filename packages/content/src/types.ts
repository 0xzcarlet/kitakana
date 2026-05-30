export type KanaType = "hiragana" | "katakana";

/**
 * Logical group used to slice the chart in the UI.
 *
 * - `vowel` for あいうえお / アイウエオ
 * - consonant rows: `k`, `s`, `t`, `n`, `h`, `m`, `y`, `r`, `w`
 * - `n-special` for ん / ン
 * - `dakuten` for voiced kana (が、ざ、だ、ば)
 * - `handakuten` for ぱ row
 * - `yoon` for combined kana (きゃ、しゅ、ちょ ...)
 */
export type KanaGroup =
  | "vowel"
  | "k"
  | "s"
  | "t"
  | "n"
  | "h"
  | "m"
  | "y"
  | "r"
  | "w"
  | "n-special"
  | "dakuten"
  | "handakuten"
  | "yoon";

export type KanaItem = {
  id: string;
  kana: string;
  romaji: string;
  type: KanaType;
  group: KanaGroup;
  order: number;
  isDakuten?: boolean;
  isHandakuten?: boolean;
  isYoon?: boolean;
};

export type KanjiLevel = "N1" | "N2" | "N3" | "N4" | "N5";

export type KanjiExample = {
  word: string;
  reading: string;
  meaning: string;
};

export type KanjiItem = {
  id: string;
  kanji: string;
  level: KanjiLevel;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
  quizReading: string;
  strokes: number;
  order: number;
  examples: KanjiExample[];
};
