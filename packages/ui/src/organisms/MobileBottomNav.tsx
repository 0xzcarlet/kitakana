import { mainNavigation } from "./navigation";
import { cx } from "../utils/classes";

export type MobileBottomNavProps = {
  activeHref?: string;
};

export function MobileBottomNav({ activeHref = "/" }: MobileBottomNavProps) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 lg:hidden"
      data-testid="mobile-bottom-nav"
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
