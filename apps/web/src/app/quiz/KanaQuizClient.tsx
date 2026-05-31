"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { KanaItem } from "@kitakana/content";
import {
  generateKanaQuiz,
  summarizeQuiz,
  type QuizAnswer,
  type QuizQuestion,
} from "@kitakana/core";
import { recordLearningSession } from "@kitakana/storage";
import {
  QuizPanel,
  type QuizPanelOption,
  type QuizPanelSummary,
} from "@kitakana/ui";
import { useLearningPreferences } from "@/hooks/useLearningPreferences";

const INITIAL_SEED = 1;

function createKanaQuiz(
  items: readonly KanaItem[],
  count: number,
  seed: number,
): QuizQuestion[] {
  return generateKanaQuiz(items, {
    count,
    mode: "kana-to-romaji",
    seed,
  });
}

export type KanaQuizClientProps = {
  items: readonly KanaItem[];
};

type KanaQuizSessionProps = KanaQuizClientProps & {
  questionCount: number;
};

function KanaQuizSession({ items, questionCount }: KanaQuizSessionProps) {
  const [seed, setSeed] = useState(INITIAL_SEED);
  const questions = useMemo(
    () => createKanaQuiz(items, questionCount, seed),
    [items, questionCount, seed],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showResult, setShowResult] = useState(false);
  const hasRecordedResult = useRef(false);

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
      engine: "multiple-choice",
      source: "quiz",
      total: summary.total,
    }).catch((error: unknown) => {
      console.error("Failed to record local quiz session.", error);
    });
  }, [showResult, summary.correct, summary.total, total]);

  const handleSelectOption = (option: string) => {
    if (!currentQuestion || selected !== null || showResult) return;

    setSelected(option);
    setAnswers((current) => [
      ...current,
      {
        questionId: currentQuestion.id,
        answer: option,
      },
    ]);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResult(true);
      return;
    }

    setSelected(null);
    setCurrentIndex((index) => Math.min(index + 1, total - 1));
  };

  const handleRestart = () => {
    setSeed(Date.now());
    setCurrentIndex(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
    hasRecordedResult.current = false;
  };

  return (
    <QuizPanel
      currentIndex={currentIndex}
      isFinished={showResult && total > 0}
      nextLabel={isLastQuestion ? "Lihat hasil" : "Lanjut"}
      onNext={handleNext}
      onRestart={handleRestart}
      onSelectOption={handleSelectOption}
      progressValue={
        ((currentIndex + (selected ? 1 : 0)) / Math.max(total, 1)) * 100
      }
      question={panelQuestion}
      showNext={selected !== null}
      summary={summary}
      total={total}
    />
  );
}

export function KanaQuizClient({ items }: KanaQuizClientProps) {
  const { preferences } = useLearningPreferences();

  return (
    <KanaQuizSession
      key={preferences.questionCount}
      items={items}
      questionCount={preferences.questionCount}
    />
  );
}
