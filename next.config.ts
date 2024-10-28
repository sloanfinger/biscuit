import type { NextConfig } from "next";
import "@/env";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    after: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
} satisfies NextConfig;

export default nextConfig;
