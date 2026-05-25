export type NavigationItem = {
  href: string;
  kana: string;
  label: string;
};

export const mainNavigation: NavigationItem[] = [
  { href: "/", kana: "家", label: "Home" },
  { href: "/kana", kana: "あ", label: "Kana" },
  { href: "/quiz", kana: "問", label: "Quiz" },
  { href: "/review", kana: "復", label: "Review" },
  { href: "/settings", kana: "設", label: "Settings" },
];
