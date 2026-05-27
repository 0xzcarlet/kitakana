import { hiragana } from "@kitakana/content";
import { KanaQuizClient } from "./KanaQuizClient";

export default function QuizPage() {
  return <KanaQuizClient items={hiragana} />;
}
