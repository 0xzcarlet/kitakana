import type { Metadata } from "next";
import Link from "next/link";
import { hiragana, katakana, kanjiN5 } from "@kitakana/content";
import { getAbsoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  description:
    "Belajar hiragana, katakana, kuis kana online, dan kanji N5 dari browser. Kitakana dibuat untuk pemula Indonesia, tanpa login, dan siap menjadi PWA.",
  openGraph: {
    description:
      "Belajar hiragana, katakana, kuis kana online, dan kanji N5 dari browser tanpa login.",
    title: "Kitakana - Belajar Hiragana, Katakana, dan Kanji N5",
    url: "/",
  },
  title: {
    absolute: "Belajar Hiragana, Katakana, dan Kanji N5 Online | Kitakana",
  },
};

const featureLinks = [
  {
    description:
      "Lihat tabel hiragana dan katakana lengkap dengan romaji untuk mulai membaca kana dari dasar.",
    href: "/kana",
    label: "Buka chart kana",
    title: "Hiragana dan Katakana",
  },
  {
    description:
      "Latihan kuis kana online dengan pilihan ganda atau mode ketik agar hafalan terasa aktif.",
    href: "/kana/practice",
    label: "Mulai latihan",
    title: "Latihan Kana",
  },
  {
    description:
      "Coba sesi kuis cepat untuk mengenali kana dan menyimpan progress belajar di browser.",
    href: "/quiz",
    label: "Coba kuis",
    title: "Kuis Cepat",
  },
  {
    description:
      "Mulai mengenal kanji JLPT N5 melalui detail arti, bacaan, contoh kata, dan latihan.",
    href: "/kanji",
    label: "Belajar kanji",
    title: "Kanji N5",
  },
] as const;

const kanaPreview = [
  ["あ", "い", "う", "え", "お"],
  ["か", "き", "く", "け", "こ"],
  ["ア", "イ", "ウ", "エ", "オ"],
  ["カ", "キ", "ク", "ケ", "コ"],
] as const;

const faqs = [
  {
    answer:
      "Kitakana dibuat untuk pemula yang ingin mulai dari hiragana, katakana, kuis kana online, dan kanji N5 dasar.",
    question: "Kitakana cocok untuk siapa?",
  },
  {
    answer:
      "Tidak. Progress belajar awal disimpan lokal di browser, jadi kamu bisa langsung latihan tanpa membuat akun.",
    question: "Apakah Kitakana perlu login?",
  },
  {
    answer:
      "Saat ini kamu bisa mulai dari kana dan kanji N5. Ke depannya, materi kosakata dan fitur belajar tanpa internet akan ditambahkan bertahap.",
    question: "Materi apa yang tersedia sekarang?",
  },
] as const;

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "EducationalApplication",
    applicationCategory: "EducationalApplication",
    description: siteConfig.description,
    featureList: [
      "Belajar hiragana dan katakana",
      "Kuis kana online",
      "Latihan kanji JLPT N5",
      "Progress lokal tanpa login",
    ],
    inLanguage: "id",
    name: siteConfig.name,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    operatingSystem: "Web browser",
    url: getAbsoluteUrl("/"),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
      name: faq.question,
    })),
  },
];

export default function Home() {
  const totalKana = hiragana.length + katakana.length;
  const totalKanji = kanjiN5.length;

  return (
    <main
      className="min-h-screen overflow-hidden bg-background text-text"
      data-testid="landing-page"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="font-display text-2xl font-extrabold text-text"
          aria-label="Kitakana home"
        >
          Kitakana
        </Link>
        <nav
          aria-label="Navigasi landing"
          className="hidden items-center gap-7 text-sm font-bold text-text-muted sm:flex"
        >
          <Link className="transition hover:text-text" href="/kana">
            Kana
          </Link>
          <Link className="transition hover:text-text" href="/quiz">
            Kuis
          </Link>
          <Link className="transition hover:text-text" href="/kanji">
            Kanji
          </Link>
        </nav>
        <Link
          href="/kana/practice"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-text px-4 py-2 font-display text-sm font-bold text-bg-soft transition hover:bg-text/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          Mulai latihan
        </Link>
      </header>

      <section className="relative isolate mx-auto flex w-full max-w-7xl items-center px-4 pb-16 pt-10 sm:px-6 lg:min-h-[34rem] lg:px-10">
        <div
          className="absolute inset-0 -z-10 overflow-hidden opacity-25 sm:opacity-100"
          aria-hidden
        >
          <div className="absolute left-1/2 top-6 h-[36rem] w-[52rem] -translate-x-1/2 rounded-[3rem] border border-border/70 bg-card/70 shadow-[0_28px_80px_rgba(79,37,46,0.12)] sm:top-10 lg:left-auto lg:right-0 lg:translate-x-0" />
          <div className="absolute right-4 top-14 grid w-[22rem] rotate-3 grid-cols-5 gap-2 rounded-[1.75rem] border border-border bg-bg-soft/95 p-4 shadow-[0_26px_70px_rgba(79,37,46,0.16)] sm:right-10 lg:right-20 lg:w-[28rem] lg:p-5">
            {kanaPreview.flat().map((kana, index) => (
              <span
                key={`${kana}-${index}`}
                className="grid aspect-square place-items-center rounded-2xl border border-border bg-card font-display text-3xl font-extrabold text-text shadow-sm lg:text-5xl"
              >
                {kana}
              </span>
            ))}
          </div>
          <div className="absolute bottom-6 right-2 w-[24rem] -rotate-2 rounded-[1.75rem] border border-primary/40 bg-[#ffe3a8]/95 p-5 shadow-[0_26px_70px_rgba(79,37,46,0.14)] sm:right-16 lg:bottom-12 lg:right-28">
            <div className="flex items-center justify-between gap-4">
              <span className="font-display text-5xl font-extrabold text-text">
                日
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <span className="block h-3 rounded-full bg-text/80" />
                <span className="block h-3 w-3/4 rounded-full bg-text/35" />
                <span className="block h-3 w-1/2 rounded-full bg-text/20" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl py-8">
          <h1 className="font-display text-4xl font-extrabold leading-tight text-text sm:text-6xl lg:text-7xl">
            Belajar hiragana, katakana, dan kanji N5 dari browser.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">
            Kitakana membantu pemula Indonesia mulai belajar bahasa Jepang lewat
            chart kana, kuis kana online, latihan kanji N5, dan progress lokal
            tanpa login.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/kana/practice"
              data-testid="landing-primary-cta"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-primary px-6 py-4 font-display text-base font-bold text-text shadow-[0_12px_28px_rgba(244,174,82,0.34)] transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Mulai latihan kana
            </Link>
            <Link
              href="/kana"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-card px-6 py-4 font-display text-base font-bold text-text ring-1 ring-border transition hover:bg-bg-soft hover:ring-primary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Lihat chart kana
            </Link>
          </div>
          <dl className="mt-10 grid max-w-sm grid-cols-2 gap-4">
            <div>
              <dt className="text-xs font-bold uppercase text-text-muted">
                Kana
              </dt>
              <dd className="mt-1 font-display text-3xl font-extrabold">
                {totalKana}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-text-muted">
                Kanji N5
              </dt>
              <dd className="mt-1 font-display text-3xl font-extrabold">
                {totalKanji}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
        {featureLinks.map((feature) => (
          <article
            key={feature.href}
            className="flex min-h-64 flex-col justify-between rounded-[2rem] border border-border bg-card p-5 shadow-[0_20px_50px_rgba(79,37,46,0.08)]"
          >
            <div>
              <h2 className="font-display text-2xl font-extrabold text-text">
                {feature.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-text-muted">
                {feature.description}
              </p>
            </div>
            <Link
              href={feature.href}
              data-testid="landing-feature-link"
              className="mt-6 font-display text-sm font-bold text-primary transition hover:text-primary-hover"
            >
              {feature.label}
            </Link>
          </article>
        ))}
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
        <div>
          <h2 className="font-display text-4xl font-extrabold leading-tight text-text">
            Materi awal yang bisa langsung dipakai.
          </h2>
          <p className="mt-4 text-base leading-7 text-text-muted">
            Mulai dari bunyi dasar, lanjut ke latihan aktif, lalu tambah kanji
            N5 sedikit demi sedikit.
          </p>
        </div>
        <div className="grid gap-3 rounded-[2rem] border border-surface-strong/70 bg-surface p-5 shadow-[0_20px_50px_rgba(79,37,46,0.08)]">
          {kanaPreview.map((row, index) => (
            <div key={index} className="grid grid-cols-5 gap-2">
              {row.map((kana) => (
                <span
                  key={kana}
                  className="grid aspect-square place-items-center rounded-2xl bg-bg-soft font-display text-3xl font-extrabold text-text"
                >
                  {kana}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-10">
        <h2 className="font-display text-4xl font-extrabold text-text">
          Pertanyaan umum
        </h2>
        <div className="mt-6 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="rounded-[1.5rem] border border-border bg-card p-5 text-text"
            >
              <summary className="cursor-pointer font-display text-lg font-extrabold">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-6 text-text-muted">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
