import { Badge, Card } from "../atoms";
import { cx } from "../utils/classes";

export type ShortcutCardProps = {
  className?: string;
  description: string;
  href: string;
  kana: string;
  title: string;
  tone?: "paper" | "aqua" | "sun";
};

export function ShortcutCard({
  className,
  description,
  href,
  kana,
  title,
  tone = "paper",
}: ShortcutCardProps) {
  return (
    <a
      className={cx(
        "group block rounded-[2rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        className,
      )}
      href={href}
    >
      <Card
        className="flex min-h-44 flex-col justify-between transition duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_rgba(79,37,46,0.12)]"
        tone={tone}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-extrabold text-text">
              {title}
            </h3>
            <p className="mt-2 max-w-52 text-sm leading-6 text-text-muted">
              {description}
            </p>
          </div>
          <span className="font-display text-5xl font-extrabold leading-none text-text">
            {kana}
          </span>
        </div>
        <Badge className="mt-6 w-fit" tone={tone === "sun" ? "orange" : "aqua"}>
          Buka latihan
        </Badge>
      </Card>
    </a>
  );
}
