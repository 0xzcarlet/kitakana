import { Card, ProgressBar } from "../atoms";
import {
  RecentActivityItem,
  ReviewPromptCard,
  ShortcutCard,
  StatCard,
} from "../molecules";

const activities = [
  {
    detail: "8 kartu direview dengan akurasi stabil",
    kana: "水",
    time: "Hari ini",
    title: "Kosakata N5",
  },
  {
    detail: "Latihan membaca baris a, ka, sa",
    kana: "あ",
    time: "Kemarin",
    title: "Hiragana dasar",
  },
  {
    detail: "Mulai mengenal bentuk katakana",
    kana: "ア",
    time: "2 hari",
    title: "Katakana awal",
  },
];

export function HomeDashboard() {
  return (
    <div className="min-w-0 space-y-6">
      <ReviewPromptCard dueCount={12} />

      <section
        aria-label="Ringkasan progress hari ini"
        className="grid min-w-0 gap-4 md:grid-cols-3"
      >
        <StatCard
          detail="Ritme kecil yang konsisten lebih kuat dari sesi panjang."
          label="Kartu direview"
          progress={72}
          symbol="復"
          value="8"
        />
        <StatCard
          detail="Jawaban benar dari sesi terakhir."
          label="Akurasi"
          progress={85}
          symbol="正"
          tone="sun"
          value="85%"
        />
        <StatCard
          detail="Belajar berturut-turut tanpa putus."
          label="Streak"
          progress={60}
          symbol="日"
          tone="aqua"
          value="3 hari"
        />
      </section>

      <section className="grid min-w-0 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-5" tone="paper">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                className="font-display text-2xl font-extrabold text-text"
                id="today-progress"
              >
                Progress hari ini
              </h2>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                Ringkasan awal ini masih static, nanti akan tersambung ke
                progress lokal.
              </p>
            </div>
            <span className="hidden rounded-[1.5rem] bg-bg-soft px-5 py-3 font-display text-4xl font-extrabold text-text sm:block">
              学校
            </span>
          </div>

          <div className="grid min-w-0 gap-5 sm:grid-cols-2">
            <ProgressBar label="Kana progress" value={42} />
            <ProgressBar label="Kosakata N5" value={28} />
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <ShortcutCard
              description="Buka chart dan pelajari bentuk dasar dengan romaji."
              href="/kana"
              kana="あ"
              title="Hiragana"
              tone="aqua"
            />
            <ShortcutCard
              description="Latih pengenalan bentuk katakana secara ringan."
              href="/quiz"
              kana="ア"
              title="Katakana quiz"
              tone="sun"
            />
          </div>
        </Card>

        <Card className="space-y-4" tone="paper">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-text">
              Aktivitas terbaru
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              Jejak belajar sederhana supaya kamu tahu harus lanjut dari mana.
            </p>
          </div>
          <ul className="space-y-3">
            {activities.map((activity) => (
              <RecentActivityItem key={activity.title} {...activity} />
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
