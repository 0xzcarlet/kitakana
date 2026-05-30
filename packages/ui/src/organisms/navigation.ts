export type NavigationItem = {
  href: string;
  kana: string;
  label: string;
};

export const mainNavigation: NavigationItem[] = [
  { href: "/", kana: "家", label: "Beranda" },
  { href: "/kana", kana: "あ", label: "Kana" },
  { href: "/quiz", kana: "問", label: "Kuis" },
  { href: "/kanji", kana: "漢", label: "Kanji" },
  { href: "/settings", kana: "設", label: "Pengaturan" },
];
