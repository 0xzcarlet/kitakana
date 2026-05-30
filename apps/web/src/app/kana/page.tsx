import { hiragana, katakana } from "@kitakana/content";
import { KanaPageClient } from "./KanaPageClient";

export default function KanaPage() {
  return <KanaPageClient hiragana={hiragana} katakana={katakana} />;
}
