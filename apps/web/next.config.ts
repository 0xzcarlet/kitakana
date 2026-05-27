import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const configDir = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@kitakana/ui", "@kitakana/content", "@kitakana/core"],
  turbopack: {
    root: resolve(configDir, "../.."),
  },
};

export default nextConfig;
