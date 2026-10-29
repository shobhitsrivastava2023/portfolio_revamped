import type { NextConfig } from "next";

// Drawer media is served from R2: its public URL (custom domain or r2.dev) must be allowed for next/image.
const r2Host = process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL).hostname : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.dev" },
      ...(r2Host ? [{ protocol: "https" as const, hostname: r2Host }] : []),
    ],
  },
  experimental: {
    // Lets <ViewTransition> animate project covers into the project page.
    viewTransition: true,
  },
};

export default nextConfig;
