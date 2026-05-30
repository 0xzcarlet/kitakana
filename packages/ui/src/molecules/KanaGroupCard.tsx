"use client";

import { cx } from "../utils/classes";

export type KanaGroupCardProps = {
  /** Human-readable section label, e.g. "Ka Ki Ku Ke Ko" */
  label: string;
  /** First few kana characters to preview in the card */
  previewCharacters: string[];
  /** Total character count in this group for the selected type(s) */
  characterCount: number;
  /** Whether this group is currently selected */
  isSelected: boolean;
  /** Whether to show romaji helper labels */
  showRomaji?: boolean;
  /** Toggle handler */
  onToggle: () => void;
  /** Optional test id */
  "data-testid"?: string;
};

export function KanaGroupCard({
  characterCount,
  isSelected,
  label,
  onToggle,
  previewCharacters,
  showRomaji = true,
  "data-testid": testId,
}: KanaGroupCardProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      data-testid={testId ?? "kana-group-card"}
      onClick={onToggle}
      className={cx(
        "group relative flex min-h-36 w-full flex-col items-start gap-3 rounded-2xl border p-5 text-left sm:min-h-40 sm:p-6",
        "transition duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        isSelected
          ? "border-primary/60 bg-primary/10 shadow-[0_0_0_2px_rgba(244,174,82,0.25)]"
          : "border-border bg-card hover:border-primary/30 hover:bg-bg-soft",
      )}
    >
      {/* Selection indicator */}
      <span
        aria-hidden="true"
        data-testid={`${testId ?? "kana-group-card"}-indicator`}
        className={cx(
          "absolute bottom-4 right-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition duration-200 sm:bottom-5 sm:right-5",
          isSelected
            ? "border-primary bg-primary text-white"
            : "border-border bg-transparent",
        )}
      >
        {isSelected && (
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 12 12"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2 6l3 3 5-5"
            />
          </svg>
        )}
      </span>

      {/* Kana preview */}
      <div className="flex flex-wrap gap-1.5">
        {previewCharacters.slice(0, 5).map((char) => (
          <span
            key={char}
            className={cx(
              "font-display text-3xl font-extrabold leading-none sm:text-[2rem]",
              isSelected ? "text-text" : "text-text-muted",
            )}
          >
            {char}
          </span>
        ))}
        {previewCharacters.length > 5 && (
          <span className="font-display text-2xl font-bold leading-none text-text-muted">
            …
          </span>
        )}
      </div>

      <div className="mt-auto space-y-2 pr-10">
        {showRomaji && (
          <p
            className={cx(
              "text-sm font-semibold leading-tight",
              isSelected ? "text-text" : "text-text-muted",
            )}
          >
            {label}
          </p>
        )}

        {/* Character count badge */}
        <span
          className={cx(
            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
            isSelected
              ? "bg-primary/20 text-primary"
              : "bg-bg-soft text-text-muted",
          )}
        >
          {characterCount} kana
        </span>
      </div>
    </button>
  );
}
