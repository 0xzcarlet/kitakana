import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#ffffff",
    categories: ["education", "productivity"],
    description: siteConfig.description,
    display: "standalone",
    icons: [
      {
        purpose: "maskable",
        sizes: "192x192",
        src: "/web-app-manifest-192x192.png",
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "/web-app-manifest-512x512.png",
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "any",
        src: "/icons/kitakana.svg",
        type: "image/svg+xml",
      },
    ],
    lang: "id",
    name: siteConfig.name,
    scope: "/",
    short_name: siteConfig.shortName,
    start_url: "/dashboard",
    theme_color: "#ffffff",
  };
}
