"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";
import { parseLumaUrl, initLumaCheckout } from "@/lib/luma";

interface Event {
  id: string;
  title: string;
  date: string;
  status: string;
  registrationUrl?: string;
}

export default function EventBanner() {
  const [event, setEvent] = useState<Event | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if this session already dismissed the banner
    const isDismissed = sessionStorage.getItem("eventBannerDismissed");
    if (isDismissed) {
      setDismissed(true);
      return;
    }

    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const now = new Date();

        const upcoming: Event[] = snapshot.docs
          .map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Event, "id">) }))
          .filter((e) => {
            if (e.status !== "upcoming") return false;
            try {
              return new Date(e.date) >= now;
            } catch {
              return false;
            }
          })
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

        // Use nearest Firestore event
        setEvent(upcoming.length > 0 ? upcoming[0] : null);
      } catch (err) {
        console.error("EventBanner: failed to fetch events", err);
        setEvent(null);
      }
    };

    fetchEvents();
  }, []);

  // Initialize Luma checkout widget and dynamic script binding
  useEffect(() => {
    if (event && !dismissed) {
      initLumaCheckout();
    }
  }, [event, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("eventBannerDismissed", "true");
  };

  // Format a short date like "Jun 15"
  const formatShortDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("default", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <AnimatePresence>
      {event && !dismissed && (
        <motion.div
          key="event-banner"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden w-full z-[60] relative"
          style={{ fontFamily: "var(--font-poppins), sans-serif" }}
        >
          <div className="bg-[#FF5C7A] w-full pl-4 pr-11 sm:px-6 py-2.5 flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 relative">
            {/* Calendar icon */}
            <Calendar size={14} className="text-white/80 shrink-0" />

            {/* Text */}
            <p className="text-white text-xs sm:text-sm font-semibold text-center leading-tight">
              {event.date && (
                <span className="opacity-75 mr-2">
                  {formatShortDate(event.date)} ·
                </span>
              )}
              {event.title}
            </p>

            {/* Register button — pulsing to attract attention */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                boxShadow: [
                  "0 0 0px 0px rgba(255,209,102,0)",
                  "0 0 10px 4px rgba(255,209,102,0.7)",
                  "0 0 0px 0px rgba(255,209,102,0)",
                ],
              }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="shrink-0 rounded-full"
            >
              {event.registrationUrl ? (
                (() => {
                  const finalUrl = parseLumaUrl(event.registrationUrl)!;
                  const isLuma = finalUrl.includes("lu.ma");
                  const eventIdMatch = finalUrl.match(/evt-[a-zA-Z0-9]+/);
                  const lumaEventId = isLuma && eventIdMatch ? eventIdMatch[0] : undefined;
                  return (
                    <a
                      href={finalUrl}
                      target={isLuma ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className={`block bg-[#FFC107] text-[#111827] text-[10px] sm:text-xs font-black uppercase tracking-wide px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full hover:bg-yellow-300 transition-colors whitespace-nowrap ${
                        isLuma ? "luma-checkout--button" : ""
                      }`}
                      data-luma-action={isLuma ? "checkout" : undefined}
                      data-luma-event-id={lumaEventId}
                    >
                      Register Now
                    </a>
                  );
                })()
              ) : (
                <Link
                  href={`/events#${event.id}`}
                  className="block bg-[#FFC107] text-[#111827] text-[10px] sm:text-xs font-black uppercase tracking-wide px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full hover:bg-yellow-300 transition-colors whitespace-nowrap"
                >
                  Register Now
                </Link>
              )}
            </motion.div>

            {/* Dismiss */}
            <button
              onClick={handleDismiss}
              aria-label="Dismiss banner"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-1.5 cursor-pointer shrink-0"
            >
              <X size={15} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
