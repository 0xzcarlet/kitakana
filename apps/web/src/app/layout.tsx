import type { Metadata } from "next";
import { RouteAwareAppShell } from "@/components/app-shell/RouteAwareAppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kitakana",
  description: "Belajar bahasa Jepang dari kana dan kosakata dasar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full">
        <RouteAwareAppShell>{children}</RouteAwareAppShell>
      </body>
    </html>
  );
}
