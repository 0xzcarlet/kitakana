import { expect, test } from "@playwright/test";

test("landing page exposes core SEO metadata", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(
    /Belajar Hiragana, Katakana, dan Kanji N5 Online \| Kitakana/,
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /Belajar hiragana, katakana, kuis kana online, dan kanji N5/,
  );
  const canonicalHref = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  expect(new URL(canonicalHref ?? "").pathname).toBe("/");
  const structuredData = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .evaluate((element) => element.textContent ?? "");
  expect(structuredData).toContain("EducationalApplication");
});

test("private app routes are marked noindex", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );

  await page.goto("/settings");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});

test("SEO endpoint files are generated", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const sitemapBody = await sitemap.text();
  expect(sitemapBody).toContain("<loc>");
  expect(sitemapBody).toContain("/kana/practice");
  expect(sitemapBody).not.toContain("/dashboard");

  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  const robotsBody = await robots.text();
  expect(robotsBody).toContain("Disallow: /dashboard");
  expect(robotsBody).toContain("Disallow: /settings");
  expect(robotsBody).toContain("Sitemap:");

  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.ok()).toBe(true);
  const manifestBody = await manifest.json();
  expect(manifestBody.name).toBe("Kitakana");
  expect(manifestBody.display).toBe("standalone");
  expect(manifestBody.start_url).toBe("/dashboard");
  expect(manifestBody.icons).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purpose: "maskable",
        sizes: "192x192",
        src: "/web-app-manifest-192x192.png",
        type: "image/png",
      }),
      expect.objectContaining({
        purpose: "maskable",
        sizes: "512x512",
        src: "/web-app-manifest-512x512.png",
        type: "image/png",
      }),
    ]),
  );
});

test("PWA icon files are served", async ({ request }) => {
  for (const path of [
    "/favicon.ico",
    "/apple-touch-icon.png",
    "/icons/kitakana.svg",
    "/web-app-manifest-192x192.png",
    "/web-app-manifest-512x512.png",
  ]) {
    const response = await request.get(path);
    expect(response.ok(), `${path} should be served`).toBe(true);
  }
});
