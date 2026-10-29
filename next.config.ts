import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Lets <ViewTransition> animate project covers into the project page.
    viewTransition: true,
  },
};

export default nextConfig;
