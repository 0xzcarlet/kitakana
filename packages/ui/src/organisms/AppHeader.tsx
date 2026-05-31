export function AppHeader() {
  return (
    <header
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      data-testid="app-header"
    >
      <div className="flex items-start gap-4">
        <img
          alt=""
          aria-hidden="true"
          className="mt-1 size-14 shrink-0 rounded-2xl shadow-[0_14px_28px_rgba(79,37,46,0.16)] sm:size-16"
          src="/icons/kitakana.svg"
        />
        <div>
          <p className="font-display text-4xl font-extrabold leading-tight text-text sm:text-5xl">
            Kitakana
          </p>
          <p className="mt-2 max-w-2xl text-base leading-7 text-text-muted">
            Belajar kana, kanji, dan kosakata dasar.
          </p>
        </div>
      </div>
    </header>
  );
}
