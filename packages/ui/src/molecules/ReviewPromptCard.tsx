import { Badge, Button, Card } from "../atoms";
import { cx } from "../utils/classes";

export type ReviewPromptCardProps = {
  className?: string;
  dueCount: number;
};

export function ReviewPromptCard({
  className,
  dueCount,
}: ReviewPromptCardProps) {
  return (
    <Card
      className={cx(
        "relative overflow-hidden bg-[radial-gradient(circle_at_top_right,#fff3bf_0,#c1ebe9_42%,#a8dfdc_100%)]",
        className,
      )}
      tone="aqua"
    >
      <div className="absolute -right-8 -top-10 font-display text-[9rem] font-extrabold leading-none text-white/35">
        水
      </div>
      <div className="relative max-w-md">
        <Badge tone="orange">Review hari ini</Badge>
        <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-text sm:text-5xl">
          Selamat malam, siap latihan?
        </h2>
        <p className="mt-4 text-base leading-7 text-text-muted">
          Ada {dueCount} kartu menunggu. Selesaikan sedikit sekarang, progress
          kamu tetap tersimpan lokal.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button size="lg">Review {dueCount} kartu</Button>
          <Button size="lg" variant="secondary">
            Latihan Kana
          </Button>
        </div>
      </div>
    </Card>
  );
}
