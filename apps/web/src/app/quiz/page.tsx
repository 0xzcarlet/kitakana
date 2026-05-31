import type { Metadata } from "next";
import { hiragana } from "@kitakana/content";
import { KanaQuizClient } from "./KanaQuizClient";

export const metadata: Metadata = {
  alternates: {
    canonical: "/quiz",
  },
  description:
    "Latihan kuis kana online untuk menguji hafalan hiragana dari browser tanpa login.",
  title: "Kuis Kana Online",
};

export default function QuizPage() {
  return <KanaQuizClient items={hiragana} />;
}
