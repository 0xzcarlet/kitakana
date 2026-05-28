import { Badge, Card } from "@kitakana/ui";

export type FeaturePageProps = {
  badge: string;
  description: string;
  kana: string;
  title: string;
};

export function FeaturePage({
  badge,
  description,
  kana,
  title,
}: FeaturePageProps) {
  return (
    <section className="grid min-w-0 gap-6 lg:grid-cols-[1fr_18rem]">
      <Card className="relative overflow-hidden" tone="aqua">
        <span className="absolute -right-8 -top-10 font-display text-[9rem] font-extrabold leading-none text-white/35">
          {kana}
        </span>
        <div className="relative max-w-2xl">
          <Badge tone="orange">{badge}</Badge>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-text sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-7 text-text-muted">
            {description}
          </p>
        </div>
      </Card>

      <Card className="space-y-3">
        <p className="font-display text-2xl font-extrabold text-text">
          Segera hadir
        </p>
        <p className="text-sm leading-6 text-text-muted">
          Bagian ini sedang disiapkan agar latihanmu makin lengkap.
        </p>
      </Card>
    </section>
  );
}
