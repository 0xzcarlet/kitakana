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
        "group relative flex w-full flex-col items-start gap-2 rounded-2xl border p-4 text-left",
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
        className={cx(
          "absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border-2 transition duration-200",
          isSelected
            ? "border-primary bg-primary text-white"
            : "border-border bg-transparent",
        )}
      >
        {isSelected && (
          <svg
            className="h-3 w-3"
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
      <div className="flex flex-wrap gap-1">
        {previewCharacters.slice(0, 5).map((char) => (
          <span
            key={char}
            className={cx(
              "font-display text-2xl font-extrabold leading-none",
              isSelected ? "text-text" : "text-text-muted",
            )}
          >
            {char}
          </span>
        ))}
        {previewCharacters.length > 5 && (
          <span className="font-display text-lg font-bold leading-none text-text-muted">
            …
          </span>
        )}
      </div>

      {/* Label */}
      <p
        className={cx(
          "text-xs font-semibold leading-tight",
          isSelected ? "text-text" : "text-text-muted",
        )}
      >
        {label}
      </p>

      {/* Character count badge */}
      <span
        className={cx(
          "inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider",
          isSelected
            ? "bg-primary/20 text-primary"
            : "bg-bg-soft text-text-muted",
        )}
      >
        {characterCount} kana
      </span>
    </button>
  );
}
