import { hiragana, katakana } from "@kitakana/content";
import { KanaChart } from "@kitakana/ui";

export default function KanaPage() {
  return <KanaChart hiragana={hiragana} katakana={katakana} />;
}
