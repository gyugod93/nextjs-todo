import NextBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  webpack(config, { dev, isServer }) {
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: "all",
        maxInitialRequests: 25,
        minSize: 20000,
      },
      usedExports: true,
      minimize: !dev,
      sideEffects: true,
    };

    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: 10,
        },
        shared: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
          name: "shared",
          chunks: "all",
          priority: 20,
        },
      };
    }

    return config;
  },
};

export default NextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
