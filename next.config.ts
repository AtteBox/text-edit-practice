import { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    // Next 16.3 enables Turbopack's persistent build cache by default. It
    // stores env values (incl. secrets) in .next/cache, which trips Netlify's
    // secret scanning, so keep it off for production builds.
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
