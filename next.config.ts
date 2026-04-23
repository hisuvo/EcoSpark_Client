import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    // domains: ["images.unsplash.com", "i.ibb.co.com"],
    remotePatterns: [
      {
        // protocol: "https",
        // hostname: "i.ibb.co.com",
        // pathname: "/**",
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
