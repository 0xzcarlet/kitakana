"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "../atoms/Badge";
import { Card } from "../atoms/Card";
import { KanaTile } from "../molecules/KanaTile";
import { SegmentedControl } from "../molecules/SegmentedControl";

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
  showRomaji?: boolean;
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

const KANA_TYPE_OPTIONS: {
  label: string;
  value: KanaChartType;
}[] = [
  { label: "Hiragana", value: "hiragana" },
  { label: "Katakana", value: "katakana" },
];

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
  showRomaji = true,
}: KanaChartProps) {
  const [type, setType] = useState<KanaChartType>(defaultType);
  const [internalLearned, setInternalLearned] = useState<Set<string>>(
    () => new Set(),
  );

  const items = type === "hiragana" ? hiragana : katakana;
  const sections = useMemo(() => buildSections(items), [items]);
  const controlledLearned = useMemo(() => new Set(learnedIds), [learnedIds]);
  const learned = learnedIds ? controlledLearned : internalLearned;

  useEffect(() => {
    setType(defaultType);
  }, [defaultType]);

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
        <div className="flex flex-col gap-3 sm:items-end">
          <SegmentedControl
            ariaLabel="Kana type"
            options={KANA_TYPE_OPTIONS}
            testId="kana-toggle"
            value={type}
            onChange={setType}
          />
          <Link
            href="/kana/practice"
            data-testid="start-practice-link"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-bold text-text shadow-[0_4px_14px_rgba(244,174,82,0.24)] transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Mulai Latihan →
          </Link>
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
                showRomaji={showRomaji}
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
