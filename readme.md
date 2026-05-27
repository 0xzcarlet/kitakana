# Kitakana

Kitakana adalah open-source Japanese learning PWA yang dibangun sebagai monorepo. Fokus MVP-nya adalah pengalaman belajar yang ringan, local-first, dan offline-first untuk kana, quiz, vocabulary, review harian, dan progress tracking lokal.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- pnpm workspace monorepo

## Workspace Structure

```text
.
├── apps/
│   └── web/
├── packages/
│   ├── config/
│   ├── content/
│   ├── core/
│   └── ui/
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

## Apps

### `apps/web`

Web app utama Kitakana. Saat ini workspace ini berisi aplikasi Next.js untuk produk web-first/PWA.

Untuk menjalankan development server dari root:

```bash
pnpm dev
```

Perintah root lain yang tersedia:

```bash
pnpm build
pnpm start
pnpm lint
pnpm test
pnpm test:e2e
pnpm typecheck
```

## Packages

Folder `packages/` berisi modul shared yang boundary-nya sudah jelas. Logic yang masih spesifik ke route tetap tinggal di `apps/web` sampai pattern reuse-nya matang.

### `packages/content`

Dipakai untuk semua hal yang berhubungan dengan materi belajar:

- schema TypeScript untuk kana, vocabulary, dan metadata belajar
- JSON kana data
- loader dan parsing JSON
- validator dataset
- helper untuk filtering type, group, level, tag, atau locale

### `packages/core`

Dipakai untuk shared domain logic:

- aturan quiz kana
- spaced repetition atau review scheduling
- progress calculation
- streak dan statistik belajar

Target package ini adalah logic murni yang tidak tergantung UI framework.

### `packages/ui`

Dipakai untuk komponen reusable ketika atomic design sudah mulai stabil:

- atoms, molecules, organisms lintas feature
- token UI atau primitive visual bersama
- komponen presentational yang tidak mengandung business logic berat

Jangan pindahkan komponen ke sini terlalu dini. Mulai ekstrak setelah pattern reuse benar-benar terlihat.

### `packages/config`

Folder ini disiapkan untuk shared tooling config ketika monorepo mulai bertambah:

- base `tsconfig`
- preset ESLint
- shared PostCSS atau Tailwind config
- script atau preset build yang dipakai lebih dari satu workspace

Saat ini folder ini sengaja masih tipis supaya setup tetap sederhana.

## Storage Note

Persistence untuk learned kana, quiz history, dan progress lokal akan masuk ke slice berikutnya menggunakan IndexedDB/Dexie sesuai PRD. Slice kana v0.2 ini fokus pada JSON content, quiz logic, dan integrasi web tanpa backend atau login.
