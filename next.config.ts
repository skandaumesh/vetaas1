import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  // Stop the browser second-guessing file types (an uploaded file being
  // treated as a script, say).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Another site can't embed vetaas.in in a frame and trick people into
  // clicking things inside it.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Don't hand full ticket or admin URLs to other sites in the referrer.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The camera is needed for the admin check-in scanner; nothing else is.
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
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
