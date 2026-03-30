import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["gsap"],
  },
  transpilePackages: ["gsap"],
  // Empty turbopack config acknowledges Turbopack usage, silences the webpack warning
  turbopack: {},
};

export default nextConfig;
