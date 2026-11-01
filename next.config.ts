import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "yce-us.s3-accelerate.amazonaws.com" },
      { protocol: "https", hostname: "plugins-media.makeupar.com" },
      { protocol: "https", hostname: "**.perfectcorp.com" },
      { protocol: "https", hostname: "**.makeupar.com" },
    ],
  },
};

export default nextConfig;
