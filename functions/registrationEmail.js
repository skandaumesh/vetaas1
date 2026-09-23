// Registration confirmation email for forms and events: a plain message with
// the event details and two buttons — the ticket QR stays on the ticket page.
// Plain module (no Firebase) so it can be rendered and checked locally.
// Mirrors the helpers in src/lib/tickets.ts; keep the two in sync.

const SITE_URL = "https://www.vetaas.in";
const LOGO_URL = "https://www.vetaas.in/logo.jpeg"; // swapped for an embedded image by sendMail
const PIN_URL = "https://www.vetaas.in/email/pin.png"; // the site's map-pin icon, same treatment
const IST_OFFSET_MIN = 330;

const STRICT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NOT_THE_REGISTRANT = /child|kid|son|daughter|student|school|company|organi[sz]ation/i;

const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const isEventForm = (form) => !!((form.eventDate || "").trim() || (form.location || "").trim());

/** Off for plain forms unless the admin switched it on; on for events unless switched off. */
const confirmationEnabled = (form) =>
  typeof form.confirmationEmail === "boolean" ? form.confirmationEmail : isEventForm(form);

/** The address to write to: an answer that looks like an email, preferring one labelled as such. */
function registrantEmail(answers) {
  const candidates = (answers || []).filter(
    (a) => typeof a.value === "string" && STRICT_EMAIL.test(a.value.trim())
  );
  const labelled = candidates.find((a) => /mail/i.test(a.label || ""));
  const pick = labelled || candidates[0];
  return pick ? pick.value.trim().toLowerCase() : "";
}

/** "Your name" style answer — skipping a child's or school's name. */
function registrantName(answers) {
  const pick = (answers || []).find(
    (a) =>
      typeof a.value === "string" &&
      a.value.trim() &&
      /name/i.test(a.label || "") &&
      !NOT_THE_REGISTRANT.test(a.label || "") &&
      !STRICT_EMAIL.test(a.value.trim())
  );
  return pick ? pick.value.trim().slice(0, 80) : "";
}

const to12h = (hhmm) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm || "");
  if (!m) return "";
  const h = Number(m[1]);
  return `${h % 12 === 0 ? 12 : h % 12}:${m[2]} ${h < 12 ? "AM" : "PM"}`;
};

const pad = (n) => String(n).padStart(2, "0");
const utcStamp = (ms) => {
  const d = new Date(ms);
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`
  );
};
const dateStamp = (ms) => {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
};

/** Everything the email, calendar links and invite need about when the event is. */
function eventTiming(form) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((form.eventDate || "").trim());
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dayMs = Date.UTC(y, mo - 1, d);
  const fmt = (opts) => new Date(dayMs).toLocaleDateString("en-US", { timeZone: "UTC", ...opts });

  const start = to12h(form.eventStart);
  const end = to12h(form.eventEnd);
  const timeLine = start ? `${start}${end ? ` - ${end}` : ""} GMT+5:30` : "";

  let startMs = null;
  let endMs = null;
  const clock = (hhmm) => {
    const t = /^(\d{1,2}):(\d{2})$/.exec(hhmm || "");
    return t ? dayMs + (Number(t[1]) * 60 + Number(t[2]) - IST_OFFSET_MIN) * 60000 : null;
  };
  if (start) {
    startMs = clock(form.eventStart);
    endMs = end ? clock(form.eventEnd) : startMs + 3600000;
    if (endMs <= startMs) endMs += 86400000; // runs past midnight
  }

  return {
    month: fmt({ month: "short" }).toUpperCase(),
    day: String(d),
    dateLine: fmt({ weekday: "long", month: "long", day: "numeric" }),
    timeLine,
    allDay: !start,
    dayMs,
    startMs,
    endMs,
  };
}

const locationText = (form) =>
  [form.location, form.locationNote].map((s) => (s || "").trim()).filter(Boolean).join(", ");

/** The admin's Google Maps link if it's a real https URL, else a Maps search for the address. */
function mapLink(form) {
  const url = (form.mapUrl || "").trim();
  if (/^https:\/\/[^\s"'<>]+$/i.test(url)) return url;
  const where = locationText(form);
  return where ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(where)}` : "";
}

function googleCalendarUrl(form, ticketUrl) {
  const t = eventTiming(form);
  if (!t) return "";
  const dates = t.allDay
    ? `${dateStamp(t.dayMs)}/${dateStamp(t.dayMs + 86400000)}`
    : `${utcStamp(t.startMs)}/${utcStamp(t.endMs)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: form.title || "Vetaas event",
    dates,
    details: ticketUrl ? `Your ticket: ${ticketUrl}` : "",
    location: locationText(form),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const icsText = (s) =>
  String(s ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

const foldIcs = (line) => {
  if (line.length <= 74) return line;
  const parts = [];
  for (let i = 0; i < line.length; i += 73) parts.push(line.slice(i, i + 73));
  return parts.join("\r\n ");
};

/** An .ics invite so Apple Calendar and Outlook users can add it in one tap. */
function buildIcs(form, { uid, ticketUrl, eventUrl }) {
  const t = eventTiming(form);
  if (!t) return "";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Vetaas Education Foundation//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}@vetaas.in`,
    `DTSTAMP:${utcStamp(Date.now())}`,
    ...(t.allDay
      ? [`DTSTART;VALUE=DATE:${dateStamp(t.dayMs)}`, `DTEND;VALUE=DATE:${dateStamp(t.dayMs + 86400000)}`]
      : [`DTSTART:${utcStamp(t.startMs)}`, `DTEND:${utcStamp(t.endMs)}`]),
    `SUMMARY:${icsText(form.title || "Vetaas event")}`,
    ...(locationText(form) ? [`LOCATION:${icsText(locationText(form))}`] : []),
    `DESCRIPTION:${icsText(`Your ticket: ${ticketUrl}\nEvent page: ${eventUrl}`)}`,
    `URL:${eventUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(foldIcs).join("\r\n") + "\r\n";
}

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const nl2br = (s) => escapeHtml(s).replace(/\r?\n/g, "<br />");

/**
 * Plain, Luma-style confirmation: who it's from, what they registered for,
 * when and where, and two buttons. The QR code lives on the ticket page
 * behind "My Ticket" rather than in the message.
 *
 * @param {object} p
 * @param {object} p.form        the form document
 * @param {string} p.formId
 * @param {string} [p.ticketUrl] present for events
 * @param {number} [p.amountPaid] rupees, for paid registrations
 */
function buildRegistrationEmail({ form, formId, ticketUrl, amountPaid }) {
  const title = (form.title || "").trim() || "Vetaas event";
  const eventUrl = `${SITE_URL}/forms/${formId}`;
  const isEvent = isEventForm(form);
  const timing = isEvent ? eventTiming(form) : null;
  const maps = isEvent ? mapLink(form) : "";
  const message = (form.emailMessage || "").trim();
  const subject =
    (form.emailSubject || "").trim() ||
    (isEvent ? `You're registered for ${title}` : `Thanks for your response to ${title}`);

  const p = (text, style) => `<p style="margin:0;${style}">${text}</p>`;
  const divider = '<tr><td style="padding:20px 0;"><div style="border-top:1px solid #ececec;"></div></td></tr>';

  // Icon on the left, two lines of text on the right.
  const row = (tile, body) =>
    '<tr><td>' +
    '<table role="presentation" cellpadding="0" cellspacing="0"><tr>' +
    '<td width="44" valign="top">' + tile + "</td>" +
    '<td style="padding-left:14px;vertical-align:middle;">' + body + "</td>" +
    "</tr></table></td></tr>";

  const dateTile =
    '<table role="presentation" width="44" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;border-collapse:separate;overflow:hidden;">' +
    '<tr><td style="background:#f7f7f8;font-size:9px;font-weight:bold;letter-spacing:1px;color:#9ca3af;text-align:center;padding:3px 0;">' +
    escapeHtml(timing ? timing.month : "") + "</td></tr>" +
    '<tr><td style="font-size:17px;font-weight:bold;color:#111827;text-align:center;padding:4px 0 5px;">' +
    escapeHtml(timing ? timing.day : "") + "</td></tr></table>";

  const pinTile =
    '<table role="presentation" width="44" height="44" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;border-collapse:separate;">' +
    '<tr><td align="center" style="height:42px;vertical-align:middle;">' +
    `<img src="${PIN_URL}" width="18" height="18" alt="" style="display:block;" />` +
    "</td></tr></table>";

  let rows = "";
  if (timing) {
    rows += row(
      dateTile,
      p(escapeHtml(timing.dateLine), "font-size:15px;font-weight:bold;color:#111827;") +
        (timing.timeLine ? p(escapeHtml(timing.timeLine), "font-size:14px;color:#6b7280;margin-top:2px;") : "")
    );
  }
  if (isEvent && (form.location || "").trim()) {
    const name = escapeHtml(form.location.trim()) + " &#8599;";
    rows += (timing ? '<tr><td style="height:14px;"></td></tr>' : "") +
      row(
        pinTile,
        p(
          maps ? `<a href="${escapeHtml(maps)}" style="color:#111827;text-decoration:none;">${name}</a>` : name,
          "font-size:15px;font-weight:bold;color:#111827;"
        ) +
          ((form.locationNote || "").trim()
            ? p(escapeHtml(form.locationNote.trim()), "font-size:14px;color:#6b7280;margin-top:2px;line-height:1.45;")
            : "")
      );
  }
  if (amountPaid > 0) {
    rows +=
      '<tr><td style="padding-top:14px;">' +
      p(`Ticket &middot; ${inr(amountPaid)} paid`, "font-size:14px;color:#6b7280;") +
      "</td></tr>";
  }

  const messageBlock = message
    ? '<tr><td style="padding-top:20px;">' +
      p(nl2br(message), "font-size:15px;color:#374151;line-height:1.65;") +
      "</td></tr>"
    : "";

  const button = (href, label, primary) =>
    `<a href="${escapeHtml(href)}" style="display:inline-block;padding:11px 22px;border-radius:8px;font-size:14px;font-weight:bold;text-decoration:none;` +
    (primary ? "background:#7C3AED;color:#ffffff;" : "background:#f3f4f6;color:#111827;") +
    `">${label}</a>`;

  const buttons = ticketUrl
    ? '<tr><td style="padding-top:22px;">' +
      '<table role="presentation" cellpadding="0" cellspacing="0"><tr>' +
      `<td>${button(eventUrl, "View Event", true)}</td>` +
      `<td style="padding-left:10px;">${button(ticketUrl, "My Ticket", false)}</td>` +
      "</tr></table></td></tr>"
    : "";

  const html =
    '<div style="margin:0;padding:28px 16px;background:#ffffff;font-family:Segoe UI,Helvetica,Arial,sans-serif;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;">' +
    '<tr><td style="padding-bottom:20px;">' +
    `<img src="${LOGO_URL}" width="54" height="58" alt="Vetaas" style="display:block;border-radius:6px;" />` +
    "</td></tr>" +
    "<tr><td>" +
    `<h1 style="margin:0;font-size:24px;line-height:1.3;color:#111827;">${escapeHtml(title)}</h1>` +
    p(
      isEvent ? "You have registered" : "Thanks for your response",
      "font-size:17px;color:#9ca3af;margin-top:6px;"
    ) +
    "</td></tr>" +
    (rows ? divider + rows : "") +
    messageBlock +
    (buttons ? divider.replace("padding:20px 0;", "padding:22px 0 0;") + buttons : "") +
    '<tr><td style="padding-top:28px;">' +
    p(
      `Questions? Just reply to this email. &middot; <a href="${SITE_URL}" style="color:#9ca3af;text-decoration:none;">vetaas.in</a>`,
      "font-size:12px;color:#9ca3af;"
    ) +
    "</td></tr></table></div>";

  const text = [
    title,
    isEvent ? "You have registered" : "Thanks for your response",
    "",
    ...(timing ? [timing.dateLine, ...(timing.timeLine ? [timing.timeLine] : [])] : []),
    ...(isEvent && form.location
      ? [form.location.trim(), ...(form.locationNote ? [form.locationNote.trim()] : []), ...(maps ? [maps] : [])]
      : []),
    ...(amountPaid > 0 ? [`Ticket - ${inr(amountPaid)} paid`] : []),
    "",
    ...(message ? [message, ""] : []),
    ...(ticketUrl ? [`View event: ${eventUrl}`, `My ticket: ${ticketUrl}`, ""] : []),
    "Questions? Just reply to this email.",
    "Vetaas Education Foundation - www.vetaas.in",
  ].join("\n");

  return { subject, html, text };
}

module.exports = {
  SITE_URL,
  STRICT_EMAIL,
  isEventForm,
  confirmationEnabled,
  registrantEmail,
  registrantName,
  eventTiming,
  mapLink,
  googleCalendarUrl,
  buildIcs,
  buildRegistrationEmail,
};
