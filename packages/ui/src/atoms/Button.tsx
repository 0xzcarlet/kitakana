import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../utils/classes";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-text shadow-[0_12px_28px_rgba(244,174,82,0.34)] hover:bg-primary-hover",
  secondary:
    "bg-card text-text ring-1 ring-border hover:bg-bg-soft hover:ring-primary/50",
  ghost: "bg-transparent text-text-muted hover:bg-card/70 hover:text-text",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 py-2 text-sm",
  md: "min-h-12 px-5 py-3 text-sm",
  lg: "min-h-14 px-6 py-4 text-base",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  children,
  className,
  icon,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-full font-display font-bold tracking-[0.01em] transition duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      type={type}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
