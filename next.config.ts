import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "docs",
  basePath: "/discord-schedule-poll-maker",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
