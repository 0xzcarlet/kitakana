import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../utils/classes";

type BadgeTone = "cream" | "aqua" | "orange";

const toneClasses: Record<BadgeTone, string> = {
  cream: "bg-bg-soft text-text-muted ring-border",
  aqua: "bg-surface text-text ring-surface-strong",
  orange: "bg-primary/20 text-text ring-primary/40",
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: BadgeTone;
};

export function Badge({
  children,
  className,
  tone = "cream",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex min-h-8 items-center rounded-full px-3 text-xs font-bold ring-1",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
