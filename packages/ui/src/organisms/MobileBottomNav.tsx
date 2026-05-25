import { mainNavigation } from "./navigation";
import { cx } from "../utils/classes";

export type MobileBottomNavProps = {
  activeHref?: string;
};

export function MobileBottomNav({ activeHref = "/" }: MobileBottomNavProps) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-3 bottom-3 z-40 rounded-[2rem] border border-border bg-card/95 px-2 py-2 shadow-[0_20px_50px_rgba(79,37,46,0.18)] backdrop-blur lg:hidden"
    >
      <div className="grid grid-cols-5 gap-1">
        {mainNavigation.map((item) => {
          const isActive = item.href === activeHref;

          return (
            <a
              className={cx(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-3xl text-[0.68rem] font-bold transition",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                isActive
                  ? "bg-primary text-text"
                  : "text-text-muted hover:bg-bg-soft hover:text-text",
              )}
              href={item.href}
              key={item.href}
            >
              <span className="font-display text-lg font-extrabold leading-none">
                {item.kana}
              </span>
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
