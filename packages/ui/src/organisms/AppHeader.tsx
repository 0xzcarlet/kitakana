export function AppHeader() {
  return (
    <header
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      data-testid="app-header"
    >
      <div>
        <p className="font-display text-4xl font-extrabold leading-tight text-text sm:text-5xl">
          Kitakana
        </p>
        <p className="mt-2 max-w-2xl text-base leading-7 text-text-muted">
          Belajar kana, kanji, dan kosakata dasar.
        </p>
      </div>
    </header>
  );
}
