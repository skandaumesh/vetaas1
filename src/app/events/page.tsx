"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
} from "lucide-react";
import Image from "next/image";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.substring(1); // remove '#'
        setHighlightedId(id);
        
        // Scroll to element after state change
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);

        // Auto clear highlight after 3 seconds
        const timer = setTimeout(() => {
          setHighlightedId(null);
        }, 3000);
        return () => clearTimeout(timer);
      }
    };

    // Run on mount
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        eventsData.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const upcomingEvents = events.filter((e) => e.status === "upcoming");
  const pastEvents = events.filter((e) => e.status === "completed");

  return (
    <div className="min-h-screen bg-[#faf9f7] pt-[calc(var(--header-height)+3rem)] pb-24 relative z-10 font-sans">

      {/* ── Page Header ── */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#36ba98] mb-5">
            What's happening
          </p>

          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b-2 border-[#111827]">
            <h1 className="font-headline text-6xl md:text-8xl text-[#111827] leading-none tracking-tight">
              Events
            </h1>
            <p className="text-base md:text-lg text-gray-500 font-medium max-w-sm md:text-right">
              Fun-filled gatherings where learning meets play and joy meets growth.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16 lg:gap-24">

        {/* Left: Events */}
        <div>

          {/* Upcoming */}
          <Section
            label="Coming Soon"
            loading={loading}
            empty={upcomingEvents.length === 0}
            emptyLabel="No upcoming events right now. Stay tuned!"
          >
            {upcomingEvents.map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                index={i}
                isHighlighted={event.id === highlightedId}
              />
            ))}
          </Section>

          {/* Past */}
          <Section
            label="Memories"
            loading={loading}
            empty={pastEvents.length === 0}
            emptyLabel="No past events yet."
            className="mt-20"
          >
            {pastEvents.map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                index={i}
                isHighlighted={event.id === highlightedId}
                muted
              />
            ))}
          </Section>

        </div>

        {/* Right: Calendar */}
        <div className="hidden lg:block">
          <div className="sticky top-32">
            <RealCalendar events={events} />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Section wrapper ── */
function Section({
  label,
  loading,
  empty,
  emptyLabel,
  children,
  className = "",
}: {
  label: string;
  loading: boolean;
  empty: boolean;
  emptyLabel: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {/* Section label */}
      <div className="flex items-center gap-4 mb-10">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
          {label}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {loading ? (
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse flex gap-6 py-6 border-b border-gray-100">
              <div className="w-16 shrink-0">
                <div className="h-14 bg-gray-100 rounded" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : empty ? (
        <p className="text-gray-400 font-medium py-8">{emptyLabel}</p>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}

/* ── Share Button ── */
function ShareButton({ event }: { event: any }) {
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = event.registrationUrl 
      ? event.registrationUrl 
      : `${window.location.origin}/events#${event.id}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#36ba98] transition-colors p-1"
      title="Copy registration link"
    >
      {copied ? (
        <>
          <Check size={13} className="text-[#36ba98]" />
          <span className="text-[10px] text-[#36ba98] uppercase tracking-wider font-bold">Copied</span>
        </>
      ) : (
        <>
          <Share2 size={13} />
          <span className="text-[10px] uppercase tracking-wider">Share</span>
        </>
      )}
    </button>
  );
}

/* ── Editorial Event Card ── */
function EventCard({
  event,
  index,
  isHighlighted = false,
  muted = false,
}: {
  event: any;
  index: number;
  isHighlighted?: boolean;
  muted?: boolean;
}) {
  let day = "01";
  let monthStr = "Jan";
  let yearStr = "";
  let formattedFull = event.date;

  try {
    const dateObj = new Date(event.date);
    if (!isNaN(dateObj.getTime())) {
      day = String(dateObj.getDate()).padStart(2, "0");
      monthStr = dateObj.toLocaleString("default", { month: "short" }).toUpperCase();
      yearStr = String(dateObj.getFullYear());
      formattedFull = dateObj.toLocaleString("default", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  } catch (e) {}

  const isCompleted = event.status === "completed";

  return (
    <motion.div
      id={event.id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Divider top */}
      <div className="h-px bg-gray-100 w-full" />

      <div className={`group flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 py-6 sm:py-7 px-4 -mx-4 rounded-3xl cursor-default transition-all duration-500 ${
        isHighlighted ? "bg-[#36ba98]/5 ring-2 ring-[#36ba98]/20" : ""
      }`}>

        {/* Date, Title, Image Row */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1 min-w-0">
          {/* Big date numerals */}
          <div className="shrink-0 w-14 sm:w-20 text-center select-none">
            <p
              className="font-headline leading-none font-black text-3xl sm:text-5xl md:text-6xl"
              style={{
                color: muted ? "#d1d5db" : "#111827",
                transition: "color 0.3s",
              }}
            >
              {day}
            </p>
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1">
              {monthStr}
            </p>
            <p className="text-[9px] sm:text-[10px] font-medium text-gray-300 mt-0.5 sm:mt-1">{yearStr}</p>
          </div>

          {/* Vertical rule */}
          <div className="hidden sm:block w-px self-stretch bg-gray-100 group-hover:bg-[#36ba98] transition-colors duration-300" />

          {/* Thumbnail (if image exists) */}
          {event.image && (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 relative border border-gray-100 sm:order-none order-last ml-auto sm:ml-0">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          )}

          {/* Details */}
          <div className="flex-1 min-w-0">
            {/* Status badge */}
            <span
              className={`inline-block text-[9px] font-black uppercase tracking-[0.25em] mb-1.5 px-2 py-0.5 rounded-full ${
                isCompleted
                  ? "bg-gray-100 text-gray-400"
                  : "bg-[#36ba98]/10 text-[#2a9d7e]"
              }`}
            >
              {isCompleted ? "Completed" : "Upcoming"}
            </span>

            <h3
              className="font-headline text-lg sm:text-xl md:text-2xl text-[#111827] mb-1.5 leading-snug group-hover:text-[#36ba98] transition-colors duration-300 line-clamp-2 sm:truncate"
              title={event.title}
            >
              {event.title}
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-1 sm:gap-x-5 text-xs font-medium text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {formattedFull}
              </span>
              {event.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} />
                  {event.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CTA Container */}
        <div className="flex flex-row items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-3 pt-4 sm:pt-0 border-t border-gray-50 sm:border-t-0 sm:shrink-0">
          {isCompleted ? (
            event.highlightsUrl ? (
              <a
                href={event.highlightsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#111827] border-b-2 border-[#111827] pb-0.5 hover:text-[#36ba98] hover:border-[#36ba98] transition-colors duration-200"
              >
                Highlights <ExternalLink size={12} />
              </a>
            ) : null
          ) : (
            <>
              {event.registrationUrl ? (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#36ba98] border-b-2 border-[#36ba98] pb-0.5 hover:text-[#111827] hover:border-[#111827] transition-colors duration-200"
                >
                  Register <ExternalLink size={12} />
                </a>
              ) : (
                <Link
                  href={`/contact?event=${encodeURIComponent(event.title)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#36ba98] border-b-2 border-[#36ba98] pb-0.5 hover:text-[#111827] hover:border-[#111827] transition-colors duration-200"
                >
                  Register <ArrowRight size={12} />
                </Link>
              )}
              <ShareButton event={event} />
            </>
          )}
        </div>
      </div>

      {/* Divider bottom (last item) */}
      <div className="h-px bg-gray-100 w-full" />
    </motion.div>
  );
}

/* ── Calendar ── */
function RealCalendar({ events }: { events: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const days = ["Su","Mo","Tu","We","Th","Fr","Sa"];

  const activeDays = events.reduce((acc, event) => {
    try {
      const d = new Date(event.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        acc.push(d.getDate());
      }
    } catch (e) {}
    return acc;
  }, [] as number[]);

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;
  const todayDay = today.getDate();

  const cells = [];
  for (let i = 0; i < startDay; i++) {
    cells.push(<div key={`empty-${i}`} />);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const isActive = activeDays.includes(i);
    const isToday = isCurrentMonth && i === todayDay;

    cells.push(
      <div
        key={`day-${i}`}
        className={`
          flex items-center justify-center w-9 h-9 mx-auto rounded-full text-xs font-bold transition-all duration-200
          ${isActive ? "bg-[#111827] text-white shadow-lg scale-110" : ""}
          ${isToday && !isActive ? "ring-2 ring-[#36ba98] text-[#111827]" : ""}
          ${!isActive && !isToday ? "text-gray-500 hover:bg-gray-100" : ""}
        `}
      >
        {i}
        {isActive && (
          <span className="sr-only"> (event)</span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-black text-[#111827] uppercase tracking-widest">
          {monthNames[month]} {year}
        </span>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Grid */}
      <div className="p-5">
        <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center">
          {days.map((d) => (
            <div key={d} className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">
              {d}
            </div>
          ))}
          {cells}
        </div>

        {/* Legend */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#111827]" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Event day</span>
        </div>
      </div>
    </div>
  );
}
