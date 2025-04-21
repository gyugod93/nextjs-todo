import NextBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  webpack(config) {
    return config;
  },
};

export default NextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true", // 번들 분석 활성화
})(nextConfig);
