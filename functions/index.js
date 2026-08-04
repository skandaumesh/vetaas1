const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const path = require("path");

admin.initializeApp();

const smtpPassword = defineSecret("SMTP_PASSWORD"); // v3

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
          <td align="center" style="background-color:#111827;padding:28px 24px;">
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
            <tr><td style="background:#111827;padding:20px 24px;color:#fff;font-size:16px;font-weight:bold;">📝 New quiz lead — ${s.quizName || "Quiz"}</td></tr>
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
    if (!o || o.status !== "pending") return;

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
