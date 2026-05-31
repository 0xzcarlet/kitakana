import type { Metadata } from "next";
import { hiragana, katakana } from "@kitakana/content";
import { KanaPageClient } from "./KanaPageClient";

export const metadata: Metadata = {
  alternates: {
    canonical: "/kana",
  },
  description:
    "Pelajari chart hiragana dan katakana lengkap dengan romaji untuk pemula bahasa Jepang.",
  title: "Chart Hiragana dan Katakana",
};

export default function KanaPage() {
  return <KanaPageClient hiragana={hiragana} katakana={katakana} />;
}
