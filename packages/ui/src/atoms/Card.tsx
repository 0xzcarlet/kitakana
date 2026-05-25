import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../utils/classes";

type CardTone = "paper" | "aqua" | "sun";

const toneClasses: Record<CardTone, string> = {
  paper: "border-border bg-card text-card-foreground",
  aqua: "border-surface-strong/70 bg-surface text-text",
  sun: "border-primary/40 bg-[#ffe3a8] text-text",
};

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  tone?: CardTone;
};

export function Card({
  children,
  className,
  tone = "paper",
  ...props
}: CardProps) {
  return (
    <div
      className={cx(
        "min-w-0 rounded-[2rem] border p-5 shadow-[0_20px_50px_rgba(79,37,46,0.08)]",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
