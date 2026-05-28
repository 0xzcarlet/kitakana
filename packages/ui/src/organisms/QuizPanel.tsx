"use client";

import { useEffect } from "react";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { ProgressBar } from "../atoms/ProgressBar";
import {
  QuizOption,
  type QuizOptionState,
} from "../molecules/QuizOption";
import {
  TypingInput,
  type TypingInputState,
} from "../molecules/TypingInput";

export type QuizPanelOption = {
  label: string;
  state?: QuizOptionState;
};

export type QuizPanelQuestion = {
  prompt: string;
  sourceId: string;
  options: QuizPanelOption[];
};

export type QuizPanelSummary = {
  accuracy: number;
  correct: number;
  total: number;
};

export type QuizPanelProps = {
  /** Quiz engine: "multiple-choice" (default) or "typing". */
  engine?: "multiple-choice" | "typing";
  currentIndex: number;
  isFinished: boolean;
  nextLabel: string;
  onNext: () => void;
  onRestart: () => void;
  onSelectOption: (option: string) => void;
  progressValue: number;
  question: QuizPanelQuestion | null;
  showNext: boolean;
  summary: QuizPanelSummary;
  total: number;
  // ── Typing-engine props ──
  /** Handler for typing engine submission. */
  onSubmitTyping?: (answer: string) => void;
  /** Current typing input state. */
  typingState?: TypingInputState;
  /** Correct answer shown on wrong typing attempt. */
  correctAnswer?: string;
};

export function QuizPanel({
  engine = "multiple-choice",
  currentIndex,
  isFinished,
  nextLabel,
  onNext,
  onRestart,
  onSelectOption,
  progressValue,
  question,
  showNext,
  summary,
  total,
  onSubmitTyping,
  typingState = "idle",
  correctAnswer = "",
}: QuizPanelProps) {
  useEffect(() => {
    if (!showNext || isFinished) return;

    const handleEnterNext = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.repeat || event.isComposing) return;

      const target = event.target;
      if (target instanceof HTMLTextAreaElement) return;
      if (
        engine === "typing" &&
        target instanceof HTMLInputElement &&
        !target.disabled
      ) {
        return;
      }

      event.preventDefault();
      onNext();
    };

    window.addEventListener("keydown", handleEnterNext, true);
    return () => window.removeEventListener("keydown", handleEnterNext, true);
  }, [engine, isFinished, onNext, showNext, typingState]);

  if (total === 0 || !question) {
    return (
      <Card className="space-y-3">
        <p className="font-display text-2xl font-extrabold text-text">
          Belum ada soal
        </p>
        <p className="text-sm leading-6 text-text-muted">
          Kuis belum bisa dimulai karena daftar kana masih kosong.
        </p>
      </Card>
    );
  }

  if (isFinished) {
    return (
      <Card
        className="space-y-4 text-center"
        data-testid="quiz-result"
        tone="aqua"
      >
        <Badge tone="orange">Selesai</Badge>
        <p
          className="font-display text-5xl font-extrabold text-text"
          data-testid="quiz-result-accuracy"
        >
          {Math.round(summary.accuracy * 100)}%
        </p>
        <p className="text-sm leading-6 text-text-muted">
          Skor {summary.correct} dari {summary.total} soal benar.
        </p>
        <div className="flex justify-center pt-2">
          <Button data-testid="quiz-restart" onClick={onRestart}>
            Ulangi kuis
          </Button>
        </div>
      </Card>
    );
  }

  // Determine wrong state for prompt card styling
  const hasWrong =
    engine === "typing"
      ? typingState === "wrong"
      : question.options.some((o) => o.state === "wrong");

  const badgeLabel =
    engine === "typing" ? "Ketik Romaji" : "Hiragana → Romaji";

  return (
    <section className="space-y-5" data-testid="quiz-panel">
      <Card className="space-y-3" tone="paper">
        <div className="flex items-center justify-between">
          <Badge tone="orange">{badgeLabel}</Badge>
          <span
            className="text-xs font-bold uppercase tracking-wider text-text-muted"
            data-testid="quiz-progress"
          >
            {currentIndex + 1}/{total}
          </span>
        </div>
        <ProgressBar value={progressValue} />
      </Card>

      <Card
        className="flex flex-col items-center gap-6 py-10 transition-all duration-200"
        tone={hasWrong ? undefined : "aqua"}
        style={
          hasWrong
            ? {
                background: "rgb(239 68 68 / 0.15)",
                borderColor: "rgb(220 38 38)",
                borderWidth: "2px",
                boxShadow: "0 0 0 4px rgb(220 38 38 / 0.2), 0 20px 50px rgb(220 38 38 / 0.15)",
              }
            : undefined
        }
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {engine === "typing"
            ? "Ketik bacaan kana ini"
            : "Apa bacaan kana ini?"}
        </p>
        <p
          className="font-display text-7xl font-extrabold leading-none text-text sm:text-8xl"
          data-testid="kana-prompt"
          data-source-id={question.sourceId}
        >
          {question.prompt}
        </p>
      </Card>

      {/* Answer area: typing input vs multiple-choice options */}
      {engine === "typing" ? (
        <TypingInput
          onSubmit={onSubmitTyping ?? (() => {})}
          correctAnswer={correctAnswer}
          state={typingState}
          disabled={typingState !== "idle"}
        />
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {question.options.map((option) => (
            <QuizOption
              key={`${question.sourceId}-${option.label}`}
              label={option.label}
              state={option.state}
              onClick={() => onSelectOption(option.label)}
            />
          ))}
        </div>
      )}

      {showNext && (
        <div className="flex flex-wrap items-center justify-end gap-3">
          <p className="text-xs font-medium text-text-muted">
            Tekan{" "}
            <kbd className="rounded-md border border-border bg-card px-1.5 py-0.5 text-[11px] font-bold text-text">
              Enter
            </kbd>{" "}
            untuk soal berikutnya
          </p>
          <Button data-testid="quiz-next" onClick={onNext}>
            {nextLabel}
          </Button>
        </div>
      )}
    </section>
  );
}
