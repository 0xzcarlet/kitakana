"use client";

import { useMemo } from "react";
import type { KanaItem, KanaType, KanaGroupMeta } from "@kitakana/content";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { KanaGroupCard } from "../molecules/KanaGroupCard";
import { SegmentedControl } from "../molecules/SegmentedControl";

const MIN_UNIQUE_ROMAJI = 4;

const KANA_TYPE_OPTIONS: {
  label: string;
  value: KanaType;
}[] = [
  { label: "Hiragana", value: "hiragana" },
  { label: "Katakana", value: "katakana" },
];

const ENGINE_OPTIONS: {
  label: string;
  value: "multiple-choice" | "typing";
}[] = [
  { label: "Pilihan ganda", value: "multiple-choice" },
  { label: "Ketik jawaban", value: "typing" },
];

export type KanaGroupSelectorProps = {
  /** Ordered metadata for every kana group */
  groups: readonly KanaGroupMeta[];
  /** All hiragana items */
  hiragana: readonly KanaItem[];
  /** All katakana items */
  katakana: readonly KanaItem[];
  /** Groups currently selected (group strings) */
  selectedGroups: ReadonlySet<string>;
  /** Kana types currently selected */
  selectedTypes: ReadonlySet<KanaType>;
  /** Quiz engine */
  engine: "multiple-choice" | "typing";
  /** Whether to show romaji helper labels */
  showRomaji?: boolean;
  onToggleGroup: (group: string) => void;
  onToggleType: (type: KanaType) => void;
  onChangeEngine: (engine: "multiple-choice" | "typing") => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onStartPractice: () => void;
};

function buildPool(
  hiragana: readonly KanaItem[],
  katakana: readonly KanaItem[],
  selectedTypes: ReadonlySet<KanaType>,
  selectedGroups: ReadonlySet<string>,
): KanaItem[] {
  const sources: KanaItem[] = [];
  if (selectedTypes.has("hiragana")) sources.push(...hiragana);
  if (selectedTypes.has("katakana")) sources.push(...katakana);
  return sources.filter((item) => selectedGroups.has(item.group));
}

export function KanaGroupSelector({
  groups,
  hiragana,
  katakana,
  engine,
  onDeselectAll,
  onSelectAll,
  onStartPractice,
  onToggleGroup,
  onToggleType,
  onChangeEngine,
  selectedGroups,
  selectedTypes,
  showRomaji = true,
}: KanaGroupSelectorProps) {
  const pool = useMemo(
    () => buildPool(hiragana, katakana, selectedTypes, selectedGroups),
    [hiragana, katakana, selectedGroups, selectedTypes],
  );

  const uniqueRomaji = useMemo(
    () => new Set(pool.map((item) => item.romaji)),
    [pool],
  );

  const totalCharacters = pool.length;
  const minRomaji = engine === "typing" ? 1 : MIN_UNIQUE_ROMAJI;
  const canStart =
    selectedTypes.size > 0 &&
    selectedGroups.size > 0 &&
    uniqueRomaji.size >= minRomaji;

  const allGroups = useMemo(
    () => groups.map((g) => g.group),
    [groups],
  );
  const allSelected =
    allGroups.length > 0 && allGroups.every((g) => selectedGroups.has(g));

  /** Characters preview per group, respecting selected kana types */
  const previewMap = useMemo(() => {
    const map = new Map<string, string[]>();
    const sources: KanaItem[] = [];
    if (selectedTypes.has("hiragana")) sources.push(...hiragana);
    if (selectedTypes.has("katakana")) sources.push(...katakana);

    for (const meta of groups) {
      const chars = sources
        .filter((item) => item.group === meta.group)
        .sort((a, b) => a.order - b.order)
        .map((item) => item.kana);
      map.set(meta.group, chars);
    }
    return map;
  }, [groups, hiragana, katakana, selectedTypes]);

  /** Count per group */
  const countMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const meta of groups) {
      const preview = previewMap.get(meta.group) ?? [];
      map.set(meta.group, preview.length);
    }
    return map;
  }, [groups, previewMap]);

  return (
    <section className="space-y-6" data-testid="kana-group-selector">
      {/* Header */}
      <Card tone="aqua" className="space-y-4">
        <div>
          <Badge tone="orange">Kana Practice</Badge>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-text sm:text-4xl">
            Pilih Bagian untuk Latihan
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-text-muted">
            Pilih satu atau lebih bagian kana yang ingin kamu latih. Minimal
            satu bagian harus dipilih.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div>
              <h2 className="font-display text-lg font-extrabold text-text">
                Jenis kana
              </h2>
              <p className="mt-1 text-sm leading-6 text-text-muted">
                Pilih Hiragana, Katakana, atau keduanya untuk sesi ini.
              </p>
            </div>
            <SegmentedControl
              ariaLabel="Pilih jenis kana"
              mode="multiple"
              options={KANA_TYPE_OPTIONS}
              testId="type-toggle"
              values={selectedTypes}
              onToggle={onToggleType}
            />
          </div>

          <div className="space-y-3">
            <div>
              <h2 className="font-display text-lg font-extrabold text-text">
                Mode latihan
              </h2>
              <p className="mt-1 text-sm leading-6 text-text-muted">
                Gunakan pilihan ganda untuk pemanasan atau ketik untuk recall.
              </p>
            </div>
            <SegmentedControl
              ariaLabel="Pilih mode latihan"
              options={ENGINE_OPTIONS}
              testId="engine-toggle"
              value={engine}
              onChange={onChangeEngine}
            />
          </div>
        </div>
      </Card>

      {/* Select all / deselect all */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-text-muted">
          {groups.length} bagian tersedia
        </p>
        <button
          type="button"
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className="text-xs font-bold uppercase tracking-wider text-primary transition hover:opacity-75"
          data-testid="select-all-btn"
        >
          {allSelected ? "Batalkan semua" : "Pilih semua"}
        </button>
      </div>

      {/* Group grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {groups.map((meta) => {
          const preview = previewMap.get(meta.group) ?? [];
          const count = countMap.get(meta.group) ?? 0;
          return (
            <KanaGroupCard
              key={meta.group}
              label={meta.label}
              previewCharacters={preview}
              characterCount={count}
              isSelected={selectedGroups.has(meta.group)}
              showRomaji={showRomaji}
              onToggle={() => onToggleGroup(meta.group)}
              data-testid={`group-card-${meta.group}`}
            />
          );
        })}
      </div>

      {/* Sticky footer action bar */}
      <div className="lg:sticky lg:bottom-4 lg:z-10">
        <Card
          className={`flex flex-col gap-3 transition-all duration-300 sm:flex-row sm:items-center sm:justify-between ${
            selectedGroups.size > 0
              ? "border-primary/40 shadow-[0_8px_28px_rgba(79,37,46,0.10)]"
              : ""
          }`}
        >
          <div className="space-y-0.5">
            <p className="font-display text-sm font-bold text-text">
              {totalCharacters === 0
                ? "Belum ada kana dipilih"
                : `${totalCharacters} kana dipilih`}
            </p>
            {/* Warning */}
            {selectedGroups.size > 0 &&
              selectedTypes.size > 0 &&
              !canStart && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Butuh minimal {minRomaji} jawaban unik. Tambahkan lebih
                  banyak bagian.
                </p>
              )}
            {selectedTypes.size === 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Pilih minimal satu jenis kana (Hiragana atau Katakana).
              </p>
            )}
            {canStart && (
              <p className="text-xs text-text-muted">
                Semua kana dipilih akan masuk sesi latihan.
              </p>
            )}
          </div>

          <Button
            disabled={!canStart}
            onClick={onStartPractice}
            data-testid="start-practice-btn"
          >
            Mulai Latihan →
          </Button>
        </Card>
      </div>
    </section>
  );
}
