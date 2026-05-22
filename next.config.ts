import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.vetaas.in",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "vetaas-7aeae.firebasestorage.app",
      },
    ],
  },
};

export default nextConfig;
