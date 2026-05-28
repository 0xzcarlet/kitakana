import { Card } from "../atoms";

export type HomeDashboardStats = {
  accuracy: number | null;
  correctAnswers: number;
  sessionsCount: number;
  streakDays: number;
  totalAnswers: number;
};

export type HomeDashboardProps = {
  isLoading?: boolean;
  stats?: HomeDashboardStats;
};

const emptyStats: HomeDashboardStats = {
  accuracy: null,
  correctAnswers: 0,
  sessionsCount: 0,
  streakDays: 0,
  totalAnswers: 0,
};

export function HomeDashboard({
  isLoading = false,
  stats = emptyStats,
}: HomeDashboardProps) {
  const streakValue = isLoading ? "Memuat" : `${stats.streakDays} hari`;
  const accuracyValue = isLoading
    ? "Memuat"
    : stats.accuracy === null
      ? "Belum ada"
      : `${stats.accuracy}%`;

  return (
    <div className="min-w-0">
      <section
        aria-label="Ringkasan belajar lokal"
        className="grid min-w-0 gap-4 lg:grid-cols-[0.9fr_1.2fr_0.9fr]"
      >
        <Card
          className="flex min-h-60 flex-col justify-between"
          data-testid="home-streak-card"
          tone="aqua"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-muted">
                Streak days
              </p>
              <p className="mt-4 break-words font-display text-4xl font-extrabold leading-none text-text">
                {streakValue}
              </p>
            </div>
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-bg-soft font-display text-2xl font-extrabold text-text">
              日
            </span>
          </div>
          <p className="text-sm leading-6 text-text-muted">
            {stats.streakDays > 0
              ? `Kamu belajar ${stats.streakDays} hari berturut-turut.`
              : "Belum ada sesi hari ini. Mulai satu latihan kecil untuk menyalakan streak."}
          </p>
        </Card>

        <Card
          className="relative flex min-h-60 flex-col justify-between overflow-hidden"
          data-testid="home-kana-cta-card"
          tone="sun"
        >
          <div className="absolute -right-5 -top-8 font-display text-[8rem] font-extrabold leading-none text-white/35">
            あ
          </div>
          <div className="relative max-w-xl">
            <p className="text-sm font-semibold text-text-muted">
              Belajar Kana
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-text sm:text-5xl">
              Lanjutkan latihan hiragana dan katakana.
            </h2>
            <p className="mt-4 text-sm leading-6 text-text-muted">
              Pilih bagian kecil, jawab beberapa soal, lalu progress tersimpan
              lokal di perangkat ini.
            </p>
          </div>
          <div className="relative mt-7 flex">
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-text px-5 py-3 font-display text-sm font-bold text-bg-soft transition hover:bg-text/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              href="/kana/practice"
            >
              Mulai latihan
            </a>
          </div>
        </Card>

        <Card
          className="flex min-h-60 flex-col justify-between"
          data-testid="home-accuracy-card"
          tone="paper"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-muted">Akurasi</p>
              <p className="mt-4 break-words font-display text-4xl font-extrabold leading-none text-text">
                {accuracyValue}
              </p>
            </div>
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-bg-soft font-display text-2xl font-extrabold text-text">
              正
            </span>
          </div>
          <div>
            <p className="text-sm leading-6 text-text-muted">
              {stats.totalAnswers > 0
                ? `${stats.correctAnswers}/${stats.totalAnswers} jawaban benar.`
                : "Selesaikan kuis untuk melihat akurasi lokal."}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
              {stats.sessionsCount} sesi tersimpan
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
