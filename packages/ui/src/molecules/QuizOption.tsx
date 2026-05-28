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
  correct: "border-teal-500/70 bg-teal-100 text-teal-900",
  wrong: "border-red-600 bg-red-100 text-red-900 [border-width:2px] shadow-[0_0_0_3px_rgb(220_38_38_/_0.2)]",
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
        "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition duration-150 sm:min-h-14 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-base",
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
