// Registration confirmation email for forms and events — the Luma-style
// "You have registered for" message with the event details, a QR ticket and
// calendar links. Plain module (no Firebase) so it can be rendered and checked
// locally. Mirrors the helpers in src/lib/tickets.ts; keep the two in sync.

const SITE_URL = "https://www.vetaas.in";
const LOGO_URL = "https://www.vetaas.in/icon.png"; // swapped for an embedded image by sendMail
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
 * @param {object} p
 * @param {object} p.form        the form document
 * @param {string} p.formId
 * @param {string} [p.ticketUrl] present for events
 * @param {number} [p.amountPaid] rupees, for paid registrations
 * @param {boolean} [p.hasQr]    whether a cid:ticket-qr image is attached
 */
function buildRegistrationEmail({ form, formId, ticketUrl, amountPaid, hasQr }) {
  const title = (form.title || "").trim() || "Vetaas event";
  const eventUrl = `${SITE_URL}/forms/${formId}`;
  const isEvent = isEventForm(form);
  const timing = isEvent ? eventTiming(form) : null;
  const maps = isEvent ? mapLink(form) : "";
  const calendar = isEvent && ticketUrl ? googleCalendarUrl(form, ticketUrl) : "";
  const message = (form.emailMessage || "").trim();
  const subject =
    (form.emailSubject || "").trim() ||
    (isEvent ? `You're registered for ${title}` : `Thanks for your response to ${title}`);

  const row = (tile, body) =>
    '<tr><td style="padding:16px 32px 0;">' +
    '<table role="presentation" cellpadding="0" cellspacing="0"><tr>' +
    '<td width="48" valign="top">' + tile + "</td>" +
    '<td style="padding-left:14px;vertical-align:middle;">' + body + "</td>" +
    "</tr></table></td></tr>";

  const dateTile =
    '<table role="presentation" width="48" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;border-collapse:separate;overflow:hidden;">' +
    '<tr><td style="background:#f3f4f6;font-size:10px;font-weight:bold;letter-spacing:1px;color:#6b7280;text-align:center;padding:3px 0;">' +
    escapeHtml(timing?.month || "") + "</td></tr>" +
    '<tr><td style="font-size:19px;font-weight:bold;color:#111827;text-align:center;padding:5px 0 6px;">' +
    escapeHtml(timing?.day || "") + "</td></tr></table>";

  const iconTile = (glyph) =>
    '<table role="presentation" width="48" height="48" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;border-collapse:separate;">' +
    '<tr><td style="text-align:center;font-size:20px;line-height:46px;">' + glyph + "</td></tr></table>";

  const p = (text, style) => `<p style="margin:0;${style}">${text}</p>`;

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
    rows += row(
      iconTile("&#128205;"),
      p(
        maps
          ? `<a href="${escapeHtml(maps)}" style="color:#111827;text-decoration:none;">${name}</a>`
          : name,
        "font-size:15px;font-weight:bold;color:#111827;"
      ) +
        ((form.locationNote || "").trim()
          ? p(escapeHtml(form.locationNote.trim()), "font-size:14px;color:#6b7280;margin-top:2px;line-height:1.45;")
          : "")
    );
  }
  if (amountPaid > 0) {
    rows += row(
      iconTile("&#127915;"),
      p("Ticket confirmed", "font-size:15px;font-weight:bold;color:#111827;") +
        p(`${inr(amountPaid)} paid`, "font-size:14px;color:#6b7280;margin-top:2px;")
    );
  }

  const messageBlock = message
    ? '<tr><td style="padding:22px 32px 0;">' +
      '<div style="background:#f7f5ff;border-radius:12px;padding:16px 18px;font-size:14px;line-height:1.65;color:#374151;">' +
      nl2br(message) +
      "</div></td></tr>"
    : "";

  const qrBlock =
    hasQr && ticketUrl
      ? '<tr><td style="padding:26px 32px 0;text-align:center;">' +
        '<img src="cid:ticket-qr" width="180" height="180" alt="Your ticket QR code" style="display:block;margin:0 auto;border:1px solid #eee;border-radius:12px;" />' +
        p("Show this QR code at the entrance", "font-size:13px;color:#6b7280;margin-top:10px;") +
        "</td></tr>"
      : "";

  const button = (href, label, primary) =>
    `<a href="${escapeHtml(href)}" style="display:block;text-align:center;padding:12px 10px;border-radius:10px;font-size:14px;font-weight:bold;text-decoration:none;` +
    (primary ? "background:#7C3AED;color:#ffffff;border:1px solid #7C3AED;" : "background:#ffffff;color:#111827;border:1px solid #e5e7eb;") +
    `">${label}</a>`;

  const buttons = ticketUrl
    ? '<tr><td style="padding:24px 32px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
      `<td width="50%" style="padding-right:6px;">${button(eventUrl, "Event Page", false)}</td>` +
      `<td width="50%" style="padding-left:6px;">${button(ticketUrl, "My Ticket", true)}</td>` +
      "</tr></table></td></tr>"
    : "";

  const calendarBlock = calendar
    ? '<tr><td style="padding:16px 32px 0;text-align:center;font-size:13px;color:#6b7280;">' +
      `Add to calendar: <a href="${escapeHtml(calendar)}" style="color:#7C3AED;font-weight:bold;text-decoration:none;">Google Calendar</a>` +
      " &middot; Apple / Outlook: open the attached invite</td></tr>"
    : "";

  const html =
    '<div style="margin:0;padding:24px 12px;background:#faf9f6;font-family:Segoe UI,Helvetica,Arial,sans-serif;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:18px;border:1px solid #eee;">' +
    '<tr><td style="padding:28px 32px 0;"><table role="presentation" cellpadding="0" cellspacing="0"><tr>' +
    `<td><img src="${LOGO_URL}" width="36" height="36" alt="Vetaas" style="display:block;border-radius:50%;" /></td>` +
    '<td style="padding-left:10px;font-size:15px;font-weight:bold;color:#111827;">Vetaas</td>' +
    "</tr></table></td></tr>" +
    '<tr><td style="padding:22px 32px 0;">' +
    p(isEvent ? "You have registered for" : "Thanks for your response to", "font-size:15px;color:#6b7280;") +
    `<h1 style="margin:6px 0 0;font-size:26px;line-height:1.25;color:#111827;">${escapeHtml(title)}</h1>` +
    "</td></tr>" +
    rows +
    messageBlock +
    qrBlock +
    buttons +
    calendarBlock +
    '<tr><td style="padding:28px 32px 26px;"><div style="border-top:1px solid #f1f1f1;padding-top:18px;text-align:center;">' +
    p("Questions? Just reply to this email.", "font-size:13px;color:#9ca3af;") +
    p(
      `Vetaas Education Foundation &middot; <a href="${SITE_URL}" style="color:#9ca3af;text-decoration:none;">www.vetaas.in</a>`,
      "font-size:13px;color:#9ca3af;margin-top:4px;"
    ) +
    "</div></td></tr></table></div>";

  const text = [
    isEvent ? "You have registered for" : "Thanks for your response to",
    title,
    "",
    ...(timing ? [timing.dateLine, ...(timing.timeLine ? [timing.timeLine] : []), ""] : []),
    ...(isEvent && form.location ? [form.location.trim(), ...(form.locationNote ? [form.locationNote.trim()] : []), ...(maps ? [maps] : []), ""] : []),
    ...(amountPaid > 0 ? [`Ticket confirmed - ${inr(amountPaid)} paid`, ""] : []),
    ...(message ? [message, ""] : []),
    ...(ticketUrl ? [`My Ticket (show the QR code at the entrance): ${ticketUrl}`, `Event Page: ${eventUrl}`, ""] : []),
    ...(calendar ? [`Add to Google Calendar: ${calendar}`, ""] : []),
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
