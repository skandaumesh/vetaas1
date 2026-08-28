const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret, defineString } = require("firebase-functions/params");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const path = require("path");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const { EMAIL_SUBJECT: MEMBERSHIP_EMAIL_SUBJECT, buildEmailText: buildMembershipEmailText, buildEmailHtml: buildMembershipEmailHtml } = require("./membershipEmail");

admin.initializeApp();

const smtpPassword = defineSecret("SMTP_PASSWORD"); // v3
const razorpayKeyId = defineString("RAZORPAY_KEY_ID");
const razorpayKeySecret = defineSecret("RAZORPAY_KEY_SECRET");
const razorpayWebhookSecret = defineSecret("RAZORPAY_WEBHOOK_SECRET");

const SMTP_HOST = "smtp.hostinger.com";
const SMTP_PORT = 465;
const FROM_ADDRESS = "kirti@vetaas.in";
const FROM_NAME = "Vetaas Education Foundation";

// Replaces the deprecated "Trigger Email" extension: any doc written to the
// `mail` collection ({ to, message: { subject, text | html } }) gets sent via
// the kirti@vetaas.in Hostinger mailbox, and the doc is stamped with the result.
exports.sendMail = onDocumentCreated(
  {
    document: "mail/{id}",
    region: "us-central1",
    secrets: [smtpPassword],
    retry: false,
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const data = snap.data();
    if (!data || !data.to || !data.message || data.delivery) return;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true,
      auth: { user: FROM_ADDRESS, pass: smtpPassword.value() },
    });

    // Swap the remote logo URL for an embedded (CID) image so it displays
    // even when the recipient's mail client blocks remote images.
    const LOGO_URL = "https://www.vetaas.in/icon.png";
    let html = data.message.html || undefined;
    const attachments = [];
    if (html && html.includes(LOGO_URL)) {
      html = html.split(LOGO_URL).join("cid:vetaas-logo");
      attachments.push({
        filename: "vetaas-logo.png",
        path: path.join(__dirname, "logo.png"),
        cid: "vetaas-logo",
      });
    }

    try {
      const info = await transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_ADDRESS}>`,
        to: data.to,
        subject: data.message.subject || "",
        text: data.message.text || undefined,
        html,
        attachments,
      });
      await snap.ref.update({
        delivery: {
          state: "SUCCESS",
          messageId: info.messageId || null,
          time: admin.firestore.FieldValue.serverTimestamp(),
        },
      });
    } catch (err) {
      await snap.ref.update({
        delivery: {
          state: "ERROR",
          error: String(err && err.message ? err.message : err),
          time: admin.firestore.FieldValue.serverTimestamp(),
        },
      });
    }
  }
);

// Daily at 09:00 IST: queue an expiry-reminder email for every approved
// membership that expires within the next 3 days and hasn't been reminded.
// Writing to `mail` hands delivery to the sendMail trigger above.
const REMINDER_WINDOW_DAYS = 3;

exports.sendExpiryReminders = onSchedule(
  { schedule: "every day 09:00", timeZone: "Asia/Kolkata", region: "us-central1" },
  async () => {
    const db = admin.firestore();
    const now = Date.now();
    const windowEnd = now + REMINDER_WINDOW_DAYS * 86400000;

    const snap = await db
      .collection("membershipOrders")
      .where("status", "==", "approved")
      .get();

    for (const docSnap of snap.docs) {
      const o = docSnap.data();
      if (!o.expiresAt || o.reminderSentAt || !o.email) continue;
      const exp = o.expiresAt.toMillis();
      if (exp < now || exp > windowEnd) continue;

      const dateStr = new Date(exp).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      });

      await db.collection("mail").add({
        to: o.email,
        message: {
          subject: `Reminder: ${o.childName}'s Vetaas membership expires on ${dateStr}`,
          text:
            `Dear ${o.parentName},\n\n` +
            `A friendly reminder that ${o.childName}'s Vetaas membership expires on ${dateStr}.\n\n` +
            `To continue without a break, renew anytime at https://www.vetaas.in/services#membership ` +
            `or WhatsApp us at +91 89510 04160 — we'll take care of the rest.\n\n` +
            `We'd love to keep seeing ${o.childName} at the studio!\n\n` +
            `Warm regards,\nVetaas Education Foundation\nwww.vetaas.in`,
        },
        orderId: docSnap.id,
        type: "reminder",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      await docSnap.ref.update({
        reminderSentAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Queued expiry reminder for order ${docSnap.id}`);
    }
  }
);

// Quiz results: fires when a visitor finishes a self-assessment. Emails the
// score to them and drops a lead copy to Vetaas. Delivery via the mail queue.
const QUIZ_ADMIN_EMAIL = "kirti@vetaas.in";
const LOGO_SRC = "https://www.vetaas.in/icon.png"; // swapped to CID by sendMail

exports.sendQuizResult = onDocumentCreated(
  { document: "quizSubmissions/{id}", region: "us-central1" },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const s = snap.data();
    if (!s || !s.email || s.emailedAt) return;

    const db = admin.firestore();
    const pct = Math.round(s.percentage || 0);
    const greeting = s.name ? `Hi ${s.name},` : "Hi there,";
    const sections = Array.isArray(s.sections) ? s.sections : [];

    const barColor = "#7C3AED";
    const sectionRows = sections
      .map(
        (sec) => `
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#374151;">${sec.title}</td>
          <td align="right" style="padding:8px 0;font-size:14px;font-weight:bold;color:#111827;width:56px;">${Math.round(sec.pct || 0)}%</td>
        </tr>
        <tr><td colspan="2" style="padding:0 0 12px;">
          <div style="background:#eef0f2;border-radius:999px;height:8px;width:100%;">
            <div style="background:${barColor};border-radius:999px;height:8px;width:${Math.max(4, Math.round(sec.pct || 0))}%;"></div>
          </div>
        </td></tr>`
      )
      .join("");

    const answerRows = (s.answers || [])
      .map(
        (a) => `
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#6b7280;border-bottom:1px solid #f0f0f0;">${a.question}</td>
          <td align="right" style="padding:6px 0 6px 12px;font-size:13px;color:#111827;font-weight:bold;border-bottom:1px solid #f0f0f0;white-space:nowrap;">${a.answer}</td>
        </tr>`
      )
      .join("");

    const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr>
          <td align="center" bgcolor="#7C3AED" style="background-color:#7C3AED;background-image:linear-gradient(135deg,#7C3AED 0%,#00CDBA 100%);padding:28px 24px;">
            <img src="${LOGO_SRC}" width="56" height="56" alt="Vetaas" style="border-radius:50%;display:block;margin:0 auto 10px;background:#ffffff;" />
            <h1 style="margin:0;font-size:19px;color:#ffffff;">${s.quizName || "Your Assessment Result"}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0 0 18px;font-size:15px;color:#374151;">${greeting}</p>
            <p style="margin:0 0 22px;font-size:15px;color:#374151;line-height:1.6;">Thank you for taking a few minutes to reflect. Here's your result:</p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;margin-bottom:24px;">
              <tr><td align="center" style="padding:24px;">
                <div style="font-size:44px;font-weight:800;color:${barColor};line-height:1;">${pct}%</div>
                <div style="font-size:17px;font-weight:700;color:#111827;margin-top:8px;">${s.band || ""}</div>
                <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:10px auto 0;max-width:420px;">${s.bandBlurb || ""}</p>
              </td></tr>
            </table>

            ${
              sections.length > 1
                ? `<p style="margin:0 0 12px;font-size:11px;letter-spacing:1px;color:#6b7280;font-weight:bold;">BREAKDOWN</p>
                   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">${sectionRows}</table>`
                : ""
            }

            <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 8px;">
              <tr><td align="center" style="border-radius:999px;background:${barColor};">
                <a href="https://www.vetaas.in/services#membership" style="display:inline-block;padding:13px 30px;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:999px;">Explore our programs</a>
              </td></tr>
            </table>

            <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;text-align:center;line-height:1.6;">
              This assessment is a gentle reflection, not a clinical diagnosis. Reply to this email anytime — we're happy to help.
            </p>
          </td>
        </tr>
        <tr>
          <td align="center" style="background:#fafafa;padding:18px;border-top:1px solid #eee;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">Vetaas Education Foundation · <a href="https://www.vetaas.in" style="color:#7C3AED;text-decoration:none;">vetaas.in</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // 1) Result email to the visitor
    await db.collection("mail").add({
      to: s.email,
      message: {
        subject: `Your result — ${s.quizName || "Vetaas Assessment"} (${pct}%)`,
        text:
          `${greeting}\n\nThank you for taking the ${s.quizName || "assessment"}.\n\n` +
          `Your result: ${pct}% — ${s.band || ""}\n${s.bandBlurb || ""}\n\n` +
          (sections.length > 1
            ? sections.map((sec) => `- ${sec.title}: ${Math.round(sec.pct || 0)}%`).join("\n") + "\n\n"
            : "") +
          `Explore our programs: https://www.vetaas.in/services#membership\n\n` +
          `Warm regards,\nVetaas Education Foundation\nwww.vetaas.in`,
        html,
      },
      type: "quiz-result",
      submissionId: snap.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 2) Lead copy to Vetaas
    await db.collection("mail").add({
      to: QUIZ_ADMIN_EMAIL,
      message: {
        subject: `📝 ${s.quizName || "Quiz"} completed — ${s.name || s.email} (${pct}%)`,
        text:
          `A visitor completed "${s.quizName}".\n\n` +
          `Name: ${s.name || "-"}\nEmail: ${s.email}\n` +
          `Score: ${pct}% — ${s.band}\n\n` +
          (sections.length > 1
            ? "Breakdown:\n" + sections.map((sec) => `- ${sec.title}: ${Math.round(sec.pct || 0)}%`).join("\n") + "\n\n"
            : "") +
          "Answers:\n" +
          (s.answers || []).map((a) => `- ${a.question}\n  -> ${a.answer}`).join("\n"),
        html: `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f4f4f5;padding:24px 12px;">
          <table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:14px;overflow:hidden;margin:0 auto;">
            <tr><td bgcolor="#7C3AED" style="background-color:#7C3AED;background-image:linear-gradient(135deg,#7C3AED,#00CDBA);padding:20px 24px;color:#fff;font-size:16px;font-weight:bold;">📝 New quiz lead — ${s.quizName || "Quiz"}</td></tr>
            <tr><td style="padding:24px 28px;">
              <p style="margin:0 0 6px;font-size:14px;color:#374151;"><b>${s.name || "(no name)"}</b> &lt;<a href="mailto:${s.email}" style="color:#7C3AED;">${s.email}</a>&gt;</p>
              <p style="margin:0 0 18px;font-size:22px;color:#7C3AED;font-weight:800;">${pct}% — <span style="color:#111827;font-size:15px;">${s.band || ""}</span></p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${answerRows}</table>
            </td></tr>
          </table></body></html>`,
      },
      type: "quiz-lead",
      submissionId: snap.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await snap.ref.update({ emailedAt: admin.firestore.FieldValue.serverTimestamp() });
  }
);

// Instant admin notification: fires when a visitor submits a new membership
// order, so nobody has to poll the dashboard. Delivery via the mail queue.
const ADMIN_NOTIFY_EMAIL = "kirti@vetaas.in";

exports.notifyNewOrder = onDocumentCreated(
  { document: "membershipOrders/{id}", region: "us-central1" },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const o = snap.data();
    // Razorpay-flow orders are created in "pending" the instant checkout
    // starts, before payment completes — there's nothing to verify yet, so
    // skip this and notify from approvePaidOrder once payment is confirmed.
    if (!o || o.status !== "pending" || o.razorpayOrderId) return;

    const inr = (n) => `₹${Math.round(n || 0).toLocaleString("en-IN")}`;
    const items = (o.items || [])
      .map((i) => `- ${i.plan} membership × ${i.qty} — ${inr(i.monthly)}/month`)
      .join("\n");

    const itemRows = (o.items || [])
      .map(
        (i) => `
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;color:#374151;">
              ${i.plan} membership <span style="color:#9ca3af;">× ${i.qty}</span>
            </td>
            <td align="right" style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;color:#111827;font-weight:bold;">
              ${inr(i.monthly)}/month
            </td>
          </tr>`
      )
      .join("");

    const detailRow = (label, value) => `
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6b7280;width:90px;">${label}</td>
        <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:bold;">${value || "-"}</td>
      </tr>`;

    const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">

        <tr>
          <td align="center" style="background-color:#111827;padding:28px 24px;">
            <img src="https://www.vetaas.in/icon.png" width="56" height="56" alt="Vetaas" style="border-radius:50%;display:block;margin:0 auto 10px;background:#ffffff;" />
            <h1 style="margin:0;font-size:20px;color:#ffffff;">New Membership Order 🛎️</h1>
            <p style="margin:6px 0 0;font-size:13px;color:#9ca3af;">Submitted just now on vetaas.in — pending your verification</p>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 32px;">

            <p style="margin:0 0 10px;font-size:11px;letter-spacing:1px;color:#6b7280;font-weight:bold;">CUSTOMER DETAILS</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              ${detailRow("Parent", o.parentName)}
              ${detailRow("Child", o.childAge ? `${o.childName} (${o.childAge} yrs)` : o.childName)}
              ${o.attendees ? detailRow("Attending", o.attendees) : ""}
              ${detailRow("Email", o.email ? `<a href="mailto:${o.email}" style="color:#7C3AED;text-decoration:none;">${o.email}</a>` : "-")}
              ${detailRow("Phone", o.phone ? `<a href="tel:${o.phone}" style="color:#7C3AED;text-decoration:none;">${o.phone}</a>` : "-")}
            </table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:24px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 6px;font-size:11px;letter-spacing:1px;color:#6b7280;font-weight:bold;">ORDER</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${itemRows}
                  <tr>
                    <td style="padding:10px 0 0;font-size:14px;color:#111827;font-weight:bold;">Total</td>
                    <td align="right" style="padding:10px 0 0;font-size:17px;color:#7C3AED;font-weight:bold;">${inr(o.totalMonthly)}/month</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 12px;">
              <tr>
                <td align="center" style="border-radius:999px;background:#7C3AED;">
                  <a href="https://www.vetaas.in/admin/memberships" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:999px;">Verify &amp; Approve Order</a>
                </td>
              </tr>
            </table>
            ${
              o.screenshotUrl
                ? `<p style="margin:0;font-size:13px;text-align:center;"><a href="${o.screenshotUrl}" style="color:#7C3AED;font-weight:bold;text-decoration:none;">View payment screenshot ↗</a></p>`
                : `<p style="margin:0;font-size:13px;color:#ef4444;text-align:center;font-weight:bold;">No payment screenshot attached</p>`
            }

            <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;text-align:center;line-height:1.6;">
              Check that the payment landed in the UPI account before approving —
              approval sends the confirmation email to the parent automatically.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await admin.firestore().collection("mail").add({
      to: ADMIN_NOTIFY_EMAIL,
      message: {
        subject: `🛎️ New membership order — ${o.parentName || "Unknown"} (${inr(o.totalMonthly)}/month)`,
        text:
          `A new membership order was just submitted on vetaas.in:\n\n` +
          `Parent: ${o.parentName || "-"}\n` +
          `Child: ${o.childName || "-"}${o.childAge ? ` (${o.childAge} yrs)` : ""}\n` +
          `Attending: ${o.attendees || "-"}\n` +
          `Email: ${o.email || "-"}\n` +
          `Phone: ${o.phone || "-"}\n\n` +
          `${items}\n` +
          `Total: ${inr(o.totalMonthly)}/month\n\n` +
          `Payment screenshot: ${o.screenshotUrl || "not attached"}\n\n` +
          `Verify the payment in GPay, then approve it here:\n` +
          `https://www.vetaas.in/admin/memberships`,
        html,
      },
      type: "admin-notification",
      orderId: snap.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
);

// ---------------------------------------------------------------------------
// Razorpay membership checkout: automates the manual UPI-screenshot flow
// above. The client never dictates the amount — it's always recomputed here
// from this price table, which must be kept in sync with the PLANS array in
// src/components/services/MembershipSection.tsx.
// ---------------------------------------------------------------------------

const MEMBERSHIP_DAYS = 30;
const MEMBERSHIP_ID_PREFIX = "VET-";

// ⚠️⚠️ TEST PRICING — charges ₹1/₹2/₹3 instead of the real prices so live-mode
// payments can be verified cheaply. MUST be set back to false (and the
// functions redeployed) before the new checkout is exposed to real customers,
// or anyone can buy a ₹9,999 membership for ₹3.
// Keep in sync with TEST_PRICING in src/components/services/MembershipSection.tsx.
const TEST_PRICING = true;

const PLAN_PRICES = {
  curious: { name: "Curious", price: TEST_PRICING ? 1 : 2999, siblingDiscount: 0.05 },
  grow: { name: "Grow", price: TEST_PRICING ? 2 : 5999, siblingDiscount: 0.1 },
  flourish: { name: "Flourish", price: TEST_PRICING ? 3 : 9999, siblingDiscount: 0.2 },
};

const planTotal = (plan, qty) => plan.price + (qty - 1) * plan.price * (1 - plan.siblingDiscount);

// Single-admin usage, same approach as the client-side nextMembershipId in
// admin/memberships/page.tsx — a Firestore counter/transaction isn't warranted.
async function nextMembershipId(db) {
  const snap = await db.collection("membershipOrders").get();
  let highest = 0;
  snap.forEach((d) => {
    const id = d.data().membershipId;
    if (typeof id === "string" && id.startsWith(MEMBERSHIP_ID_PREFIX)) {
      const n = parseInt(id.slice(MEMBERSHIP_ID_PREFIX.length), 10);
      if (Number.isFinite(n) && n > highest) highest = n;
    }
  });
  return `${MEMBERSHIP_ID_PREFIX}${String(highest + 1).padStart(4, "0")}`;
}

function validityRange(startMs, endMs) {
  const start = new Date(startMs);
  const end = new Date(endMs);
  const d = (x) => x.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const sameYear = start.getFullYear() === end.getFullYear();
  return sameYear
    ? `${d(start)} – ${d(end)} ${end.getFullYear()}`
    : `${d(start)} ${start.getFullYear()} – ${d(end)} ${end.getFullYear()}`;
}

// Marks a pending order paid & approved, assigns a membership ID, and queues
// the parent confirmation + admin notification emails. Called from both the
// client-verify callable and the webhook below — idempotent (checks
// status === "approved" first) since either path can fire for the same order.
async function approvePaidOrder(db, orderId) {
  const ref = db.collection("membershipOrders").doc(orderId);
  const snap = await ref.get();
  if (!snap.exists) return;
  const order = snap.data();
  if (order.status === "approved") return;

  const nowMs = Date.now();
  const expiresAtMs = nowMs + MEMBERSHIP_DAYS * 86400000;
  const membershipId = order.membershipId || (await nextMembershipId(db));

  await ref.update({
    status: "approved",
    approvedAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: admin.firestore.Timestamp.fromMillis(expiresAtMs),
    membershipId,
  });

  const validity = validityRange(nowMs, expiresAtMs);
  const emailOrder = {
    parentName: order.parentName,
    childName: order.childName,
    email: order.email,
    items: order.items,
    totalMonthly: order.totalMonthly,
    membershipId,
    validity,
  };

  await db.collection("mail").add({
    to: order.email,
    message: {
      subject: MEMBERSHIP_EMAIL_SUBJECT,
      text: buildMembershipEmailText(emailOrder),
      html: buildMembershipEmailHtml(emailOrder),
    },
    orderId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const inr = (n) => `₹${Math.round(n || 0).toLocaleString("en-IN")}`;
  await db.collection("mail").add({
    to: "kirti@vetaas.in",
    message: {
      subject: `✅ Payment received — ${order.parentName || "Unknown"} (${inr(order.totalMonthly)}/month)`,
      text:
        `A membership order was paid and auto-approved via Razorpay:\n\n` +
        `Membership ID: ${membershipId}\n` +
        `Parent: ${order.parentName || "-"}\n` +
        `Child: ${order.childName || "-"}\n` +
        `Plan: ${(order.items || []).map((i) => `${i.plan} × ${i.qty}`).join(", ")}\n` +
        `Total: ${inr(order.totalMonthly)}/month\n` +
        `Validity: ${validity}\n\n` +
        `No action needed — the confirmation email was sent automatically.\n` +
        `https://www.vetaas.in/admin/memberships`,
    },
    type: "payment-confirmed",
    orderId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

exports.createMembershipOrder = onCall(
  { region: "us-central1", secrets: [razorpayKeySecret] },
  async (request) => {
    // The site signs every visitor in anonymously (see src/lib/firebase.ts), so
    // requiring auth costs real users nothing but stops anonymous scripts from
    // spam-creating orders against the Razorpay account.
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Please reload the page and try again.");
    }

    const data = request.data || {};
    const items = Array.isArray(data.items) ? data.items : [];
    if (items.length === 0) throw new HttpsError("invalid-argument", "Cart is empty.");
    if (!data.parentName || !data.childName || !data.email || !data.phone || !data.attendees) {
      throw new HttpsError("invalid-argument", "Missing required fields.");
    }
    if (!/.+@.+\..+/.test(data.email)) {
      throw new HttpsError("invalid-argument", "Invalid email.");
    }

    const orderItems = [];
    let totalMonthly = 0;
    for (const raw of items) {
      const plan = PLAN_PRICES[raw.planId];
      const qty = Math.max(1, Math.min(20, parseInt(raw.qty, 10) || 0));
      if (!plan) throw new HttpsError("invalid-argument", "Invalid cart item.");
      const monthly = Math.round(planTotal(plan, qty));
      orderItems.push({ plan: plan.name, pricePerMonth: plan.price, qty, monthly });
      totalMonthly += monthly;
    }
    totalMonthly = Math.round(totalMonthly);
    if (totalMonthly <= 0) throw new HttpsError("invalid-argument", "Invalid total.");

    const db = admin.firestore();
    const orderRef = db.collection("membershipOrders").doc();

    const razorpay = new Razorpay({
      key_id: razorpayKeyId.value(),
      key_secret: razorpayKeySecret.value(),
    });
    const rzpOrder = await razorpay.orders.create({
      amount: totalMonthly * 100, // paise
      currency: "INR",
      receipt: orderRef.id,
      notes: { parentName: String(data.parentName), childName: String(data.childName) },
    });

    await orderRef.set({
      items: orderItems,
      totalMonthly,
      parentName: String(data.parentName).trim(),
      childName: String(data.childName).trim(),
      childAge: String(data.childAge || "").trim(),
      attendees: String(data.attendees),
      email: String(data.email).trim(),
      phone: String(data.phone).trim(),
      razorpayOrderId: rzpOrder.id,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      firestoreOrderId: orderRef.id,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: razorpayKeyId.value(),
    };
  }
);

exports.verifyMembershipPayment = onCall(
  { region: "us-central1", secrets: [razorpayKeySecret] },
  async (request) => {
    const { firestoreOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      request.data || {};
    if (!firestoreOrderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new HttpsError("invalid-argument", "Missing payment details.");
    }

    const expected = crypto
      .createHmac("sha256", razorpayKeySecret.value())
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    if (expected !== razorpay_signature) {
      throw new HttpsError("permission-denied", "Payment signature mismatch.");
    }

    const db = admin.firestore();
    const snap = await db.collection("membershipOrders").doc(firestoreOrderId).get();
    if (!snap.exists || snap.data().razorpayOrderId !== razorpay_order_id) {
      throw new HttpsError("not-found", "Order not found.");
    }

    await approvePaidOrder(db, firestoreOrderId);
    return { ok: true };
  }
);

// Authoritative payment confirmation — Razorpay calls this directly, so it
// fires even if the parent closes the tab right after paying (before the
// callable above would run). approvePaidOrder() is idempotent, so whichever
// of the two paths arrives first does the work; the other is a no-op.
exports.razorpayWebhook = onRequest(
  { region: "us-central1", secrets: [razorpayWebhookSecret] },
  async (req, res) => {
    const signature = req.headers["x-razorpay-signature"];
    const expected = crypto
      .createHmac("sha256", razorpayWebhookSecret.value())
      .update(req.rawBody)
      .digest("hex");
    if (!signature || signature !== expected) {
      res.status(400).send("Invalid signature");
      return;
    }

    const event = req.body || {};
    if (event.event === "payment.captured") {
      const payment = event.payload && event.payload.payment && event.payload.payment.entity;
      const razorpayOrderId = payment && payment.order_id;
      if (razorpayOrderId) {
        const db = admin.firestore();
        const snap = await db
          .collection("membershipOrders")
          .where("razorpayOrderId", "==", razorpayOrderId)
          .limit(1)
          .get();
        if (!snap.empty) {
          await approvePaidOrder(db, snap.docs[0].id);
        }
      }
    }
    res.status(200).send("ok");
  }
);
