"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { KanaItem, KanaType, KanaGroupMeta } from "@kitakana/content";
import {
  generateKanaQuiz,
  summarizeQuiz,
  type QuizAnswer,
  type QuizEngine,
  type QuizQuestion,
} from "@kitakana/core";
import { recordLearningSession } from "@kitakana/storage";
import {
  KanaGroupSelector,
  QuizPanel,
  type QuizPanelOption,
  type QuizPanelSummary,
} from "@kitakana/ui";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "setup" | "quiz";

export type KanaPracticeClientProps = {
  groups: readonly KanaGroupMeta[];
  hiragana: readonly KanaItem[];
  katakana: readonly KanaItem[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildFilteredPool(
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

// ─── Component ────────────────────────────────────────────────────────────────

export function KanaPracticeClient({
  groups,
  hiragana,
  katakana,
}: KanaPracticeClientProps) {
  // ── Setup phase state ───────────────────────────────────────────────────────
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(
    () => new Set(),
  );
  const [selectedTypes, setSelectedTypes] = useState<Set<KanaType>>(
    () => new Set<KanaType>(["hiragana"]),
  );
  const [engine, setEngine] = useState<QuizEngine>("multiple-choice");

  // ── Quiz phase state ────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>("setup");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [typingState, setTypingState] = useState<"idle" | "correct" | "wrong">("idle");
  const hasRecordedResult = useRef(false);

  // ── Setup handlers ──────────────────────────────────────────────────────────
  const allGroupIds = useMemo(() => groups.map((g) => g.group), [groups]);

  const handleToggleGroup = (group: string) => {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  };

  const handleToggleType = (type: KanaType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        // Keep at least one type selected
        if (next.size > 1) next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedGroups(new Set(allGroupIds));
  };

  const handleDeselectAll = () => {
    setSelectedGroups(new Set());
  };

  const handleStartPractice = () => {
    const pool = buildFilteredPool(
      hiragana,
      katakana,
      selectedTypes,
      selectedGroups,
    );
    const newQuestions = generateKanaQuiz(pool, {
      count: 10,
      mode: "kana-to-romaji",
      engine,
      seed: Date.now(),
    });
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
    setTypingState("idle");
    hasRecordedResult.current = false;
    setPhase("quiz");
  };

  // ── Quiz handlers ───────────────────────────────────────────────────────────
  const total = questions.length;
  const currentQuestion = questions[currentIndex] ?? null;
  const isLastQuestion = currentIndex === total - 1;

  const summary: QuizPanelSummary = useMemo(() => {
    const result = summarizeQuiz(questions, answers);
    return {
      accuracy: result.accuracy,
      correct: result.correct,
      total: result.total,
    };
  }, [answers, questions]);

  const getOptionState = (option: string): QuizPanelOption["state"] => {
    if (!currentQuestion || selected === null) return "idle";
    if (option === currentQuestion.correctAnswer) return "correct";
    if (option === selected) return "wrong";
    return "disabled";
  };

  const panelQuestion = currentQuestion
    ? {
        prompt: currentQuestion.prompt,
        sourceId: currentQuestion.sourceId,
        options: currentQuestion.options.map((option) => ({
          label: option,
          state: getOptionState(option),
        })),
      }
    : null;

  useEffect(() => {
    if (!showResult || total === 0 || hasRecordedResult.current) return;

    hasRecordedResult.current = true;
    recordLearningSession({
      correct: summary.correct,
      engine,
      source: "practice",
      total: summary.total,
    }).catch((error: unknown) => {
      console.error("Failed to record local practice session.", error);
    });
  }, [engine, showResult, summary.correct, summary.total, total]);

  const handleSelectOption = (option: string) => {
    if (!currentQuestion || selected !== null || showResult) return;
    setSelected(option);
    setAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, answer: option },
    ]);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResult(true);
      return;
    }
    setSelected(null);
    setTypingState("idle");
    setCurrentIndex((i) => Math.min(i + 1, total - 1));
  };

  const handleSubmitTyping = (answer: string) => {
    if (!currentQuestion || typingState !== "idle") return;
    const normalized = answer.trim().toLowerCase();
    const isCorrect = normalized === currentQuestion.correctAnswer.toLowerCase();
    setTypingState(isCorrect ? "correct" : "wrong");
    setAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, answer: normalized },
    ]);
  };

  const handleRestart = () => {
    // Restart quiz with same selection but fresh shuffle
    const pool = buildFilteredPool(
      hiragana,
      katakana,
      selectedTypes,
      selectedGroups,
    );
    const newQuestions = generateKanaQuiz(pool, {
      count: 10,
      mode: "kana-to-romaji",
      engine,
      seed: Date.now(),
    });
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
    setTypingState("idle");
    hasRecordedResult.current = false;
  };

  const handleBackToSetup = () => {
    setPhase("setup");
    setQuestions([]);
    setCurrentIndex(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
    setTypingState("idle");
    hasRecordedResult.current = false;
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  if (phase === "setup") {
    return (
      <KanaGroupSelector
        groups={groups}
        hiragana={hiragana}
        katakana={katakana}
        selectedGroups={selectedGroups}
        selectedTypes={selectedTypes}
        engine={engine}
        onToggleGroup={handleToggleGroup}
        onToggleType={handleToggleType}
        onChangeEngine={setEngine}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onStartPractice={handleStartPractice}
      />
    );
  }

  // Quiz phase
  return (
    <section className="space-y-4">
      {/* Back navigation */}
      <button
        type="button"
        onClick={handleBackToSetup}
        data-testid="back-to-setup"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted transition hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 16 16"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 12L6 8l4-4"
          />
        </svg>
        Kembali ke pilihan bagian
      </button>

      {/* Quiz panel */}
      <QuizPanel
        engine={engine}
        currentIndex={currentIndex}
        isFinished={showResult && total > 0}
        nextLabel={isLastQuestion ? "Lihat hasil" : "Lanjut"}
        onNext={handleNext}
        onRestart={handleRestart}
        onSelectOption={handleSelectOption}
        onSubmitTyping={handleSubmitTyping}
        typingState={typingState}
        correctAnswer={currentQuestion?.correctAnswer}
        progressValue={
          ((currentIndex + (engine === "typing" ? (typingState !== "idle" ? 1 : 0) : (selected ? 1 : 0))) / Math.max(total, 1)) * 100
        }
        question={panelQuestion}
        showNext={engine === "typing" ? typingState !== "idle" : selected !== null}
        summary={summary}
        total={total}
      />
    </section>
  );
}
