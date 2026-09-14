import type { NextConfig } from "next";

const FRONTEND_ROOT = import.meta.dirname;

const nextConfig: NextConfig = {
  turbopack: {
    root: FRONTEND_ROOT,
  },
};

export default nextConfig;
