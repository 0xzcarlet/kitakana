"use client";

import type { ButtonHTMLAttributes } from "react";
import { cx } from "../utils/classes";

export type KanaTileProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  kana: string;
  romaji: string;
  learned?: boolean;
  showRomaji?: boolean;
};

export function KanaTile({
  className,
  kana,
  learned,
  romaji,
  showRomaji = true,
  ...props
}: KanaTileProps) {
  return (
    <button
      data-testid="kana-tile"
      data-romaji={romaji}
      type="button"
      className={cx(
        "group flex aspect-square min-h-[5.5rem] flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-card text-card-foreground",
        "transition duration-150",
        "hover:border-primary/60 hover:bg-bg-soft",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        learned && "border-primary/70 bg-primary/15",
        className,
      )}
      {...props}
    >
      <span className="font-display text-3xl font-extrabold leading-none text-text sm:text-4xl">
        {kana}
      </span>
      {showRomaji && (
        <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-text-muted">
          {romaji}
        </span>
      )}
    </button>
  );
}
