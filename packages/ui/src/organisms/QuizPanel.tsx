"use client";

import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { ProgressBar } from "../atoms/ProgressBar";
import {
  QuizOption,
  type QuizOptionState,
} from "../molecules/QuizOption";

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
};

export function QuizPanel({
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
}: QuizPanelProps) {
  if (total === 0 || !question) {
    return (
      <Card className="space-y-3">
        <p className="font-display text-2xl font-extrabold text-text">
          Belum ada soal
        </p>
        <p className="text-sm leading-6 text-text-muted">
          Quiz tidak dapat dimulai karena dataset kana kosong.
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
            Ulangi quiz
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <section className="space-y-5" data-testid="quiz-panel">
      <Card className="space-y-3" tone="paper">
        <div className="flex items-center justify-between">
          <Badge tone="orange">Hiragana → Romaji</Badge>
          <span
            className="text-xs font-bold uppercase tracking-wider text-text-muted"
            data-testid="quiz-progress"
          >
            {currentIndex + 1}/{total}
          </span>
        </div>
        <ProgressBar value={progressValue} />
      </Card>

      <Card className="flex flex-col items-center gap-6 py-10" tone="aqua">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Apa bacaan kana ini?
        </p>
        <p
          className="font-display text-7xl font-extrabold leading-none text-text sm:text-8xl"
          data-testid="kana-prompt"
          data-source-id={question.sourceId}
        >
          {question.prompt}
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options.map((option) => (
          <QuizOption
            key={`${question.sourceId}-${option.label}`}
            label={option.label}
            state={option.state}
            onClick={() => onSelectOption(option.label)}
          />
        ))}
      </div>

      {showNext && (
        <div className="flex justify-end">
          <Button data-testid="quiz-next" onClick={onNext}>
            {nextLabel}
          </Button>
        </div>
      )}
    </section>
  );
}
