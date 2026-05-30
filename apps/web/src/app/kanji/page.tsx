import { KANJI_LEVEL_META, kanjiN5 } from "@kitakana/content";
import { KanjiPageClient } from "./KanjiPageClient";

export const metadata = {
  title: "Kanji N5 — Kitakana",
  description: "Belajar detail dan latihan kanji JLPT N5.",
};

export default function KanjiPage() {
  return <KanjiPageClient kanjiN5={kanjiN5} levels={KANJI_LEVEL_META} />;
}
