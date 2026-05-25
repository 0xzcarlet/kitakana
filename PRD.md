# PRD — Nihonote

**Product Name:** Nihonote  
**Product Type:** Open-source Japanese Learning PWA  
**Platform:** Web-first, installable as PWA  
**Primary Stack:** Next.js, TypeScript, Tailwind CSS, JSON data  
**Architecture:** Monorepo + Atomic Design + Local-first storage  
**Initial Release Target:** MVP v0.1 - v1.0  

---

## 1. Product Overview

Nihonote adalah aplikasi belajar bahasa Jepang berbasis web yang dirancang sebagai **PWA, offline-first, dan open source**. Fokus utama versi awal adalah membantu user belajar dari dasar melalui **kana chart, kana quiz, vocabulary flashcards, review harian, dan progress tracking lokal**.

Aplikasi ini tidak mewajibkan login pada versi awal agar user bisa langsung belajar tanpa hambatan. Semua data awal seperti hiragana, katakana, vocabulary, dan metadata pembelajaran disimpan dalam format **JSON** agar mudah dikelola, dikembangkan, dan dikontribusikan oleh komunitas.

Nihonote mendukung tampilan materi bahasa Jepang dengan terjemahan sesuai preferensi user, terutama:

- Japanese text
- Kana reading
- Romaji
- Indonesian translation
- English translation

Contoh data:

```json
{
  "id": "n5-mizu",
  "word": "水",
  "kana": "みず",
  "romaji": "mizu",
  "meaning": {
    "id": "air",
    "en": "water"
  },
  "level": "N5",
  "tags": ["noun", "daily"]
}
```

---

## 2. Background

Banyak aplikasi belajar bahasa Jepang yang sudah tersedia, tetapi beberapa memiliki hambatan seperti wajib login, terlalu berat, terlalu gamified, tidak fleksibel untuk self-learning, atau tidak mudah dimodifikasi oleh developer lain.

Nihonote dibuat untuk menjadi alternatif yang:

- ringan,
- cepat digunakan,
- bisa berjalan offline,
- tidak membutuhkan login di awal,
- mudah dikembangkan,
- mudah dikontribusikan sebagai open-source project,
- cocok untuk learner yang ingin belajar Jepang secara bertahap.

---

## 3. Problem Statement

User pemula yang ingin belajar bahasa Jepang sering membutuhkan tool yang sederhana dan langsung bisa dipakai untuk:

- mengenal hiragana dan katakana,
- latihan membaca kana,
- menghafal kosakata dasar,
- mengulang materi yang sudah dipelajari,
- melihat progress belajar,
- belajar dari HP atau laptop,
- menggunakan aplikasi tanpa login,
- tetap bisa belajar ketika offline.

Pada saat yang sama, developer open-source membutuhkan struktur project yang rapi, maintainable, dan mudah dikembangkan.

---

## 4. Product Goals

### 4.1 User Goals

- User bisa belajar hiragana dan katakana dari nol.
- User bisa latihan kana menggunakan quiz interaktif.
- User bisa belajar kosakata dasar JLPT N5 menggunakan flashcard.
- User bisa mengulang vocabulary berdasarkan jadwal review sederhana.
- User bisa memilih bahasa interface dan translation preference: Indonesia atau English.
- User bisa melihat progress belajar.
- User bisa mengakses aplikasi sebagai PWA dan tetap memakai fitur utama secara offline.

### 4.2 Technical Goals

- Menggunakan monorepo agar scalable dan mudah dimaintain.
- Menggunakan atomic design agar UI component terstruktur.
- Menggunakan JSON sebagai sumber data awal.
- Menggunakan local-first storage untuk progress MVP.
- Menunda cloud sync sampai core MVP stabil.
- Menyediakan struktur kontribusi open source yang jelas.
- Menjaga codebase tetap modular, typed, dan mudah dites.

---

## 5. Non-Goals for MVP

Fitur berikut tidak termasuk dalam MVP awal:

- Login/register user.
- Cloud sync.
- Backend database.
- Payment/subscription.
- AI tutor.
- Leaderboard.
- Community deck marketplace.
- Full grammar course N5-N1.
- Native mobile app.
- Audio pronunciation lengkap.
- Admin dashboard.

Fitur tersebut dapat masuk ke roadmap setelah versi MVP stabil.

---

## 6. Target Users

### 6.1 Primary Users

- Pemula yang ingin belajar bahasa Jepang.
- User yang ingin belajar hiragana, katakana, dan vocabulary dasar.
- Orang Indonesia yang ingin materi bahasa Jepang dengan terjemahan Indonesia.
- User internasional yang lebih nyaman dengan English translation.
- Self-learner yang ingin app ringan dan tidak ribet.

### 6.2 Secondary Users

- Developer yang ingin kontribusi ke open-source learning app.
- Contributor yang ingin menambahkan vocabulary, grammar notes, atau dataset.
- Learner yang ingin membuat fork versi personal.
- Developer yang ingin belajar PWA, local-first app, dan frontend architecture.

---

## 7. Core Product Principles

### 7.1 No Login First

Versi awal Nihonote tidak membutuhkan login.

Alasan:

- Mengurangi friction saat user pertama kali mencoba app.
- Tidak membutuhkan backend di MVP.
- Lebih privacy-friendly.
- Lebih cocok untuk PWA offline-first.
- Lebih mudah dipublish sebagai open-source project.

Login akan menjadi fitur optional setelah MVP, terutama untuk cloud sync dan backup progress.

---

### 7.2 Local-first by Default

Semua progress awal disimpan di device/browser user.

Data yang disimpan lokal:

- user preference,
- selected language,
- quiz history,
- flashcard progress,
- review schedule,
- learning streak,
- last studied date.

---

### 7.3 Offline-first PWA

Aplikasi harus tetap bisa digunakan untuk fitur utama meskipun offline.

Minimal offline support:

- home dashboard,
- kana chart,
- kana quiz,
- vocabulary flashcards,
- review due cards,
- progress lokal.

---

### 7.4 Content as Data

Materi belajar disimpan sebagai data terbuka menggunakan JSON dan Markdown.

Keuntungan:

- Mudah diedit.
- Mudah divalidasi.
- Mudah dikontribusikan.
- Tidak bergantung pada database di awal.
- Cocok untuk static-first app.

---

### 7.5 Clean UX over Feature Quantity

Nihonote harus terasa ringan, fokus, dan nyaman dipakai.

Prinsip UX:

- Satu layar tidak boleh terlalu penuh.
- CTA harus jelas.
- Mobile-first.
- Feedback jawaban harus cepat dan jelas.
- Progress harus mudah dipahami.
- User bisa langsung belajar dalam waktu kurang dari 10 detik setelah membuka app.

---

## 8. Login Decision

### Recommendation

Untuk versi publish/MVP pertama:

```text
Do not require login.
```

### Reason

Login menambah kompleksitas:

- authentication,
- user database,
- session management,
- password reset,
- account deletion,
- privacy policy,
- backend deployment,
- security maintenance.

Sedangkan value utama MVP adalah:

```text
User buka aplikasi → langsung belajar → progress tersimpan lokal → bisa install PWA.
```

### Future Direction

Setelah MVP stabil, login dapat dibuat optional untuk:

- sync progress antar device,
- backup data belajar,
- cloud profile,
- community deck,
- AI learning history.

Recommended future auth providers:

- Supabase Auth,
- Firebase Auth,
- Auth.js.

---

## 9. Local Storage Recommendation

### 9.1 Recommended Storage for MVP

Untuk MVP, rekomendasi terbaik adalah:

```text
IndexedDB using Dexie.js
```

### 9.2 Why IndexedDB + Dexie.js?

IndexedDB lebih cocok daripada localStorage karena data belajar akan berkembang, misalnya flashcard progress, review schedule, quiz history, dan user settings.

Dexie.js membuat IndexedDB lebih mudah dipakai dengan API yang lebih developer-friendly.

Keuntungan:

- Cocok untuk data structured.
- Bisa menyimpan banyak record.
- Lebih scalable dari localStorage.
- Bisa query data progress dan review schedule.
- Cocok untuk offline-first PWA.
- Ringan dan mature untuk browser storage.

### 9.3 Storage Usage

Gunakan **IndexedDB/Dexie** untuk:

- flashcard progress,
- SRS review schedule,
- quiz history,
- learned kana,
- vocabulary state,
- daily activity.

Gunakan **localStorage** hanya untuk data kecil:

- selected language,
- theme preference,
- onboarding dismissed,
- simple UI settings.

### 9.4 Example Local DB Schema

```ts
export type UserPreference = {
  id: string;
  language: 'id' | 'en';
  theme: 'light' | 'dark' | 'system';
  showRomaji: boolean;
};

export type CardProgress = {
  cardId: string;
  status: 'new' | 'learning' | 'review' | 'mastered';
  reviewCount: number;
  correctCount: number;
  wrongCount: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
};

export type QuizHistory = {
  id: string;
  type: 'kana' | 'vocab';
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  createdAt: string;
};
```

---

## 10. Cloud Sync Strategy

Cloud sync tidak masuk MVP.

### Phase After MVP

Cloud sync baru dikerjakan setelah fitur berikut stabil:

- kana chart,
- kana quiz,
- vocabulary flashcard,
- local progress,
- review schedule,
- PWA offline.

### Recommended Cloud Approach Later

Option 1: Supabase

- Supabase Auth untuk login.
- PostgreSQL untuk progress sync.
- Row Level Security untuk data user.
- Cocok untuk open-source app.

Option 2: Firebase

- Firebase Auth.
- Firestore.
- Realtime sync lebih mudah.
- Cocok kalau ingin cepat tapi vendor-specific.

Recommendation after MVP:

```text
Supabase Auth + PostgreSQL
```

Alasan:

- Lebih SQL-friendly.
- Cocok untuk developer portfolio.
- Open-source friendly.
- Mudah dibuat self-hostable di masa depan.

---

## 11. Internationalization and Translation

### 11.1 Language Preference

User bisa memilih bahasa interface:

- Indonesian (`id`)
- English (`en`)

Default language:

```text
id
```

### 11.2 Japanese Learning Content

Konten Jepang harus menampilkan beberapa layer informasi:

- Japanese word/kanji/kana,
- kana reading,
- romaji,
- meaning in selected language,
- optional example sentence,
- optional grammar note.

Example vocabulary data:

```json
{
  "id": "n5-gakkou",
  "word": "学校",
  "kana": "がっこう",
  "romaji": "gakkou",
  "meaning": {
    "id": "sekolah",
    "en": "school"
  },
  "example": {
    "ja": "学校へ行きます。",
    "romaji": "Gakkou e ikimasu.",
    "meaning": {
      "id": "Saya pergi ke sekolah.",
      "en": "I go to school."
    }
  },
  "level": "N5",
  "tags": ["noun", "place"]
}
```

### 11.3 UI Translation Structure

UI text disimpan dalam dictionary:

```text
/packages/i18n/messages/id.json
/packages/i18n/messages/en.json
```

Example:

```json
{
  "home.title": "Belajar Jepang dengan ringan",
  "home.subtitle": "Latihan kana, kosakata, dan review harian.",
  "actions.startLearning": "Mulai Belajar",
  "actions.reviewToday": "Review Hari Ini"
}
```

English:

```json
{
  "home.title": "Learn Japanese lightly",
  "home.subtitle": "Practice kana, vocabulary, and daily review.",
  "actions.startLearning": "Start Learning",
  "actions.reviewToday": "Review Today"
}
```

---

## 12. System Architecture

### 12.1 Architecture Type

Nihonote menggunakan:

```text
Monorepo + Local-first Frontend App + JSON Content Data + PWA
```

### 12.2 High-level Architecture

```text
User Browser
  ↓
Next.js Web App
  ↓
UI Components using Atomic Design
  ↓
Learning Logic Layer
  ↓
JSON Learning Data + IndexedDB Progress Storage
  ↓
PWA Service Worker for Offline Support
```

### 12.3 Data Flow

```text
User opens app
→ App loads JSON learning data
→ App reads user progress from IndexedDB
→ User starts quiz/flashcard
→ Learning interaction updates local progress
→ Review schedule is calculated locally
→ PWA caches static assets and learning data
```

---

## 13. Monorepo Design

### 13.1 Recommended Package Manager

```text
pnpm workspace
```

Optional build system:

```text
Turborepo
```

Turborepo bisa dipakai jika package mulai banyak. Untuk MVP awal, pnpm workspace saja cukup. Namun karena targetnya maintainable dan open source, Turborepo tetap direkomendasikan sejak awal.

### 13.2 Proposed Monorepo Structure

```text
nihonote/
├── apps/
│   └── web/
│       ├── app/
│       ├── public/
│       ├── next.config.ts
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── ui/
│   │   ├── src/
│   │   │   ├── atoms/
│   │   │   ├── molecules/
│   │   │   ├── organisms/
│   │   │   ├── templates/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── data/
│   │   ├── src/
│   │   │   ├── kana/
│   │   │   │   ├── hiragana.json
│   │   │   │   └── katakana.json
│   │   │   ├── vocab/
│   │   │   │   └── n5.json
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── core/
│   │   ├── src/
│   │   │   ├── quiz/
│   │   │   ├── srs/
│   │   │   ├── progress/
│   │   │   ├── kana/
│   │   │   ├── vocab/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── storage/
│   │   ├── src/
│   │   │   ├── db.ts
│   │   │   ├── progress.repository.ts
│   │   │   ├── preference.repository.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── i18n/
│   │   ├── messages/
│   │   │   ├── id.json
│   │   │   └── en.json
│   │   ├── src/
│   │   │   ├── get-message.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── config/
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
│
├── docs/
│   ├── PRD.md
│   ├── ROADMAP.md
│   ├── CONTRIBUTING.md
│   └── ARCHITECTURE.md
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── README.md
└── LICENSE
```

---

## 14. Package Responsibilities

### 14.1 `apps/web`

Main Next.js application.

Responsibilities:

- routing,
- page composition,
- PWA setup,
- user interaction,
- connecting UI, data, storage, and core logic.

---

### 14.2 `packages/ui`

Reusable UI component library using Atomic Design.

Responsibilities:

- atoms,
- molecules,
- organisms,
- templates,
- shared design tokens,
- reusable components.

---

### 14.3 `packages/data`

Static learning content.

Responsibilities:

- kana data,
- vocabulary data,
- future grammar content,
- JSON exports,
- type-safe content access.

---

### 14.4 `packages/core`

Pure learning logic.

Responsibilities:

- quiz generation,
- answer validation,
- spaced repetition logic,
- progress calculation,
- filtering vocabulary by level/tag.

This package should not depend on React or browser APIs.

---

### 14.5 `packages/storage`

Browser local persistence layer.

Responsibilities:

- IndexedDB setup using Dexie,
- repositories for progress,
- repositories for preferences,
- local backup/export later.

This package is browser-focused.

---

### 14.6 `packages/i18n`

Translation and language preference helper.

Responsibilities:

- UI messages,
- translation helpers,
- language types,
- fallback handling.

---

### 14.7 `packages/config`

Shared tooling config.

Responsibilities:

- TypeScript config,
- ESLint config,
- Tailwind preset,
- formatting config.

---

## 15. Atomic Design System

Nihonote menggunakan Atomic Design agar component lebih rapi dan mudah dimaintain.

### 15.1 Atoms

Atoms adalah component paling kecil.

Examples:

- Button
- Input
- Badge
- IconButton
- ProgressBar
- Typography
- CardBase
- Tag
- Toggle
- Select

Example path:

```text
packages/ui/src/atoms/Button.tsx
packages/ui/src/atoms/Badge.tsx
packages/ui/src/atoms/ProgressBar.tsx
```

---

### 15.2 Molecules

Molecules adalah gabungan beberapa atoms.

Examples:

- LanguageSwitcher
- ThemeSwitcher
- SearchInput
- QuizOption
- StatCard
- FlashcardActionGroup
- KanaTile
- VocabMeaningBlock

Example path:

```text
packages/ui/src/molecules/LanguageSwitcher.tsx
packages/ui/src/molecules/QuizOption.tsx
packages/ui/src/molecules/KanaTile.tsx
```

---

### 15.3 Organisms

Organisms adalah bagian UI besar yang punya behavior lebih kompleks.

Examples:

- AppHeader
- BottomNavigation
- KanaChart
- QuizPanel
- FlashcardViewer
- ProgressSummary
- ReviewList
- DailyGoalWidget

Example path:

```text
packages/ui/src/organisms/KanaChart.tsx
packages/ui/src/organisms/QuizPanel.tsx
packages/ui/src/organisms/FlashcardViewer.tsx
```

---

### 15.4 Templates

Templates adalah layout halaman reusable.

Examples:

- DashboardTemplate
- LearningPageTemplate
- QuizPageTemplate
- SettingsPageTemplate

Example path:

```text
packages/ui/src/templates/DashboardTemplate.tsx
packages/ui/src/templates/LearningPageTemplate.tsx
```

---

### 15.5 Pages

Pages hanya berada di `apps/web/app`.

Pages mengatur routing dan menyusun templates/organisms.

Examples:

```text
apps/web/app/page.tsx
apps/web/app/kana/page.tsx
apps/web/app/quiz/page.tsx
apps/web/app/flashcards/page.tsx
apps/web/app/review/page.tsx
apps/web/app/settings/page.tsx
```

---

## 16. Design and UX Direction

### 16.1 Design Style

Nihonote harus terasa:

- calm,
- clean,
- focused,
- modern,
- friendly,
- mobile-first,
- tidak terlalu ramai.

Visual direction:

- soft rounded cards,
- clear hierarchy,
- large Japanese characters,
- comfortable spacing,
- readable typography,
- minimal distraction,
- light/dark mode support.

---

### 16.2 UI Principles

- Japanese character harus besar dan mudah dibaca.
- Romaji dan meaning harus jelas tapi tidak mendominasi.
- CTA utama maksimal 1-2 per screen.
- Quiz feedback harus cepat dan tidak membingungkan.
- Navigasi mobile harus mudah dijangkau.
- Progress harus divisualkan secara sederhana.
- Jangan membuat user merasa gagal; gunakan copy yang supportive.

---

### 16.3 Recommended Layout

#### Mobile-first Bottom Navigation

Main navigation:

- Home
- Kana
- Quiz
- Review
- Settings

#### Desktop Layout

Desktop dapat menggunakan sidebar atau top navigation.

Recommended:

- mobile: bottom nav,
- tablet/desktop: sidebar nav.

---

### 16.4 Home Dashboard UX

Home dashboard harus menampilkan:

- greeting,
- daily review count,
- quick action to continue learning,
- progress summary,
- recent activity,
- shortcut cards.

Example sections:

```text
Good evening, ready to review?

[Review 12 cards]
[Practice Kana]

Today's Progress
- 8 cards reviewed
- 85% accuracy
- 3 day streak
```

---

### 16.5 Flashcard UX

Flashcard screen harus fokus pada satu card.

Front side:

- Japanese word/kana large.

Back side:

- kana,
- romaji,
- selected language meaning,
- example sentence optional.

Actions:

- Again
- Hard
- Good
- Easy

---

### 16.6 Quiz UX

Quiz screen harus sederhana:

- question,
- 4 options,
- progress indicator,
- immediate feedback,
- next button.

Feedback:

- correct answer highlighted,
- wrong answer shows correct answer,
- short explanation optional.

---

### 16.7 Accessibility Requirements

- Keyboard navigation support.
- Visible focus state.
- Sufficient color contrast.
- Buttons minimum touch target 44px.
- Avoid relying only on color for correct/wrong feedback.
- Japanese text should use readable font fallback.

---

## 17. Core Features

## 17.1 Feature: Home Dashboard

### Description

Dashboard utama untuk menampilkan ringkasan progress dan shortcut belajar.

### Requirements

- Show greeting.
- Show review due today.
- Show kana progress.
- Show vocabulary progress.
- Show daily activity summary.
- Quick action to start review.
- Quick action to practice kana.
- Responsive mobile-first layout.

### Priority

Must Have

---

## 17.2 Feature: Kana Chart

### Description

User dapat melihat daftar hiragana dan katakana.

### Requirements

- Show hiragana chart.
- Show katakana chart.
- Toggle hiragana/katakana.
- Show romaji for each kana.
- Mark learned kana locally.
- Optional search/filter.

### Priority

Must Have

---

## 17.3 Feature: Kana Quiz

### Description

User latihan mengenali kana melalui multiple choice quiz.

### Requirements

- Generate random kana question.
- Question mode: Kana to Romaji.
- 4 answer options.
- Immediate feedback.
- Score per session.
- Save quiz result to IndexedDB.
- Show accuracy after quiz.

### Priority

Must Have

---

## 17.4 Feature: Vocabulary Flashcards

### Description

User belajar vocabulary dasar Jepang menggunakan flashcard.

### Requirements

- Load vocabulary from JSON.
- Show Japanese word/kana.
- Flip card to reveal meaning.
- Show meaning based on user language preference.
- Show romaji.
- Show JLPT level.
- Support tags.
- User can rate card: Again, Hard, Good, Easy.
- Save progress to IndexedDB.

### Priority

Must Have

---

## 17.5 Feature: Simple Spaced Repetition

### Description

Sistem sederhana untuk menentukan jadwal review flashcard.

### MVP Algorithm

```text
Again → review again today
Hard  → review tomorrow
Good  → review in 3 days
Easy  → review in 7 days
```

### Requirements

- Calculate next review date.
- Store next review date in IndexedDB.
- Show due cards on Review page.
- Update review count.
- Update card status.

### Priority

Must Have

---

## 17.6 Feature: Review Page

### Description

Halaman untuk menampilkan flashcard yang harus direview hari ini.

### Requirements

- Show number of due cards.
- Start review session.
- Show empty state if no review due.
- Sort cards by due date.
- Save review result.

### Priority

Should Have

---

## 17.7 Feature: Settings Page

### Description

Halaman untuk mengatur preferensi user.

### Requirements

- Change UI language: ID/EN.
- Toggle romaji visibility.
- Change theme: light/dark/system.
- Reset local progress.
- Export local data as JSON later.
- Import local data later.

### Priority

Should Have

---

## 17.8 Feature: PWA Support

### Description

Aplikasi dapat di-install dan digunakan secara offline.

### Requirements

- Web app manifest.
- App icon.
- Service worker.
- Offline fallback page.
- Cache static assets.
- Cache JSON learning data.
- App installable on mobile and desktop.

### Priority

Must Have

---

## 18. Data Model

### 18.1 Kana Data

```ts
export type KanaItem = {
  id: string;
  kana: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  group: string;
  order: number;
};
```

Example:

```json
{
  "id": "hiragana-a",
  "kana": "あ",
  "romaji": "a",
  "type": "hiragana",
  "group": "vowel",
  "order": 1
}
```

---

### 18.2 Vocabulary Data

```ts
export type VocabularyItem = {
  id: string;
  word: string;
  kana: string;
  romaji: string;
  meaning: {
    id: string;
    en: string;
  };
  example?: {
    ja: string;
    romaji?: string;
    meaning: {
      id: string;
      en: string;
    };
  };
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  tags: string[];
};
```

---

### 18.3 Card Progress Data

```ts
export type CardProgress = {
  cardId: string;
  status: 'new' | 'learning' | 'review' | 'mastered';
  reviewCount: number;
  correctCount: number;
  wrongCount: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  updatedAt: string;
};
```

---

### 18.4 User Preference Data

```ts
export type UserPreference = {
  id: 'default';
  language: 'id' | 'en';
  theme: 'light' | 'dark' | 'system';
  showRomaji: boolean;
  dailyGoal: number;
  updatedAt: string;
};
```

---

## 19. PWA Requirements

### 19.1 Manifest

Required manifest fields:

- name,
- short_name,
- description,
- start_url,
- display,
- background_color,
- theme_color,
- icons.

### 19.2 Offline Behavior

When offline:

- user can open app shell,
- user can access cached learning data,
- user can continue quiz/review,
- progress remains stored locally,
- sync is not needed for MVP.

### 19.3 Caching Strategy

Recommended:

- Cache static assets.
- Cache app shell.
- Cache JSON learning data.
- Do not cache unnecessary external resources.

---

## 20. Roadmap

### v0.1 — Foundation

- Monorepo setup.
- Next.js app setup.
- Tailwind CSS setup.
- Atomic UI structure.
- Basic layout.
- i18n basic ID/EN.
- JSON kana data.

### v0.2 — Kana Learning

- Hiragana chart.
- Katakana chart.
- Kana quiz.
- Quiz result summary.
- Local quiz history.

### v0.3 — Vocabulary Flashcards

- N5 vocabulary JSON.
- Flashcard UI.
- Flip card interaction.
- Language-based meaning.
- Card rating actions.

### v0.4 — Local Progress and SRS

- IndexedDB with Dexie.
- Card progress storage.
- Review schedule.
- Review page.
- Progress summary.

### v0.5 — PWA

- Manifest.
- Icons.
- Service worker.
- Offline fallback.
- Cached learning data.

### v0.6 — UX Polish

- Mobile bottom navigation.
- Desktop sidebar.
- Empty states.
- Loading states.
- Better visual hierarchy.
- Dark mode.

### v1.0 — Open Source Stable MVP

- Complete kana flow.
- Basic N5 vocabulary deck.
- Flashcard review.
- PWA installable.
- Offline support.
- README.
- CONTRIBUTING.md.
- ROADMAP.md.
- MIT License.

### v1.1+ — Cloud Sync Optional

- Optional login.
- Supabase Auth.
- Cloud progress sync.
- Backup and restore.
- Multi-device sync.

---

## 21. Open Source Strategy

### 21.1 License

Recommended license:

```text
MIT License
```

### 21.2 Repository Requirements

Minimum repository files:

- README.md
- LICENSE
- CONTRIBUTING.md
- ROADMAP.md
- CODE_OF_CONDUCT.md
- docs/PRD.md
- docs/ARCHITECTURE.md

### 21.3 Contribution Opportunities

Contributors can help with:

- vocabulary data,
- typo fixes,
- Indonesian translation,
- English translation,
- grammar notes,
- UI improvements,
- accessibility fixes,
- PWA improvements,
- test coverage,
- documentation.

### 21.4 Dataset Contribution Format

Every vocabulary contribution must include:

- unique id,
- Japanese word,
- kana reading,
- romaji,
- Indonesian meaning,
- English meaning,
- JLPT level,
- tags.

Optional:

- example sentence,
- example romaji,
- example translation.

---

## 22. Success Metrics

### MVP Success Metrics

- User can open app and start learning without login.
- User can complete kana quiz.
- User can review vocabulary flashcards.
- Progress remains saved after closing browser.
- App works offline for core features.
- App can be installed as PWA.
- Contributor can add vocabulary through JSON.

### Product Metrics After Publish

- GitHub stars.
- Issues opened.
- Pull requests merged.
- Dataset contributions.
- User feedback.
- Demo usage.

---

## 23. Risks and Mitigation

### Risk 1: Scope too large

Mitigation:

- Focus on kana, N5 vocabulary, local progress, and PWA first.

### Risk 2: Dataset quality issue

Mitigation:

- Use strict JSON schema.
- Add contribution review checklist.
- Add validation script later.

### Risk 3: PWA complexity

Mitigation:

- Build core app first.
- Add PWA after core learning flow works.

### Risk 4: Local data loss

Mitigation:

- Add export/import local data after MVP.
- Add cloud sync after v1.0.

### Risk 5: UI becomes too complex

Mitigation:

- Follow atomic design.
- Keep page layout simple.
- Prioritize mobile-first UX.

---

## 24. Technical Decisions Summary

| Area | Decision |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Architecture | Monorepo |
| UI Pattern | Atomic Design |
| Package Manager | pnpm |
| Build Orchestration | Turborepo |
| Data Source MVP | JSON |
| Local Storage | IndexedDB with Dexie.js |
| Small Preferences | localStorage |
| Cloud Sync | After MVP |
| Future Cloud Recommendation | Supabase Auth + PostgreSQL |
| PWA | Yes |
| Login MVP | No |
| i18n | Indonesian and English |
| Open Source License | MIT |

---

## 25. Final MVP Definition

Nihonote MVP adalah aplikasi web PWA open-source untuk belajar bahasa Jepang yang memiliki:

- no login,
- local-first progress,
- hiragana chart,
- katakana chart,
- kana quiz,
- N5 vocabulary flashcards,
- simple spaced repetition,
- ID/EN language preference,
- Japanese learning data with translation,
- IndexedDB storage,
- JSON content data,
- monorepo architecture,
- atomic design UI structure,
- mobile-first and UX-friendly design,
- offline support.

MVP dianggap selesai ketika user bisa:

```text
Open app → choose language → learn kana → take quiz → learn vocabulary → review due cards → close browser → reopen app with progress still saved → install app as PWA.
```
