"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type {
  KanjiItem,
  KanjiLevelMeta,
} from "@kitakana/content";
import {
  generateQuiz,
  summarizeQuiz,
  type QuizAnswer,
  type QuizEngine,
  type QuizMode,
  type QuizQuestion,
} from "@kitakana/core";
import { recordLearningSession } from "@kitakana/storage";
import {
  Badge,
  Button,
  Card,
  QuizPanel,
  type QuizPanelOption,
  type QuizPanelSummary,
} from "@kitakana/ui";

type View = "overview" | "details" | "practice" | "quiz";
type KanjiPracticeTarget = "meaning" | "reading";

export type KanjiPageClientProps = {
  kanjiN5: readonly KanjiItem[];
  levels: readonly KanjiLevelMeta[];
};

const QUIZ_COUNT = 10;
const MIN_MULTIPLE_CHOICE_ANSWERS = 4;

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function getAnswer(item: KanjiItem, target: KanjiPracticeTarget): string {
  return target === "meaning" ? item.meanings[0] : item.quizReading;
}

function getMode(target: KanjiPracticeTarget): QuizMode {
  return target === "meaning" ? "kanji-to-meaning" : "kanji-to-reading";
}

function buildQuestions(
  items: readonly KanjiItem[],
  selectedIds: ReadonlySet<string>,
  target: KanjiPracticeTarget,
  engine: QuizEngine,
): QuizQuestion[] {
  const selectedItems = items.filter((item) => selectedIds.has(item.id));

  return generateQuiz(
    selectedItems.map((item) => ({
      answer: getAnswer(item, target),
      id: item.id,
      prompt: item.kanji,
    })),
    {
      count: QUIZ_COUNT,
      engine,
      mode: getMode(target),
      seed: Date.now(),
    },
  );
}

function KanjiDetailPanel({
  className,
  item,
  panelId,
  testId,
}: {
  className?: string;
  item: KanjiItem;
  panelId?: string;
  testId: string;
}) {
  return (
    <Card
      aria-label={`Detail kanji ${item.kanji}`}
      className={cx("space-y-5", className)}
      data-testid={testId}
      id={panelId}
      role="region"
      tone="sun"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge tone="orange">N5</Badge>
          <p className="mt-4 font-display text-7xl font-extrabold leading-none text-text">
            {item.kanji}
          </p>
        </div>
        <p className="rounded-full bg-card px-3 py-1 text-xs font-bold uppercase tracking-wider text-text-muted">
          {item.strokes} stroke
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Arti
          </p>
          <p className="mt-1 text-sm font-semibold text-text">
            {item.meanings.join(", ")}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Bacaan utama
          </p>
          <p className="mt-1 text-sm font-semibold text-text">
            {item.quizReading}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
            {"On'yomi"}
          </p>
          <p className="mt-1 text-sm font-semibold text-text">
            {item.onyomi.length > 0 ? item.onyomi.join(", ") : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
            {"Kun'yomi"}
          </p>
          <p className="mt-1 text-sm font-semibold text-text">
            {item.kunyomi.length > 0 ? item.kunyomi.join(", ") : "-"}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Contoh
        </p>
        <div className="mt-3 space-y-2">
          {item.examples.map((example) => (
            <div
              key={`${item.id}-${example.word}`}
              className="rounded-2xl bg-card/70 p-3"
            >
              <p className="font-semibold text-text">
                {example.word}{" "}
                <span className="text-text-muted">({example.reading})</span>
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {example.meaning}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function KanjiPageClient({ kanjiN5, levels }: KanjiPageClientProps) {
  const [view, setView] = useState<View>("overview");
  const [activeKanjiId, setActiveKanjiId] = useState<string>(
    () => kanjiN5[0]?.id ?? "",
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [target, setTarget] = useState<KanjiPracticeTarget>("meaning");
  const [engine, setEngine] = useState<QuizEngine>("multiple-choice");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [typingState, setTypingState] = useState<"idle" | "correct" | "wrong">(
    "idle",
  );
  const hasRecordedResult = useRef(false);

  const activeKanji =
    kanjiN5.find((item) => item.id === activeKanjiId) ?? kanjiN5[0] ?? null;
  const selectedItems = useMemo(
    () => kanjiN5.filter((item) => selectedIds.has(item.id)),
    [kanjiN5, selectedIds],
  );
  const uniqueAnswers = useMemo(
    () => new Set(selectedItems.map((item) => getAnswer(item, target))),
    [selectedItems, target],
  );
  const minAnswers =
    engine === "multiple-choice" ? MIN_MULTIPLE_CHOICE_ANSWERS : 1;
  const canStart = selectedIds.size > 0 && uniqueAnswers.size >= minAnswers;
  const allSelected =
    kanjiN5.length > 0 && kanjiN5.every((item) => selectedIds.has(item.id));

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
      console.error("Failed to record local kanji practice session.", error);
    });
  }, [engine, showResult, summary.correct, summary.total, total]);

  const resetQuizState = () => {
    setCurrentIndex(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
    setTypingState("idle");
    hasRecordedResult.current = false;
  };

  const handleToggleKanji = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(kanjiN5.map((item) => item.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleStartPractice = () => {
    setQuestions(buildQuestions(kanjiN5, selectedIds, target, engine));
    resetQuizState();
    setView("quiz");
  };

  const handleRestart = () => {
    setQuestions(buildQuestions(kanjiN5, selectedIds, target, engine));
    resetQuizState();
  };

  const handleSelectOption = (option: string) => {
    if (!currentQuestion || selected !== null || showResult) return;

    setSelected(option);
    setAnswers((current) => [
      ...current,
      { questionId: currentQuestion.id, answer: option },
    ]);
  };

  const handleSubmitTyping = (answer: string) => {
    if (!currentQuestion || typingState !== "idle") return;

    const normalized = answer.trim().toLowerCase();
    const isCorrect = normalized === currentQuestion.correctAnswer.toLowerCase();
    setTypingState(isCorrect ? "correct" : "wrong");
    setAnswers((current) => [
      ...current,
      { questionId: currentQuestion.id, answer: normalized },
    ]);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResult(true);
      return;
    }

    setSelected(null);
    setTypingState("idle");
    setCurrentIndex((index) => Math.min(index + 1, total - 1));
  };

  const handleBackToPractice = () => {
    resetQuizState();
    setQuestions([]);
    setView("practice");
  };

  const targetLabel = target === "meaning" ? "Arti" : "Bacaan";
  const promptLabel =
    target === "meaning"
      ? "Apa arti kanji ini?"
      : "Ketik atau pilih bacaan utama kanji ini";

  return (
    <section className="space-y-6" data-testid="kanji-page">
      {view !== "quiz" ? (
        <Card tone="aqua" className="relative overflow-hidden">
          <span className="absolute -right-8 -top-10 font-display text-[9rem] font-extrabold leading-none text-white/35">
            漢
          </span>
          <div className="relative max-w-2xl">
            <Badge tone="orange">Kanji</Badge>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-text sm:text-5xl">
              Belajar Kanji
            </h1>
            <p className="mt-3 text-sm leading-6 text-text-muted">
              Mulai dari JLPT N5: baca detail tiap karakter atau latihan dengan
              mode arti dan bacaan.
            </p>
          </div>
        </Card>
      ) : null}

      {view === "overview" ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {levels.map((level) => (
              <Card
                key={level.label}
                className={cx(
                  "flex min-h-52 flex-col justify-between",
                  !level.isAvailable && "opacity-75",
                )}
                data-testid={`kanji-level-${level.label.toLowerCase()}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-4xl font-extrabold text-text">
                      {level.label}
                    </p>
                    <Badge tone={level.isAvailable ? "orange" : "cream"}>
                      {level.isAvailable ? `${kanjiN5.length} kanji` : "Coming soon"}
                    </Badge>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-text-muted">
                    {level.isAvailable
                      ? "Kanji dasar untuk mulai membaca kata umum bahasa Jepang."
                      : "Level ini disiapkan setelah fondasi N5 selesai."}
                  </p>
                </div>

                {level.isAvailable ? (
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button
                      data-testid="kanji-n5-detail-btn"
                      onClick={() => setView("details")}
                      size="sm"
                      variant="secondary"
                    >
                      Lihat Detail
                    </Button>
                    <Button
                      data-testid="kanji-n5-practice-btn"
                      onClick={() => setView("practice")}
                      size="sm"
                    >
                      Latihan
                    </Button>
                  </div>
                ) : (
                  <p className="mt-6 text-xs font-bold uppercase tracking-wider text-text-muted">
                    Coming soon
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      {view === "details" ? (
        <section className="space-y-4" data-testid="kanji-detail-view">
          <button
            type="button"
            onClick={() => setView("overview")}
            className="text-sm font-semibold text-text-muted transition hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Kembali ke level
          </button>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {kanjiN5.map((item) => {
                const isActive = item.id === activeKanji?.id;
                const inlinePanelId = `kanji-detail-inline-${item.id}`;

                return (
                  <Fragment key={item.id}>
                    <button
                      type="button"
                      aria-controls={isActive ? inlinePanelId : undefined}
                      aria-expanded={isActive}
                      aria-pressed={isActive}
                      onClick={() => setActiveKanjiId(item.id)}
                      data-testid="kanji-detail-item"
                      className={cx(
                        "flex min-h-24 items-center gap-4 rounded-2xl border bg-card p-4 text-left transition",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                        isActive
                          ? "border-primary/70 shadow-[0_0_0_3px_rgba(244,174,82,0.2)]"
                          : "border-border hover:border-primary/40 hover:bg-bg-soft",
                      )}
                    >
                      <span className="font-display text-4xl font-extrabold text-text">
                        {item.kanji}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-text">
                          {item.meanings.join(", ")}
                        </span>
                        <span className="mt-1 block text-xs font-semibold text-text-muted">
                          {item.strokes} stroke
                        </span>
                      </span>
                    </button>

                    {isActive ? (
                      <KanjiDetailPanel
                        className="sm:col-span-2 lg:hidden"
                        item={item}
                        panelId={inlinePanelId}
                        testId="kanji-detail-inline-panel"
                      />
                    ) : null}
                  </Fragment>
                );
              })}
            </div>

            {activeKanji ? (
              <KanjiDetailPanel
                className="hidden lg:sticky lg:top-8 lg:block lg:self-start"
                item={activeKanji}
                testId="kanji-detail-panel"
              />
            ) : null}
          </div>
        </section>
      ) : null}

      {view === "practice" ? (
        <section className="space-y-5" data-testid="kanji-practice-setup">
          <button
            type="button"
            onClick={() => setView("overview")}
            className="text-sm font-semibold text-text-muted transition hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Kembali ke level
          </button>

          <Card tone="paper" className="space-y-5">
            <div>
              <Badge tone="orange">N5 Practice</Badge>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-text">
                Pilih Kanji untuk Latihan
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                Pilih kanji N5, tentukan target latihan, lalu mulai quiz.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Target latihan
                </p>
                <div className="flex flex-wrap gap-2" role="radiogroup">
                  {[
                    { value: "meaning" as const, label: "Arti" },
                    { value: "reading" as const, label: "Bacaan" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={target === option.value}
                      data-testid={`kanji-target-${option.value}`}
                      onClick={() => setTarget(option.value)}
                      className={cx(
                        "rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                        target === option.value
                          ? "bg-primary text-text"
                          : "border border-border bg-card text-text-muted hover:bg-bg-soft",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Mode latihan
                </p>
                <div className="flex flex-wrap gap-2" role="radiogroup">
                  {[
                    { value: "multiple-choice" as const, label: "Pilihan" },
                    { value: "typing" as const, label: "Ketikan" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={engine === option.value}
                      data-testid={`kanji-engine-${option.value}`}
                      onClick={() => setEngine(option.value)}
                      className={cx(
                        "rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                        engine === option.value
                          ? "bg-primary text-text"
                          : "border border-border bg-card text-text-muted hover:bg-bg-soft",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-text-muted">
              {selectedIds.size} dari {kanjiN5.length} kanji dipilih
            </p>
            <button
              type="button"
              onClick={allSelected ? handleDeselectAll : handleSelectAll}
              className="text-xs font-bold uppercase tracking-wider text-primary transition hover:opacity-75"
              data-testid="kanji-select-all"
            >
              {allSelected ? "Batalkan semua" : "Pilih semua"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-8 xl:grid-cols-10">
            {kanjiN5.map((item) => {
              const isSelected = selectedIds.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleToggleKanji(item.id)}
                  data-testid="kanji-select-card"
                  className={cx(
                    "flex aspect-square flex-col items-center justify-center rounded-2xl border text-center transition",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    isSelected
                      ? "border-primary/70 bg-primary/15 shadow-[0_0_0_2px_rgba(244,174,82,0.18)]"
                      : "border-border bg-card hover:border-primary/40 hover:bg-bg-soft",
                  )}
                >
                  <span className="font-display text-3xl font-extrabold text-text">
                    {item.kanji}
                  </span>
                  <span className="mt-1 max-w-full truncate px-2 text-[0.68rem] font-bold text-text-muted">
                    {getAnswer(item, target)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="sticky bottom-4 z-10">
            <Card
              className={cx(
                "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                selectedIds.size > 0 &&
                  "border-primary/30 shadow-[0_8px_32px_rgba(244,174,82,0.18)]",
              )}
            >
              <div>
                <p className="font-display text-sm font-bold text-text">
                  {selectedIds.size === 0
                    ? "Belum ada kanji dipilih"
                    : `${selectedIds.size} kanji dipilih untuk mode ${targetLabel}`}
                </p>
                {!canStart && selectedIds.size > 0 ? (
                  <p className="mt-1 text-xs text-amber-600">
                    Butuh minimal {minAnswers} jawaban unik untuk mode ini.
                  </p>
                ) : null}
                {canStart ? (
                  <p className="mt-1 text-xs text-text-muted">
                    {uniqueAnswers.size} jawaban unik, siap latihan.
                  </p>
                ) : null}
              </div>

              <Button
                disabled={!canStart}
                onClick={handleStartPractice}
                data-testid="start-kanji-practice-btn"
              >
                Mulai Latihan →
              </Button>
            </Card>
          </div>
        </section>
      ) : null}

      {view === "quiz" ? (
        <section className="space-y-4">
          <button
            type="button"
            onClick={handleBackToPractice}
            data-testid="back-to-kanji-practice"
            className="text-sm font-semibold text-text-muted transition hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Kembali ke pilihan kanji
          </button>

          <QuizPanel
            badgeLabel={
              target === "meaning" ? "Kanji → Arti" : "Kanji → Bacaan"
            }
            correctAnswer={currentQuestion?.correctAnswer}
            currentIndex={currentIndex}
            emptyDescription="Latihan kanji belum bisa dimulai karena daftar pilihan masih kosong."
            engine={engine}
            isFinished={showResult && total > 0}
            nextLabel={isLastQuestion ? "Lihat hasil" : "Lanjut"}
            onNext={handleNext}
            onRestart={handleRestart}
            onSelectOption={handleSelectOption}
            onSubmitTyping={handleSubmitTyping}
            progressValue={
              ((currentIndex +
                (engine === "typing"
                  ? typingState !== "idle"
                    ? 1
                    : 0
                  : selected
                    ? 1
                    : 0)) /
                Math.max(total, 1)) *
              100
            }
            promptLabel={promptLabel}
            promptTestId="kanji-prompt"
            question={panelQuestion}
            restartLabel="Ulangi latihan"
            showNext={
              engine === "typing" ? typingState !== "idle" : selected !== null
            }
            summary={summary}
            total={total}
            typingState={typingState}
          />
        </section>
      ) : null}
    </section>
  );
}
