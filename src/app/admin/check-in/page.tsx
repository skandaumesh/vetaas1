"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdminAuth } from "@/components/admin/AdminGate";
import TicketScanner, { type ScanResult } from "@/components/admin/TicketScanner";
import type { FormDoc, FormResponseDoc } from "@/lib/forms";
import {
  eventWhen,
  isEventForm,
  registrantEmail,
  registrantName,
  tokenFromScan,
  type TicketDoc,
} from "@/lib/tickets";
import { CheckCircle2, Loader2, ScanLine, Search, Undo2, Users } from "lucide-react";

interface EventRow extends FormDoc {
  id: string;
}
interface Guest extends FormResponseDoc {
  id: string;
}

const EVENT_KEY = "checkinEvent";
const today = () => new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10);

const timeOf = (t?: { seconds: number } | null) =>
  t ? new Date(t.seconds * 1000).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) : "";

const guestName = (g: Guest) => registrantName(g.answers) || registrantEmail(g.answers) || g.payerEmail || "Guest";
const guestEmail = (g: Guest) => registrantEmail(g.answers) || g.payerEmail || "";
const isGoing = (g: Guest) => !g.paymentStatus || g.paymentStatus === "paid";

export default function CheckInPage() {
  const { user } = useAdminAuth();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [eventId, setEventId] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [search, setSearch] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const processing = useRef(false);
  const lastScan = useRef<{ value: string; at: number } | null>(null);

  // Event forms, upcoming first (soonest at the top), then past ones.
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const snap = await getDocs(collection(db, "forms"));
        const rows = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as FormDoc) }))
          .filter((f) => isEventForm(f));
        const now = today();
        const upcoming = rows
          .filter((f) => (f.eventDate || "9999") >= now)
          .sort((a, b) => (a.eventDate || "9999").localeCompare(b.eventDate || "9999"));
        const past = rows
          .filter((f) => (f.eventDate || "9999") < now)
          .sort((a, b) => (b.eventDate || "").localeCompare(a.eventDate || ""));
        const ordered = [...upcoming, ...past];
        setEvents(ordered);
        let saved = "";
        try {
          saved = localStorage.getItem(EVENT_KEY) ?? "";
        } catch {}
        setEventId(ordered.some((e) => e.id === saved) ? saved : ordered[0]?.id ?? "");
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoadingEvents(false);
      }
    })();
  }, [user]);

  // Live guest list, so two phones at the door stay in step.
  useEffect(() => {
    if (!user || !eventId) return;
    setLoadingGuests(true);
    try {
      localStorage.setItem(EVENT_KEY, eventId);
    } catch {}
    const unsubscribe = onSnapshot(
      query(collection(db, "formResponses"), where("formId", "==", eventId)),
      (snap) => {
        setGuests(
          snap.docs.map((d) => ({ id: d.id, ...(d.data({ serverTimestamps: "estimate" }) as FormResponseDoc) }))
        );
        setLoadingGuests(false);
      },
      (err) => {
        console.error("Failed to load guests:", err);
        setLoadingGuests(false);
      }
    );
    return () => unsubscribe();
  }, [user, eventId]);

  useEffect(() => {
    if (!result || result.tone === "busy") return;
    const t = window.setTimeout(() => setResult(null), 3500);
    return () => window.clearTimeout(t);
  }, [result]);

  const event = events.find((e) => e.id === eventId) ?? null;
  const when = event ? eventWhen(event) : null;

  const going = guests.filter(isGoing);
  const checkedIn = going.filter((g) => g.checkedInAt);
  const unpaid = guests.filter((g) => !isGoing(g));

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return guests
      .filter((g) => {
        if (!q) return true;
        const haystack = [guestName(g), guestEmail(g), g.payerPhone ?? "", ...(g.answers ?? []).map((a) => String(a.value ?? ""))]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => {
        const rank = (g: Guest) => (!isGoing(g) ? 2 : g.checkedInAt ? 1 : 0);
        return rank(a) - rank(b) || guestName(a).localeCompare(guestName(b));
      });
  }, [guests, search]);

  const toggleCheckIn = async (g: Guest) => {
    setToggling(g.id);
    const value = g.checkedInAt ? null : serverTimestamp();
    try {
      await updateDoc(doc(db, "formResponses", g.id), { checkedInAt: value });
      if (g.ticketToken) {
        // Older registrations may have no ticket document; the guest list is
        // the record that matters, so a missing ticket isn't an error.
        await updateDoc(doc(db, "tickets", g.ticketToken), { checkedInAt: value }).catch(() => {});
      }
    } catch (err) {
      console.error("Check-in failed:", err);
      alert("Couldn't update check-in. Check the internet connection and try again.");
    } finally {
      setToggling(null);
    }
  };

  const handleDetected = useCallback(
    async (text: string) => {
      if (processing.current) return;
      const now = Date.now();
      // The camera sees the same code many times a second; act on it once.
      if (lastScan.current && lastScan.current.value === text && now - lastScan.current.at < 4000) return;
      lastScan.current = { value: text, at: now };

      const token = tokenFromScan(text);
      if (!token) {
        setResult({ tone: "error", title: "Not a Vetaas ticket", detail: "This QR code isn't a ticket link." });
        navigator.vibrate?.([80, 60, 80]);
        return;
      }

      processing.current = true;
      setResult({ tone: "busy", title: "Checking ticket…" });
      try {
        const ticketSnap = await getDoc(doc(db, "tickets", token));
        if (!ticketSnap.exists()) {
          setResult({ tone: "error", title: "Ticket not found", detail: "It may belong to a deleted registration." });
          navigator.vibrate?.([80, 60, 80]);
          return;
        }
        const ticket = ticketSnap.data() as TicketDoc;
        if (ticket.formId !== eventId) {
          const other = events.find((e) => e.id === ticket.formId)?.title;
          setResult({
            tone: "error",
            title: "Ticket for a different event",
            detail: other ? `This ticket is for ${other}.` : "Switch events to check this person in.",
          });
          navigator.vibrate?.([80, 60, 80]);
          return;
        }

        const responseRef = doc(db, "formResponses", ticket.responseId);
        const outcome = await runTransaction(db, async (tx) => {
          const snap = await tx.get(responseRef);
          if (!snap.exists()) return { kind: "deleted" as const, name: ticket.name || "Guest" };
          const r = snap.data() as FormResponseDoc;
          const name = registrantName(r.answers) || ticket.name || r.payerEmail || "Guest";
          if (r.paymentStatus && r.paymentStatus !== "paid") return { kind: "unpaid" as const, name };
          if (r.checkedInAt) return { kind: "already" as const, name, at: r.checkedInAt };
          tx.update(responseRef, { checkedInAt: serverTimestamp() });
          tx.update(doc(db, "tickets", token), { checkedInAt: serverTimestamp() });
          return { kind: "ok" as const, name };
        });

        if (outcome.kind === "ok") {
          setResult({ tone: "ok", title: `Checked in: ${outcome.name}`, detail: "Welcome in!" });
          navigator.vibrate?.(120);
        } else if (outcome.kind === "already") {
          setResult({
            tone: "warn",
            title: "Already checked in",
            detail: `${outcome.name} · at ${timeOf(outcome.at)}`,
          });
          navigator.vibrate?.([60, 60, 60]);
        } else if (outcome.kind === "unpaid") {
          setResult({ tone: "warn", title: "Payment not completed", detail: outcome.name });
          navigator.vibrate?.([60, 60, 60]);
        } else {
          setResult({ tone: "error", title: "Registration was deleted", detail: outcome.name });
          navigator.vibrate?.([80, 60, 80]);
        }
      } catch (err) {
        console.error("Scan failed:", err);
        setResult({ tone: "error", title: "Couldn't check in", detail: "Check the internet connection and scan again." });
      } finally {
        processing.current = false;
      }
    },
    [eventId, events]
  );

  if (loadingEvents) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#7C3AED]" size={28} />
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 md:py-10 px-4 md:px-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-[2.15rem] font-semibold tracking-[-0.02em] text-slate-900">
            Check-in <span className="text-slate-300">at the door</span>
          </h1>
          <p className="text-sm text-slate-400">Scan ticket QR codes, or find people in the guest list.</p>
        </div>

        {events.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center text-slate-400">
            No events yet. A form becomes an event once it has a date or location.
          </div>
        ) : (
          <>
            <div className="glass-card rounded-2xl p-5 mb-4">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5" htmlFor="event">
                Event
              </label>
              <select
                id="event"
                value={eventId}
                onChange={(e) => {
                  setEventId(e.target.value);
                  setSearch("");
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-[#111827] focus:outline-none focus:border-[#7C3AED] cursor-pointer"
              >
                {events.map((e) => {
                  const w = eventWhen(e);
                  return (
                    <option key={e.id} value={e.id}>
                      {e.title || "Untitled event"}
                      {w ? ` · ${w.full}` : ""}
                    </option>
                  );
                })}
              </select>
              {event && (
                <p className="text-xs text-slate-400 mt-2">
                  {[when?.full, when?.time, event.location].filter(Boolean).join(" · ")} ·{" "}
                  <Link href={`/admin/forms/${event.id}/responses`} className="font-semibold text-[#7C3AED]">
                    All responses
                  </Link>
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="glass-card rounded-2xl p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Going</p>
                <p className="text-2xl font-bold text-[#111827] tabular-nums">{going.length}</p>
              </div>
              <div className="glass-card rounded-2xl p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Checked in</p>
                <p className="text-2xl font-bold text-[#111827] tabular-nums">
                  {checkedIn.length}
                  <span className="text-sm text-gray-400 font-semibold"> / {going.length}</span>
                </p>
                <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${going.length ? (checkedIn.length / going.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="glass-card rounded-2xl p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Not paid</p>
                <p className="text-2xl font-bold text-[#111827] tabular-nums">{unpaid.length}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setResult(null);
                lastScan.current = null;
                setScanning(true);
              }}
              disabled={!eventId}
              className="w-full mb-6 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#7C3AED] text-white font-bold text-base hover:bg-[#6D28D9] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <ScanLine size={20} /> Scan tickets
            </button>

            <div className="relative mb-3">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guests by name, email or phone"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            {loadingGuests ? (
              <div className="flex justify-center py-16">
                <Loader2 className="animate-spin text-[#7C3AED]" size={24} />
              </div>
            ) : visible.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Users className="mx-auto mb-2 text-gray-300" size={32} />
                {guests.length === 0 ? "No registrations yet." : "No one matches that search."}
              </div>
            ) : (
              <ul className="space-y-2">
                {visible.map((g) => {
                  const goingNow = isGoing(g);
                  return (
                    <li key={g.id} className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#111827] truncate">{guestName(g)}</p>
                        <p className="text-xs text-gray-400 truncate">
                          {[guestEmail(g), g.payerPhone].filter(Boolean).join(" · ") || "No contact details"}
                        </p>
                      </div>
                      {!goingNow ? (
                        <span className="shrink-0 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-bold">
                          Not paid
                        </span>
                      ) : g.checkedInAt ? (
                        <button
                          onClick={() => toggleCheckIn(g)}
                          disabled={toggling === g.id}
                          title="Undo check-in"
                          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer disabled:opacity-60"
                        >
                          {toggling === g.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                          {timeOf(g.checkedInAt)}
                          <Undo2 size={12} className="opacity-60" />
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleCheckIn(g)}
                          disabled={toggling === g.id}
                          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#111827] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer disabled:opacity-60"
                        >
                          {toggling === g.id && <Loader2 size={14} className="animate-spin" />}
                          Check in
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>

      {scanning && (
        <TicketScanner onDetected={handleDetected} onClose={() => setScanning(false)} result={result} />
      )}
    </main>
  );
}
