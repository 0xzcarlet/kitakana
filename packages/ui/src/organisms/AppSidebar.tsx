import { mainNavigation } from "./navigation";
import { cx } from "../utils/classes";

export type AppSidebarProps = {
  activeHref?: string;
  className?: string;
};

export function AppSidebar({ activeHref = "/", className }: AppSidebarProps) {
  return (
    <aside
      className={cx(
        "hidden min-h-screen w-72 shrink-0 border-r border-border/80 bg-bg-soft/70 px-5 py-6 backdrop-blur lg:flex lg:flex-col",
        className,
      )}
    >
      <a
        className="flex items-center gap-3 rounded-3xl p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        href="/"
      >
        <span className="grid size-12 place-items-center rounded-2xl bg-primary font-display text-2xl font-extrabold text-text shadow-[0_12px_24px_rgba(244,174,82,0.35)]">
          キ
        </span>
        <span>
          <span className="block font-display text-2xl font-extrabold leading-none text-text">
            Kitakana
          </span>
          <span className="mt-1 block text-xs font-semibold text-text-muted">
            Japanese learning PWA
          </span>
        </span>
      </a>

      <nav aria-label="Main navigation" className="mt-10 space-y-2">
        {mainNavigation.map((item) => {
          const isActive = item.href === activeHref;

          return (
            <a
              className={cx(
                "flex min-h-12 items-center gap-3 rounded-3xl px-4 text-sm font-bold transition",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
                isActive
                  ? "bg-text text-bg-soft shadow-[0_14px_30px_rgba(79,37,46,0.18)]"
                  : "text-text-muted hover:bg-card hover:text-text",
              )}
              href={item.href}
              key={item.href}
            >
              <span
                className={cx(
                  "grid size-9 place-items-center rounded-2xl font-display text-lg font-extrabold",
                  isActive ? "bg-primary text-text" : "bg-card text-text",
                )}
              >
                {item.kana}
              </span>
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[1.75rem] border border-border bg-card p-4">
        <p className="font-display text-lg font-extrabold text-text">今日</p>
        <p className="mt-2 text-sm leading-6 text-text-muted">
          Belajar pelan-pelan juga tetap progress.
        </p>
      </div>
    </aside>
  );
}
