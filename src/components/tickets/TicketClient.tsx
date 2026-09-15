"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { FormDoc } from "@/lib/forms";
import {
  TICKET_TOKEN_RE,
  eventWhen,
  googleCalendarLink,
  mapLink,
  ticketUrl,
  type TicketDoc,
} from "@/lib/tickets";
import { ArrowUpRight, CalendarPlus, CheckCircle2, Clock, Loader2, MapPin } from "lucide-react";

// A free registration's ticket is issued by a Cloud Function a moment after
// the form is submitted, so a brand-new link waits this long before giving up.
const WAIT_FOR_TICKET_MS = 20000;

export default function TicketClient({ token }: { token: string }) {
  const valid = TICKET_TOKEN_RE.test(token);
  const [ticket, setTicket] = useState<TicketDoc | null>(null);
  const [form, setForm] = useState<FormDoc | null>(null);
  const [missing, setMissing] = useState(!valid);
  const [qr, setQr] = useState("");

  // Live, so the ticket flips to "Checked in" the moment it's scanned and to
  // "Confirmed" when a payment clears.
  useEffect(() => {
    if (!valid) return;
    const giveUp = window.setTimeout(() => setMissing(true), WAIT_FOR_TICKET_MS);
    const unsubscribe = onSnapshot(
      doc(db, "tickets", token),
      (snap) => {
        if (!snap.exists()) return;
        window.clearTimeout(giveUp);
        setMissing(false);
        setTicket(snap.data() as TicketDoc);
      },
      () => setMissing(true)
    );
    return () => {
      window.clearTimeout(giveUp);
      unsubscribe();
    };
  }, [token, valid]);

  useEffect(() => {
    if (!ticket?.formId) return;
    getDoc(doc(db, "forms", ticket.formId))
      .then((snap) => snap.exists() && setForm(snap.data() as FormDoc))
      .catch((err) => console.error("Could not load event:", err));
  }, [ticket?.formId]);

  useEffect(() => {
    if (!valid) return;
    QRCode.toDataURL(ticketUrl(token), { width: 520, margin: 1, errorCorrectionLevel: "M" })
      .then(setQr)
      .catch(() => setQr(""));
  }, [token, valid]);

  const shell = (content: React.ReactNode) => (
    <main className="min-h-screen form-shell px-4 sm:px-6 pt-8 pb-24">
      <div className="max-w-md mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <Image src="/icon.png" alt="" width={32} height={32} className="rounded-full" />
          <span className="text-sm font-bold text-[#111827]">Vetaas</span>
        </Link>
        {content}
      </div>
    </main>
  );

  if (missing && !ticket) {
    return shell(
      <div className="glass-solid rounded-3xl p-8 text-center">
        <h1 className="text-lg font-bold text-[#111827] mb-2">We couldn&apos;t find this ticket</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Check that the link matches the one in your confirmation email. If you&apos;ve just
          registered, give it a minute and refresh.
        </p>
      </div>
    );
  }

  if (!ticket || !form) {
    return shell(
      <div className="flex flex-col items-center gap-3 py-24 text-sm text-gray-500">
        <Loader2 className="animate-spin text-[#7C3AED]" size={28} />
        Getting your ticket…
      </div>
    );
  }

  const when = eventWhen(form);
  const maps = mapLink(form);
  const calendar = googleCalendarLink(form, ticketUrl(token));
  const pending = ticket.status !== "confirmed";
  const checkedIn = ticket.checkedInAt
    ? new Date(ticket.checkedInAt.seconds * 1000).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return shell(
    <div className="glass-solid rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 pb-5 flex items-start gap-4">
        {form.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={form.logoUrl}
            alt=""
            className="w-16 h-16 aspect-square object-cover rounded-xl border border-gray-100 shrink-0"
          />
        )}
        <div className="min-w-0">
          <p className="text-sm text-gray-500">You have registered for</p>
          <h1 className="text-xl font-bold text-[#111827] leading-snug">{form.title || "Event"}</h1>
        </div>
      </div>

      <div className="px-6">
        {checkedIn ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
            <CheckCircle2 size={14} /> Checked in at {checkedIn}
          </span>
        ) : pending ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
            <Clock size={14} /> Waiting for payment confirmation
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
            <CheckCircle2 size={14} /> Confirmed
          </span>
        )}
      </div>

      {/* QR ticket — scanned at the door */}
      <div className="px-6 pt-6 pb-2 text-center">
        <div
          className={`mx-auto w-full max-w-[260px] aspect-square rounded-2xl border border-gray-100 bg-white p-3 ${
            pending ? "opacity-40" : ""
          }`}
        >
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="Ticket QR code" className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-gray-300" size={24} />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          {pending
            ? "Your QR code works once payment is confirmed. This page updates by itself."
            : "Show this QR code at the entrance."}
        </p>
        {ticket.name && (
          <p className="mt-3 text-sm">
            <span className="text-gray-400">Guest</span>{" "}
            <span className="font-semibold text-[#111827]">{ticket.name}</span>
          </p>
        )}
      </div>

      <div className="px-6 py-5 mt-3 border-t border-gray-100 space-y-4">
        {when && (
          <div className="flex items-center gap-3.5">
            <div className="w-12 shrink-0 rounded-xl border border-gray-200 overflow-hidden text-center bg-white">
              <div className="bg-gray-50 text-[9px] font-bold uppercase tracking-wider text-gray-400 py-0.5">
                {when.month}
              </div>
              <div className="text-lg font-bold text-[#111827] leading-7">{when.day}</div>
            </div>
            <div>
              <p className="font-bold text-[#111827] leading-snug">{when.full}</p>
              {when.time && <p className="text-sm text-gray-500">{when.time}</p>}
            </div>
          </div>
        )}

        {form.location && (
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 shrink-0 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-400">
              <MapPin size={18} />
            </div>
            <div className="min-w-0">
              {maps ? (
                <a
                  href={maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-[#111827] leading-snug hover:underline"
                >
                  {form.location}
                  <ArrowUpRight size={15} className="text-gray-400 shrink-0" />
                </a>
              ) : (
                <p className="font-bold text-[#111827] leading-snug">{form.location}</p>
              )}
              {form.locationNote && <p className="text-sm text-gray-500">{form.locationNote}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-6 grid grid-cols-2 gap-3">
        <Link
          href={`/forms/${ticket.formId}`}
          className="text-center px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-bold text-[#111827] hover:bg-gray-50 transition-colors"
        >
          Event Page
        </Link>
        {calendar ? (
          <a
            href={calendar}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#7C3AED] text-sm font-bold text-white hover:bg-[#6D28D9] transition-colors"
          >
            <CalendarPlus size={16} /> Add to calendar
          </a>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
