"use client";

import type { KanaItem } from "@kitakana/content";
import { KanaChart, type KanaChartType } from "@kitakana/ui";
import { useLearningPreferences } from "@/hooks/useLearningPreferences";

export type KanaPageClientProps = {
  hiragana: readonly KanaItem[];
  katakana: readonly KanaItem[];
};

export function KanaPageClient({ hiragana, katakana }: KanaPageClientProps) {
  const { preferences } = useLearningPreferences();
  const defaultType: KanaChartType =
    preferences.defaultKanaType === "katakana" ? "katakana" : "hiragana";

  return (
    <KanaChart
      defaultType={defaultType}
      hiragana={hiragana}
      katakana={katakana}
      showRomaji={preferences.showRomaji}
    />
  );
}
