import type { NextConfig } from "next";

// The portal always lives at <site root>/portal/. On the production domain the
// site root is "/", so basePath is "/portal". On a project-scoped preview host
// (GitHub Pages serves this repo at /Gispl_web/) the whole site is nested, so
// NEXT_PUBLIC_SITE_BASE_PATH carries that prefix through to the exported URLs.
// Must be a root-relative path with no trailing slash, e.g. "/Gispl_web".
// src/lib/paths.ts reads the same var — keep them in step.
const sitePrefix = (process.env.NEXT_PUBLIC_SITE_BASE_PATH || "").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  output: "export",
  basePath: `${sitePrefix}/portal`,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
