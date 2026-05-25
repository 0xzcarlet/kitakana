import { Card, ProgressBar } from "../atoms";
import { cx } from "../utils/classes";

export type StatCardProps = {
  className?: string;
  detail: string;
  label: string;
  value: string;
  progress?: number;
  symbol?: string;
  tone?: "paper" | "aqua" | "sun";
};

export function StatCard({
  className,
  detail,
  label,
  progress,
  symbol,
  tone = "paper",
  value,
}: StatCardProps) {
  return (
    <Card className={cx("space-y-4", className)} tone={tone}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-text-muted">{label}</p>
          <p className="mt-2 font-display text-3xl font-extrabold leading-none text-text">
            {value}
          </p>
        </div>
        {symbol ? (
          <span className="grid size-12 place-items-center rounded-2xl bg-bg-soft font-display text-2xl font-extrabold text-text">
            {symbol}
          </span>
        ) : null}
      </div>
      <p className="text-sm leading-6 text-text-muted">{detail}</p>
      {typeof progress === "number" ? <ProgressBar value={progress} /> : null}
    </Card>
  );
}
