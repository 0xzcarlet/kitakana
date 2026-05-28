"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "../utils/classes";

export type TypingInputState = "idle" | "correct" | "wrong";

export type TypingInputProps = {
  onSubmit: (answer: string) => void;
  correctAnswer: string;
  state: TypingInputState;
  disabled?: boolean;
};

const stateStyles: Record<TypingInputState, { container: string; input: string }> = {
  idle: {
    container: "border-border bg-card",
    input: "text-text placeholder:text-text-muted",
  },
  correct: {
    container:
      "border-teal-500/70 bg-teal-100 shadow-[0_0_0_3px_rgb(20_184_166_/_0.2)]",
    input: "text-teal-900",
  },
  wrong: {
    container:
      "border-red-600 bg-red-100 [border-width:2px] shadow-[0_0_0_3px_rgb(220_38_38_/_0.2)]",
    input: "text-red-900",
  },
};

export function TypingInput({
  onSubmit,
  correctAnswer,
  state,
  disabled = false,
}: TypingInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus & clear when state resets to idle (new question)
  useEffect(() => {
    if (state === "idle") {
      setValue("");
      // Small delay to let React settle the DOM before focusing
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [state]);

  const handleSubmit = () => {
    if (disabled || state !== "idle" || value.trim() === "") return;
    onSubmit(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const styles = stateStyles[state];

  return (
    <div className="space-y-3">
      <div
        className={cx(
          "flex items-center gap-3 rounded-2xl border px-4 py-3 transition duration-200",
          "focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring",
          styles.container,
        )}
      >
        <input
          ref={inputRef}
          data-testid="typing-input"
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="Ketik romaji..."
          disabled={disabled || state !== "idle"}
          value={state === "idle" ? value : state === "correct" ? value : value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cx(
            "flex-1 bg-transparent text-lg font-semibold outline-none",
            styles.input,
          )}
        />
        {state === "idle" && (
          <button
            data-testid="typing-submit"
            type="button"
            disabled={disabled || value.trim() === ""}
            onClick={handleSubmit}
            className={cx(
              "rounded-xl px-5 py-2 text-sm font-bold transition duration-200",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              value.trim() === ""
                ? "bg-border/50 text-text-muted cursor-not-allowed"
                : "bg-primary text-white shadow-[0_4px_14px_rgba(244,174,82,0.4)] hover:opacity-90",
            )}
          >
            Cek
          </button>
        )}
      </div>

      {/* Feedback text */}
      {state === "correct" && (
        <p
          className="flex items-center gap-2 text-sm font-semibold text-teal-700"
          data-testid="typing-feedback-correct"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-xs text-white">
            ✓
          </span>
          Benar!
        </p>
      )}

      {state === "wrong" && (
        <div
          className="space-y-1"
          data-testid="typing-feedback-wrong"
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-red-700">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              ✗
            </span>
            Salah!
          </p>
          <p className="pl-7 text-sm text-text-muted">
            Jawaban yang benar:{" "}
            <span className="font-bold text-text">{correctAnswer}</span>
          </p>
        </div>
      )}
    </div>
  );
}
