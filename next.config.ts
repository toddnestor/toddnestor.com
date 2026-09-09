import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/": ["./lib/generated/**/*"],
    "/[...slug]": ["./lib/generated/**/*"],
  },
};

export default nextConfig;
