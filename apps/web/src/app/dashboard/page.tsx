import type { Metadata } from "next";
import { HomeDashboardClient } from "../HomeDashboardClient";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dashboard",
  },
  description:
    "Dashboard progress belajar lokal Kitakana yang tersimpan di perangkat pengguna.",
  robots: {
    follow: false,
    index: false,
  },
  title: "Dashboard Belajar",
};

export default function DashboardPage() {
  return <HomeDashboardClient />;
}
