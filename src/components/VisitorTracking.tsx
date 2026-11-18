"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

/**
 * The third-party visitor tracker, kept off the admin panel. Any script that
 * runs on an admin page runs with the admin's signed-in session and could read
 * or change everything the admin can, so only code this site ships itself
 * runs there. Nothing on the public site links into /admin, so the admin is
 * always a fresh page load and the tracker never gets in.
 */
export default function VisitorTracking() {
  const pathname = usePathname();
  if (!pathname || pathname.startsWith("/admin")) return null;
  return (
    <Script
      src="https://ozlabsprototype1.vercel.app/api/v1/track/script?key=d0a677c9-0c0e-4005-9876-3e091add411d"
      strategy="afterInteractive"
    />
  );
}
