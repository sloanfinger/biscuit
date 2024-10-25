import type { NextConfig } from "next";
import "@/env";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    after: true,
  },
} satisfies NextConfig;

export default nextConfig;
