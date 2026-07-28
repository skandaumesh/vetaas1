"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { parseLumaUrl, initLumaCheckout, formatShortDateRange } from "@/lib/luma";

interface Event {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  status: string;
  registrationUrl?: string;
}

const ROTATE_MS = 5000;

function RegisterButton({ event }: { event: Event }) {
  if (event.registrationUrl) {
    const finalUrl = parseLumaUrl(event.registrationUrl)!;
    const isLuma = finalUrl.includes("lu.ma");
    const eventIdMatch = finalUrl.match(/evt-[a-zA-Z0-9]+/);
    const lumaEventId = isLuma && eventIdMatch ? eventIdMatch[0] : undefined;
    return (
      <a
        href={finalUrl}
        target={isLuma ? undefined : "_blank"}
        rel="noopener noreferrer"
        className="block bg-[#FFC107] text-[#111827] text-[10px] sm:text-xs font-black uppercase tracking-wide px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full hover:brightness-105 transition-all whitespace-nowrap"
        data-luma-action={isLuma ? "checkout" : undefined}
        data-luma-event-id={lumaEventId}
      >
        Register Now
      </a>
    );
  }
  return (
    <Link
      href={`/events#${event.id}`}
      className="block bg-[#FFC107] text-[#111827] text-[10px] sm:text-xs font-black uppercase tracking-wide px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full hover:brightness-105 transition-all whitespace-nowrap"
    >
      Register Now
    </Link>
  );
}

export default function EventBanner() {
  const [events, setEvents] = useState<Event[]>([]);
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("eventBannerDismissed")) {
      setDismissed(true);
      return;
    }
    (async () => {
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming: Event[] = snapshot.docs
          .map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Event, "id">) }))
          .filter((e) => {
            const checkDate = e.endDate || e.date;
            if (!checkDate) return false;
            try {
              const d = new Date(checkDate);
              d.setHours(0, 0, 0, 0);
              return d >= today;
            } catch {
              return false;
            }
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setEvents(upcoming);
      } catch (err) {
        console.warn("EventBanner: failed to fetch events", err);
        setEvents([]);
      }
    })();
  }, []);

  // Auto-rotate through all upcoming events (paused on hover)
  useEffect(() => {
    if (events.length <= 1 || paused || dismissed) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % events.length),
      ROTATE_MS
    );
    return () => clearInterval(t);
  }, [events.length, paused, dismissed]);

  const safeIndex = events.length ? index % events.length : 0;
  const event = events[safeIndex];

  // Re-bind Luma checkout whenever the visible event changes
  useEffect(() => {
    if (event && !dismissed) initLumaCheckout();
  }, [event, dismissed]);

  const dots = useMemo(
    () => Array.from({ length: events.length }, (_, i) => i),
    [events.length]
  );

  const go = (dir: number) =>
    setIndex((i) => (i + dir + events.length) % events.length);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("eventBannerDismissed", "true");
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
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative w-full bg-[#FF5C7A] overflow-hidden">
            {/* Sweeping shine */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              initial={{ x: "-150%" }}
              animate={{ x: "350%" }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.6 }}
            />
            {/* Decorative sparkles */}
            <Sparkles size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hidden sm:block" />
            <Sparkles size={11} className="pointer-events-none absolute left-[46%] top-1.5 text-white/30 hidden md:block" />

            <div className="relative w-full pl-4 pr-11 sm:px-10 py-2.5 flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3">
              {/* Prev arrow (multi-event only) */}
              {events.length > 1 && (
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous event"
                  className="hidden sm:flex items-center justify-center text-white/70 hover:text-white transition-colors shrink-0 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
              )}

              {/* Rotating event content */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="flex items-center gap-2 sm:gap-3 min-w-0"
                  >
                    {/* Date pill */}
                    {event.date && (
                      <span className="hidden sm:inline-flex items-center gap-1.5 bg-white/15 text-white rounded-full px-3 py-0.5 text-xs font-bold shrink-0">
                        <Calendar size={12} className="text-white/90" />
                        {formatShortDateRange(event.date, event.endDate)}
                      </span>
                    )}
                    {/* Title */}
                    <p className="text-white text-xs sm:text-sm font-semibold text-center leading-tight truncate">
                      {event.date && (
                        <span className="opacity-80 mr-1.5 sm:hidden">
                          {formatShortDateRange(event.date, event.endDate)} ·
                        </span>
                      )}
                      {event.title}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Register button (pulsing) */}
                <motion.div
                  animate={{
                    scale: [1, 1.06, 1],
                    boxShadow: [
                      "0 0 0px 0px rgba(255,193,7,0)",
                      "0 0 10px 3px rgba(255,193,7,0.6)",
                      "0 0 0px 0px rgba(255,193,7,0)",
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="shrink-0 rounded-full"
                >
                  <RegisterButton event={event} />
                </motion.div>
              </div>

              {/* Next arrow (multi-event only) */}
              {events.length > 1 && (
                <button
                  onClick={() => go(1)}
                  aria-label="Next event"
                  className="hidden sm:flex items-center justify-center text-white/70 hover:text-white transition-colors shrink-0 cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              )}

              {/* Dots (multi-event only) */}
              {events.length > 1 && (
                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  {dots.map((i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      aria-label={`Show event ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        i === safeIndex ? "w-4 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Dismiss */}
              <button
                onClick={handleDismiss}
                aria-label="Dismiss banner"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-1.5 cursor-pointer shrink-0"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
