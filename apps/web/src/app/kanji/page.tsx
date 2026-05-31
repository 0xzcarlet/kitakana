import type { Metadata } from "next";
import { KANJI_LEVEL_META, kanjiN5 } from "@kitakana/content";
import { KanjiPageClient } from "./KanjiPageClient";

export const metadata: Metadata = {
  alternates: {
    canonical: "/kanji",
  },
  description:
    "Belajar detail kanji JLPT N5, arti, bacaan, contoh kata, dan latihan interaktif.",
  title: "Kanji N5",
};

export default function KanjiPage() {
  return <KanjiPageClient kanjiN5={kanjiN5} levels={KANJI_LEVEL_META} />;
}
