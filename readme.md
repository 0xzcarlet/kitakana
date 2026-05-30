# Kitakana

Kitakana adalah PWA open-source untuk belajar bahasa Jepang. Fokus saat ini ada di kana chart, quiz kana, latihan kanji N5, preferensi belajar, dan progress lokal tanpa login.

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4
- pnpm workspace monorepo
- Vitest untuk unit test
- Playwright untuk e2e test
- Dexie/IndexedDB untuk storage lokal

## Struktur

```text
.
├── apps/web              # Aplikasi Next.js
├── packages/content      # Data kana/kanji, schema, loader
├── packages/core         # Quiz engine dan scoring
├── packages/storage      # Local-first persistence
├── packages/ui           # Shared UI components
└── e2e                   # Playwright tests
```

## Development

Install dependency:

```bash
corepack pnpm install
```

Jalankan web app:

```bash
pnpm dev
```

Command utama:

```bash
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```

## Catatan

Data belajar awal disimpan sebagai JSON di `packages/content`. Progress dan preferensi user disimpan lokal di browser melalui `packages/storage`, jadi MVP ini belum membutuhkan backend, login, atau cloud sync.

Detail arah produk ada di [PRD.md](./PRD.md).
