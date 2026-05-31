import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/lib/site";

const publicRoutes = [
  { path: "/", priority: 1 },
  { path: "/kana", priority: 0.9 },
  { path: "/kana/practice", priority: 0.85 },
  { path: "/quiz", priority: 0.75 },
  { path: "/kanji", priority: 0.75 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    changeFrequency: "weekly",
    lastModified,
    priority: route.priority,
    url: getAbsoluteUrl(route.path),
  }));
}
