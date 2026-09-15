// Event tickets: the pieces shared by the public form, the ticket page and the
// admin check-in scanner. The Cloud Functions have a plain-JS copy of the
// registrant helpers in functions/registrationEmail.js — keep them in sync.

import type { FormAnswer, FormDoc } from "@/lib/forms";

export const SITE_URL = "https://www.vetaas.in";

/**
 * A ticket lives at tickets/{token}. The token is 256 random bits, so the
 * document can be read by anyone holding the link but never listed or guessed
 * (see firestore.rules).
 */
export interface TicketDoc {
  responseId: string;
  formId: string;
  name: string;
  status: "confirmed" | "pending";
  amount?: number;
  checkedInAt?: { seconds: number } | null;
}

export const TICKET_TOKEN_RE = /^[a-f0-9]{64}$/;

export function newTicketToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Always the live site, so a QR made on a dev machine still scans at the door. */
export const ticketUrl = (token: string) => `${SITE_URL}/ticket/${token}`;

/** Accepts a scanned ticket link or a bare token. */
export function tokenFromScan(text: string): string | null {
  const trimmed = text.trim();
  const fromUrl = /\/ticket\/([a-f0-9]{64})(?:[/?#]|$)/i.exec(trimmed);
  if (fromUrl) return fromUrl[1].toLowerCase();
  return TICKET_TOKEN_RE.test(trimmed) ? trimmed : null;
}

export const isEventForm = (form: Pick<FormDoc, "eventDate" | "location">) =>
  !!(form.eventDate?.trim() || form.location?.trim());

/** Off for plain forms unless switched on; on for events unless switched off. */
export const confirmationEnabled = (form: FormDoc) =>
  typeof form.confirmationEmail === "boolean" ? form.confirmationEmail : isEventForm(form);

const STRICT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NOT_THE_REGISTRANT = /child|kid|son|daughter|student|school|company|organi[sz]ation/i;

export function registrantEmail(answers: FormAnswer[] = []): string {
  const candidates = answers.filter(
    (a) => typeof a.value === "string" && STRICT_EMAIL.test(a.value.trim())
  );
  const pick = candidates.find((a) => /mail/i.test(a.label || "")) ?? candidates[0];
  return pick ? (pick.value as string).trim().toLowerCase() : "";
}

export function registrantName(answers: FormAnswer[] = []): string {
  const pick = answers.find(
    (a) =>
      typeof a.value === "string" &&
      a.value.trim() &&
      /name/i.test(a.label || "") &&
      !NOT_THE_REGISTRANT.test(a.label || "") &&
      !STRICT_EMAIL.test(a.value.trim())
  );
  return pick ? (pick.value as string).trim().slice(0, 80) : "";
}

/** Whether the questions include somewhere to put an email address. */
export const formAsksForEmail = (form: Pick<FormDoc, "fields">) =>
  form.fields.some((f) => f.type === "email" || /mail/i.test(f.label || ""));

const to12h = (hhmm?: string) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm ?? "");
  if (!m) return "";
  const h = Number(m[1]);
  return `${h % 12 === 0 ? 12 : h % 12}:${m[2]} ${h < 12 ? "AM" : "PM"}`;
};

/** Date and time as the event page and ticket show them (always IST). */
export function eventWhen(form: Pick<FormDoc, "eventDate" | "eventStart" | "eventEnd">) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(form.eventDate?.trim() ?? "");
  if (!m) return null;
  const day = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  const fmt = (opts: Intl.DateTimeFormatOptions) =>
    day.toLocaleDateString("en-US", { timeZone: "UTC", ...opts });
  const start = to12h(form.eventStart);
  const end = to12h(form.eventEnd);
  return {
    month: fmt({ month: "short" }).toUpperCase(),
    day: Number(m[3]),
    full: fmt({ weekday: "long", month: "long", day: "numeric" }),
    time: start ? `${start}${end ? ` - ${end}` : ""} GMT+5:30` : "",
  };
}

export const locationText = (form: Pick<FormDoc, "location" | "locationNote">) =>
  [form.location, form.locationNote].map((s) => s?.trim()).filter(Boolean).join(", ");

/** The admin's Google Maps link when it's a real https URL, else a Maps search. */
export function mapLink(form: Pick<FormDoc, "mapUrl" | "location" | "locationNote">): string {
  const url = form.mapUrl?.trim() ?? "";
  if (/^https:\/\/[^\s"'<>]+$/i.test(url)) return url;
  const where = locationText(form);
  return where ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(where)}` : "";
}

export function googleCalendarLink(form: FormDoc, ticket: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(form.eventDate?.trim() ?? "");
  if (!m) return "";
  const dayMs = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const stamp = (ms: number, withTime: boolean) => {
    const iso = new Date(ms).toISOString().replace(/[-:]/g, "");
    return withTime ? `${iso.slice(0, 15)}Z` : iso.slice(0, 8);
  };
  const clock = (hhmm?: string) => {
    const t = /^(\d{1,2}):(\d{2})$/.exec(hhmm ?? "");
    return t ? dayMs + (Number(t[1]) * 60 + Number(t[2]) - 330) * 60000 : null;
  };
  const start = clock(form.eventStart);
  let dates: string;
  if (start === null) {
    dates = `${stamp(dayMs, false)}/${stamp(dayMs + 86400000, false)}`;
  } else {
    let end = clock(form.eventEnd) ?? start + 3600000;
    if (end <= start) end += 86400000;
    dates = `${stamp(start, true)}/${stamp(end, true)}`;
  }
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: form.title || "Vetaas event",
    dates,
    details: `Your ticket: ${ticket}`,
    location: locationText(form),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
