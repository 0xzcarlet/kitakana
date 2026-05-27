"use client";

import type { ButtonHTMLAttributes } from "react";
import { cx } from "../utils/classes";

export type QuizOptionState = "idle" | "correct" | "wrong" | "disabled";

export type QuizOptionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  state?: QuizOptionState;
};

const stateClasses: Record<QuizOptionState, string> = {
  idle: "border-border bg-card text-text hover:border-primary/60 hover:bg-bg-soft",
  correct: "border-emerald-500/70 bg-emerald-100 text-emerald-900",
  wrong: "border-rose-500/70 bg-rose-100 text-rose-900",
  disabled: "border-border bg-card/60 text-text-muted",
};

export function QuizOption({
  className,
  label,
  state = "idle",
  ...props
}: QuizOptionProps) {
  return (
    <button
      data-testid="quiz-option"
      data-state={state}
      data-label={label}
      type="button"
      disabled={state === "disabled" || props.disabled}
      className={cx(
        "flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-base font-semibold transition duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        stateClasses[state],
        className,
      )}
      {...props}
    >
      {label}
    </button>
  );
}
