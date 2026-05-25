import { Badge } from "../atoms";

export type RecentActivityItemProps = {
  detail: string;
  kana: string;
  time: string;
  title: string;
};

export function RecentActivityItem({
  detail,
  kana,
  time,
  title,
}: RecentActivityItemProps) {
  return (
    <li className="flex min-w-0 items-center gap-3 rounded-3xl bg-bg-soft/70 p-3 sm:gap-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-card font-display text-2xl font-extrabold text-text shadow-sm">
        {kana}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-base font-bold text-text">
          {title}
        </p>
        <p className="truncate text-sm text-text-muted">{detail}</p>
      </div>
      <Badge className="shrink-0 px-2.5 sm:px-3" tone="cream">
        {time}
      </Badge>
    </li>
  );
}
