import type { Metadata } from "next";
import { SettingsClient } from "./SettingsClient";

export const metadata: Metadata = {
  alternates: {
    canonical: "/settings",
  },
  description:
    "Pengaturan preferensi belajar lokal Kitakana untuk kana, mode latihan, dan jumlah soal.",
  robots: {
    follow: false,
    index: false,
  },
  title: "Pengaturan",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
