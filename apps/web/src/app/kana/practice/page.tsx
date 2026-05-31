import type { Metadata } from "next";
import { hiragana, katakana, KANA_GROUP_META } from "@kitakana/content";
import { KanaPracticeClient } from "./KanaPracticeClient";

export const metadata: Metadata = {
  alternates: {
    canonical: "/kana/practice",
  },
  description:
    "Pilih bagian hiragana atau katakana yang ingin dilatih, lalu mulai kuis kana online interaktif.",
  title: "Latihan Kana Online",
};

export default function KanaPracticePage() {
  return (
    <KanaPracticeClient
      groups={KANA_GROUP_META}
      hiragana={hiragana}
      katakana={katakana}
    />
  );
}
