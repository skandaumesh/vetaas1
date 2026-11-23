"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// gtag is loaded by the script below; this is just enough typing to call it.
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const isTracked = (path: string | null) => !!path && !path.startsWith("/admin");

// A ticket's link is its only key — whoever has it can open the ticket — so
// the code in /ticket/<code> never goes to Analytics.
const redact = (url: string) => url.replace(/\/ticket\/[^/?#]+/, "/ticket/redacted");

/**
 * Loads GA4 and sends page views manually.
 *
 * Automatic page_view is turned off so admin pages can be excluded — otherwise
 * the team's own dashboard browsing shows up as site traffic and buries the
 * pages real visitors actually look at.
 */
export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.gtag) return;
    // Every later event — scrolls, outbound clicks — reports this location
    // too, so it's set before anything else is sent.
    const location = redact(window.location.href);
    window.gtag("set", { page_location: location, page_path: redact(pathname ?? "") });
    if (!isTracked(pathname)) return;
    window.gtag("event", "page_view", {
      page_path: redact(pathname ?? ""),
      page_location: location,
      page_title: document.title,
    });
  }, [pathname]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            send_page_view: false,
            page_location: location.href.replace(/\\/ticket\\/[^/?#]+/, '/ticket/redacted')
          });
        `}
      </Script>
    </>
  );
}
