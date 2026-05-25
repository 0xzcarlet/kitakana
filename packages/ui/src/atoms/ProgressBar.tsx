import { cx } from "../utils/classes";

export type ProgressBarProps = {
  className?: string;
  label?: string;
  value: number;
};

export function ProgressBar({ className, label, value }: ProgressBarProps) {
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cx("space-y-2", className)}>
      {label ? (
        <div className="flex items-center justify-between gap-3 text-sm font-semibold text-text-muted">
          <span>{label}</span>
          <span>{normalizedValue}%</span>
        </div>
      ) : null}
      <div
        aria-label={label}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={normalizedValue}
        className="h-3 overflow-hidden rounded-full bg-[#eadfab]"
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500"
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  );
}
