import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images2.imgbox.com", // SpaceX patch images
      "i.imgur.com",        // Some mission patches
      "imgur.com",          // Fallback for imgur links
    ],
  },
};

export default nextConfig;