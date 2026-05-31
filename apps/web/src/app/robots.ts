import type { MetadataRoute } from "next";
import { getAbsoluteUrl, getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    host: getSiteUrl(),
    rules: {
      allow: "/",
      disallow: ["/dashboard", "/settings"],
      userAgent: "*",
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
  };
}
