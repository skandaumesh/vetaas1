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
      {
        // Plain GCS URLs — some event posters were written in this form before
        // the migration switched to Firebase download URLs.
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
