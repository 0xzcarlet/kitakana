import type { Metadata, Viewport } from "next";
import { RouteAwareAppShell } from "@/components/app-shell/RouteAwareAppShell";
import { getSiteUrl, siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: siteConfig.name,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
  },
  category: "education",
  creator: "Kitakana",
  description: siteConfig.description,
  icons: {
    apple: [
      {
        sizes: "180x180",
        type: "image/png",
        url: "/apple-touch-icon.png",
      },
    ],
    icon: [
      {
        type: "image/x-icon",
        url: "/favicon.ico",
      },
      {
        sizes: "any",
        type: "image/svg+xml",
        url: "/icons/kitakana.svg",
      },
    ],
  },
  keywords: siteConfig.keywords,
  manifest: "/manifest.webmanifest",
  metadataBase: new URL(getSiteUrl()),
  openGraph: {
    description: siteConfig.description,
    locale: "id_ID",
    siteName: siteConfig.name,
    title: siteConfig.name,
    type: "website",
    url: "/",
  },
  title: {
    default: "Kitakana - Belajar Hiragana, Katakana, dan Kanji N5",
    template: "%s | Kitakana",
  },
  twitter: {
    card: "summary",
    description: siteConfig.description,
    title: siteConfig.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
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
