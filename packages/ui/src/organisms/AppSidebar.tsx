import { mainNavigation } from "./navigation";
import { cx } from "../utils/classes";

const trakteerSupportUrl = "https://trakteer.id/zcarlet/tip";

export type AppSidebarProps = {
  activeHref?: string;
  className?: string;
};

export function AppSidebar({ activeHref = "/", className }: AppSidebarProps) {
  return (
    <aside
      className={cx(
        "fixed inset-y-0 left-0 hidden h-dvh w-72 shrink-0 overflow-y-auto border-r border-border/80 bg-bg-soft/70 px-5 py-6 backdrop-blur lg:flex lg:flex-col",
        className,
      )}
      data-testid="app-sidebar"
    >
      <a
        className="flex items-center gap-3 rounded-3xl p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        href="/dashboard"
      >
        <img
          alt=""
          aria-hidden="true"
          className="size-12 shrink-0 rounded-2xl shadow-[0_12px_24px_rgba(79,37,46,0.16)]"
          src="/icons/kitakana.svg"
        />
        <span>
          <span className="block font-display text-2xl font-extrabold leading-none text-text">
            Kitakana
          </span>
          <span className="mt-1 block text-xs font-semibold text-text-muted">
            Belajar bahasa Jepang
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
        <a
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-3xl bg-primary px-4 py-2 font-display text-sm font-bold text-text transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          data-testid="sidebar-trakteer-link"
          href={trakteerSupportUrl}
          rel="noreferrer"
          target="_blank"
        >
          Support on Trakteer
        </a>
      </div>
    </aside>
  );
}
