"use client";

import { useState } from "react";
import type {
  LearningKanaTypePreference,
  LearningPreferences,
  LearningPracticeEngine,
  LearningQuestionCount,
} from "@kitakana/storage";
import { Badge, Button, Card } from "@kitakana/ui";
import { useLearningPreferences } from "@/hooks/useLearningPreferences";

const ENGINE_OPTIONS: {
  label: string;
  value: LearningPracticeEngine;
}[] = [
  { label: "Pilihan ganda", value: "multiple-choice" },
  { label: "Ketik jawaban", value: "typing" },
];

const KANA_TYPE_OPTIONS: {
  label: string;
  value: LearningKanaTypePreference;
}[] = [
  { label: "Hiragana", value: "hiragana" },
  { label: "Katakana", value: "katakana" },
  { label: "Keduanya", value: "both" },
];

const QUESTION_COUNT_OPTIONS: LearningQuestionCount[] = [5, 10, 20];

type SegmentedOption<TValue extends string | number> = {
  label: string;
  value: TValue;
};

type SegmentedControlProps<TValue extends string | number> = {
  ariaLabel: string;
  options: readonly SegmentedOption<TValue>[];
  testId: string;
  value: TValue;
  onChange: (value: TValue) => void;
};

function SegmentedControl<TValue extends string | number>({
  ariaLabel,
  options,
  onChange,
  testId,
  value,
}: SegmentedControlProps<TValue>) {
  return (
    <div
      className="inline-flex flex-wrap gap-2 rounded-[1.25rem] bg-bg-soft p-1 ring-1 ring-border"
      role="radiogroup"
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            data-testid={`${testId}-${option.value}`}
            onClick={() => onChange(option.value)}
            className={`min-h-11 rounded-2xl px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
              isSelected
                ? "bg-primary text-text shadow-[0_8px_20px_rgba(244,174,82,0.25)]"
                : "text-text-muted hover:bg-card hover:text-text"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function SettingsClient() {
  const { preferences, resetPreferences, updatePreferences } =
    useLearningPreferences();
  const [hasSaved, setHasSaved] = useState(false);

  const handleSave = (nextPreferences: LearningPreferences) => {
    updatePreferences(nextPreferences);
    setHasSaved(true);
  };

  const handleReset = () => {
    resetPreferences();
    setHasSaved(false);
  };

  return (
    <section className="space-y-6" data-testid="settings-page">
      <Card tone="aqua" className="space-y-3">
        <Badge tone="orange">Pengaturan</Badge>
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-extrabold text-text sm:text-4xl">
            Preferensi Belajar
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-text-muted">
            Atur default latihan kana yang akan dipakai saat membuka chart dan
            practice. Pilih preferensi lalu simpan saat sudah cocok.
          </p>
        </div>
      </Card>

      <SettingsForm
        key={JSON.stringify(preferences)}
        hasSaved={hasSaved}
        initialPreferences={preferences}
        onReset={handleReset}
        onSave={handleSave}
      />
    </section>
  );
}

type SettingsFormProps = {
  hasSaved: boolean;
  initialPreferences: LearningPreferences;
  onReset: () => void;
  onSave: (preferences: LearningPreferences) => void;
};

function SettingsForm({
  hasSaved,
  initialPreferences,
  onReset,
  onSave,
}: SettingsFormProps) {
  const [draft, setDraft] = useState<LearningPreferences>(initialPreferences);
  const hasUnsavedChanges =
    JSON.stringify(draft) !== JSON.stringify(initialPreferences);

  const updateDraft = (patch: Partial<LearningPreferences>) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  return (
    <Card className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div>
            <h2 className="font-display text-lg font-extrabold text-text">
              Mode latihan
            </h2>
            <p className="mt-1 text-sm leading-6 text-text-muted">
              Default mode saat mulai latihan kana.
            </p>
          </div>
          <SegmentedControl
            ariaLabel="Mode latihan"
            options={ENGINE_OPTIONS}
            testId="setting-default-engine"
            value={draft.defaultEngine}
            onChange={(defaultEngine) => updateDraft({ defaultEngine })}
          />
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="font-display text-lg font-extrabold text-text">
              Jenis kana
            </h2>
            <p className="mt-1 text-sm leading-6 text-text-muted">
              Default kana yang aktif saat membuka practice.
            </p>
          </div>
          <SegmentedControl
            ariaLabel="Jenis kana"
            options={KANA_TYPE_OPTIONS}
            testId="setting-default-kana-type"
            value={draft.defaultKanaType}
            onChange={(defaultKanaType) => updateDraft({ defaultKanaType })}
          />
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="font-display text-lg font-extrabold text-text">
              Jumlah soal
            </h2>
            <p className="mt-1 text-sm leading-6 text-text-muted">
              Banyak soal dalam satu sesi latihan kana.
            </p>
          </div>
          <SegmentedControl
            ariaLabel="Jumlah soal"
            options={QUESTION_COUNT_OPTIONS.map((value) => ({
              label: `${value} soal`,
              value,
            }))}
            testId="setting-question-count"
            value={draft.questionCount}
            onChange={(questionCount) => updateDraft({ questionCount })}
          />
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="font-display text-lg font-extrabold text-text">
              Romaji
            </h2>
            <p className="mt-1 text-sm leading-6 text-text-muted">
              Tampilkan bantuan romaji di chart dan pilihan bagian.
            </p>
          </div>
          <label className="inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-border bg-bg-soft px-4 py-2 transition hover:bg-card">
            <input
              type="checkbox"
              data-testid="setting-show-romaji"
              checked={draft.showRomaji}
              onChange={(event) =>
                updateDraft({ showRomaji: event.currentTarget.checked })
              }
              className="h-5 w-5 accent-primary"
            />
            <span className="text-sm font-bold text-text">
              Tampilkan romaji
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="text-sm font-semibold text-text-muted"
          data-testid="settings-save-status"
        >
          {hasUnsavedChanges
            ? "Ada perubahan belum disimpan."
            : hasSaved
              ? "Preferensi tersimpan."
              : "Belum ada perubahan baru."}
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            data-testid="settings-reset"
            onClick={onReset}
          >
            Reset preferensi
          </Button>
          <Button
            data-testid="settings-save"
            disabled={!hasUnsavedChanges}
            onClick={() => onSave(draft)}
          >
            Simpan
          </Button>
        </div>
      </div>
    </Card>
  );
}
