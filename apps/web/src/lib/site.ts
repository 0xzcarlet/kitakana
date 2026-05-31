const LOCAL_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value: string): string {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return LOCAL_SITE_URL;
  }
}

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  }

  if (process.env.VERCEL_URL) {
    return normalizeSiteUrl(process.env.VERCEL_URL);
  }

  return LOCAL_SITE_URL;
}

export function getAbsoluteUrl(path = "/"): string {
  return new URL(path, getSiteUrl()).toString();
}

export const siteConfig = {
  description:
    "Kitakana adalah PWA belajar bahasa Jepang untuk pemula Indonesia: hiragana, katakana, kuis kana online, kanji N5, dan progress lokal tanpa login.",
  keywords: [
    "belajar bahasa Jepang",
    "belajar hiragana",
    "belajar katakana",
    "kuis kana online",
    "kanji N5",
    "aplikasi belajar Jepang",
    "PWA belajar Jepang",
  ],
  name: "Kitakana",
  shortName: "Kitakana",
  url: getSiteUrl(),
};
