import type { Metadata } from "next";
import { AppShell } from "@kitakana/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kitakana",
  description: "Open-source Japanese learning PWA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
