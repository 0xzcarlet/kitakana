"use client";

import { useMemo, useState } from "react";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { KanaTile } from "../molecules/KanaTile";

export type KanaChartType = "hiragana" | "katakana";

export type KanaChartItem = {
  id: string;
  kana: string;
  romaji: string;
  type: KanaChartType;
  group: string;
  order: number;
};

export type KanaChartProps = {
  hiragana: readonly KanaChartItem[];
  katakana: readonly KanaChartItem[];
  defaultType?: KanaChartType;
  learnedIds?: readonly string[];
  onToggleLearned?: (id: string) => void;
};

type Section = {
  id: string;
  label: string;
  items: KanaChartItem[];
};

const BASIC_GROUPS = [
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
] as const;

function buildSections(items: readonly KanaChartItem[]): Section[] {
  const grouped = new Map<string, KanaChartItem[]>();
  for (const item of items) {
    const list = grouped.get(item.group) ?? [];
    list.push(item);
    grouped.set(item.group, list);
  }
  for (const list of grouped.values()) {
    list.sort((a, b) => a.order - b.order);
  }

  const sections: Section[] = [];
  const basic: KanaChartItem[] = [];
  for (const group of BASIC_GROUPS) {
    const list = grouped.get(group);
    if (list) basic.push(...list);
  }
  if (basic.length > 0) {
    sections.push({ id: "basic", label: "Gojuon", items: basic });
  }

  const dakuten = grouped.get("dakuten");
  if (dakuten && dakuten.length > 0) {
    sections.push({ id: "dakuten", label: "Dakuten", items: dakuten });
  }
  const handakuten = grouped.get("handakuten");
  if (handakuten && handakuten.length > 0) {
    sections.push({ id: "handakuten", label: "Handakuten", items: handakuten });
  }
  const yoon = grouped.get("yoon");
  if (yoon && yoon.length > 0) {
    sections.push({ id: "yoon", label: "Yoon", items: yoon });
  }

  return sections;
}

export function KanaChart({
  defaultType = "hiragana",
  hiragana,
  katakana,
  learnedIds,
  onToggleLearned,
}: KanaChartProps) {
  const [type, setType] = useState<KanaChartType>(defaultType);
  const [internalLearned, setInternalLearned] = useState<Set<string>>(
    () => new Set(),
  );

  const items = type === "hiragana" ? hiragana : katakana;
  const sections = useMemo(() => buildSections(items), [items]);
  const controlledLearned = useMemo(() => new Set(learnedIds), [learnedIds]);
  const learned = learnedIds ? controlledLearned : internalLearned;

  const toggleLearned = (id: string) => {
    onToggleLearned?.(id);
    if (learnedIds) return;

    setInternalLearned((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section className="space-y-6" data-testid="kana-chart">
      <Card
        tone="aqua"
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <Badge tone="orange">Kana Chart</Badge>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-text sm:text-4xl">
            {type === "hiragana" ? "Hiragana" : "Katakana"}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-text-muted">
            Klik tile untuk menandai kana yang sudah kamu hafal. Progress ini
            sementara tersimpan di sesi browser saat ini.
          </p>
        </div>
        <div
          className="inline-flex rounded-full bg-card p-1 ring-1 ring-border"
          role="tablist"
          aria-label="Kana type"
        >
          <Button
            size="sm"
            variant={type === "hiragana" ? "primary" : "ghost"}
            onClick={() => setType("hiragana")}
            aria-pressed={type === "hiragana"}
            data-testid="kana-toggle-hiragana"
          >
            Hiragana
          </Button>
          <Button
            size="sm"
            variant={type === "katakana" ? "primary" : "ghost"}
            onClick={() => setType("katakana")}
            aria-pressed={type === "katakana"}
            data-testid="kana-toggle-katakana"
          >
            Katakana
          </Button>
        </div>
      </Card>

      {sections.map((section) => (
        <Card key={section.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-extrabold text-text">
              {section.label}
            </h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              {section.items.length} kana
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3 lg:grid-cols-10">
            {section.items.map((item) => (
              <KanaTile
                key={item.id}
                kana={item.kana}
                romaji={item.romaji}
                learned={learned.has(item.id)}
                onClick={() => toggleLearned(item.id)}
                aria-pressed={learned.has(item.id)}
              />
            ))}
          </div>
        </Card>
      ))}
    </section>
  );
}
