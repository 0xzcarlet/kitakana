import { hiragana, katakana, KANA_GROUP_META } from "@kitakana/content";
import { KanaPracticeClient } from "./KanaPracticeClient";

export const metadata = {
  title: "Kana Practice — Kitakana",
  description:
    "Pilih bagian kana yang ingin kamu latih dan mulai quiz interaktif.",
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
