// Membership confirmation email — shared by the admin dashboard (queues it
// into the `mail` collection) and by the mailto fallback (text version).

export interface EmailOrderItem {
  plan: string;
  pricePerMonth: number;
  qty: number;
  monthly: number;
}

export interface EmailOrder {
  parentName: string;
  childName: string;
  email: string;
  items: EmailOrderItem[];
  totalMonthly: number;
  membershipId?: string;
  /** Human-readable validity, e.g. "1 Aug – 31 Aug 2026" */
  validity?: string;
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

// Studio + resource links used across the emails
export const LINKS = {
  calendar: "https://www.vetaas.in/events",
  guide: "https://www.vetaas.in/services#membership",
  maps: "https://maps.app.goo.gl/eMUJokfKE8opyhhz5",
  phone: "+91 89510 04160",
  phoneHref: "+918951004160",
  timings: "11 AM to 6 PM",
};

const planNames = (order: EmailOrder) =>
  order.items.map((i) => (i.qty > 1 ? `${i.plan} × ${i.qty}` : i.plan)).join(", ");

export const EMAIL_SUBJECT = "Welcome to The Nest by Vetaas! 🌿";

export function buildEmailText(order: EmailOrder): string {
  return `Welcome to The Nest by Vetaas!

We're delighted to have your family join our community.

MEMBERSHIP DETAILS
Membership ID: ${order.membershipId ?? "-"}
Plan: ${planNames(order)}
Validity: ${order.validity ?? "-"}

QUICK LINKS
Monthly Calendar: ${LINKS.calendar}
Membership Guide: ${LINKS.guide}
Studio Location: ${LINKS.maps}

NEED HELP?
Contact us: ${LINKS.phone}
Studio Timings: ${LINKS.timings}

Please save this number so you don't miss important updates, session reminders, and community events.

We look forward to learning, playing, and growing together. See you at The Nest!

Vetaas Education Foundation
www.vetaas.in | @vetaaseducation`;
}

export const REJECTION_SUBJECT = "About your Vetaas membership order";

export function buildRejectionText(order: EmailOrder): string {
  return `Dear ${order.parentName},

Thank you for your interest in a Vetaas membership for ${order.childName}.

Unfortunately, we were unable to verify the payment for your order, so it could not be confirmed at this time.

Please note: if any amount was deducted from your account, it will be refunded within 24 hours.

If you believe this is a mistake, or if you'd like to try again, simply reply to this email or WhatsApp us at +91 89510 04160 with your payment details (screenshot or UPI transaction ID) — we'll sort it out right away.

Warm regards,
Vetaas Education Foundation
www.vetaas.in | @vetaaseducation`;
}

export function buildRejectionHtml(order: EmailOrder): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">

        <tr>
          <td align="center" style="background-color:#111827;padding:32px 24px;">
            <img src="https://www.vetaas.in/icon.png" width="72" height="72" alt="Vetaas" style="border-radius:50%;display:block;margin:0 auto 12px;background:#ffffff;" />
            <h1 style="margin:0;font-size:22px;color:#ffffff;">About Your Membership Order</h1>
            <p style="margin:6px 0 0;font-size:14px;color:#9ca3af;">We couldn't verify your payment</p>
          </td>
        </tr>

        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
              Dear <strong>${order.parentName}</strong>,
            </p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
              Thank you for your interest in a Vetaas membership for <strong>${order.childName}</strong>.
              Unfortunately, we were unable to verify the payment for your order, so it could not be confirmed at this time.
            </p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fefce8;border:1px solid #fde68a;border-radius:12px;margin:0 0 24px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0;font-size:14px;color:#854d0e;line-height:1.6;">
                  <strong>Please note:</strong> if any amount was deducted from your account,
                  it will be refunded within <strong>24 hours</strong>.
                </p>
              </td></tr>
            </table>

            <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
              If you believe this is a mistake, or you'd like to try again, just reply to this
              email or WhatsApp us with your payment details (screenshot or UPI transaction ID)
              — we'll sort it out right away.
            </p>

            <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
              <tr><td align="center" style="border-radius:999px;background:#25D366;">
                <a href="https://wa.me/919108906009" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:999px;">Message us on WhatsApp</a>
              </td></tr>
            </table>
          </td>
        </tr>

        <tr>
          <td align="center" style="background:#111827;padding:24px;">
            <p style="margin:0 0 6px;font-size:14px;color:#ffffff;font-weight:bold;">Vetaas Education Foundation</p>
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              <a href="https://www.vetaas.in" style="color:#9ca3af;text-decoration:none;">www.vetaas.in</a>
              &nbsp;·&nbsp;
              <a href="https://www.instagram.com/vetaaseducation/" style="color:#9ca3af;text-decoration:none;">@vetaaseducation</a>
              &nbsp;·&nbsp;
              <a href="mailto:kirti@vetaas.in" style="color:#9ca3af;text-decoration:none;">kirti@vetaas.in</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export const reminderSubject = (childName: string, dateStr: string) =>
  `Reminder: ${childName}'s Vetaas membership expires on ${dateStr}`;

export function buildReminderText(order: EmailOrder, dateStr: string): string {
  return `Dear ${order.parentName},

A friendly reminder that ${order.childName}'s Vetaas membership expires on ${dateStr}.

To continue without a break, renew anytime at https://www.vetaas.in/services#membership or WhatsApp us at +91 89510 04160 — we'll take care of the rest.

We'd love to keep seeing ${order.childName} at the studio!

Warm regards,
Vetaas Education Foundation
www.vetaas.in | @vetaaseducation`;
}

export function buildReminderHtml(order: EmailOrder, dateStr: string): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">

        <tr>
          <td align="center" style="background-color:#7C3AED;background-image:linear-gradient(135deg,#7C3AED 0%,#6D28D9 100%);padding:32px 24px;">
            <img src="https://www.vetaas.in/icon.png" width="72" height="72" alt="Vetaas" style="border-radius:50%;display:block;margin:0 auto 12px;background:#ffffff;" />
            <h1 style="margin:0;font-size:22px;color:#ffffff;">Membership Reminder ⏰</h1>
            <p style="margin:6px 0 0;font-size:14px;color:#e9d5ff;">Don't miss a single session</p>
          </td>
        </tr>

        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
              Dear <strong>${order.parentName}</strong>,
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
              A friendly reminder that <strong>${order.childName}</strong>'s Vetaas membership expires on:
            </p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;">
              <tr><td align="center" style="padding:20px 24px;">
                <p style="margin:0;font-size:20px;color:#7C3AED;font-weight:bold;">${dateStr}</p>
                ${
                  order.membershipId
                    ? `<p style="margin:8px 0 0;font-size:12px;color:#6b7280;">Membership ID: <strong style="color:#111827;">${order.membershipId}</strong></p>`
                    : ""
                }
              </td></tr>
            </table>

            <p style="margin:24px 0;font-size:15px;color:#374151;line-height:1.6;">
              To continue without a break, renew your membership online — it only takes a minute.
            </p>

            <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
              <tr><td align="center" style="border-radius:999px;background:#7C3AED;">
                <a href="https://www.vetaas.in/services#membership" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:999px;">Renew Membership</a>
              </td></tr>
            </table>

            <p style="margin:24px 0 0;font-size:13px;color:#6b7280;line-height:1.6;" align="center">
              Questions? WhatsApp us at <a href="https://wa.me/918951004160" style="color:#7C3AED;font-weight:bold;text-decoration:none;">+91 89510 04160</a>
            </p>
          </td>
        </tr>

        <tr>
          <td align="center" style="background:#111827;padding:24px;">
            <p style="margin:0 0 6px;font-size:14px;color:#ffffff;font-weight:bold;">Vetaas Education Foundation</p>
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              <a href="https://www.vetaas.in" style="color:#9ca3af;text-decoration:none;">www.vetaas.in</a>
              &nbsp;·&nbsp;
              <a href="https://www.instagram.com/vetaaseducation/" style="color:#9ca3af;text-decoration:none;">@vetaaseducation</a>
              &nbsp;·&nbsp;
              <a href="mailto:kirti@vetaas.in" style="color:#9ca3af;text-decoration:none;">kirti@vetaas.in</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function buildEmailHtml(order: EmailOrder): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td align="center" style="background-color:#7C3AED;background-image:linear-gradient(135deg,#7C3AED 0%,#6D28D9 100%);padding:32px 24px;">
            <img src="https://www.vetaas.in/icon.png" width="72" height="72" alt="Vetaas" style="border-radius:50%;display:block;margin:0 auto 12px;background:#ffffff;" />
            <h1 style="margin:0;font-size:22px;color:#ffffff;">Welcome to The Nest by Vetaas! 🌿</h1>
            <p style="margin:6px 0 0;font-size:14px;color:#e9d5ff;">We're delighted to have your family join our community</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 32px 8px;">

            <!-- Membership details -->
            <p style="margin:0 0 10px;font-size:11px;letter-spacing:1px;color:#6b7280;font-weight:bold;">MEMBERSHIP DETAILS</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:12px;margin:0 0 28px;">
              <tr><td style="padding:20px 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:5px 0;font-size:13px;color:#6b7280;width:110px;">Membership ID</td>
                    <td style="padding:5px 0;font-size:16px;color:#111827;font-weight:bold;letter-spacing:1px;">${order.membershipId ?? "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0;font-size:13px;color:#6b7280;">Plan</td>
                    <td style="padding:5px 0;font-size:14px;color:#111827;font-weight:bold;">${planNames(order)}</td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0;font-size:13px;color:#6b7280;">Validity</td>
                    <td style="padding:5px 0;font-size:14px;color:#111827;font-weight:bold;">${order.validity ?? "-"}</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- Quick links -->
            <p style="margin:0 0 10px;font-size:11px;letter-spacing:1px;color:#6b7280;font-weight:bold;">QUICK LINKS</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr>
                <td width="30" valign="top" style="padding:7px 0;font-size:16px;">📅</td>
                <td style="padding:7px 0;font-size:14px;color:#374151;">
                  Monthly Calendar —
                  <a href="${LINKS.calendar}" style="color:#7C3AED;font-weight:bold;text-decoration:none;">View calendar</a>
                </td>
              </tr>
              <tr>
                <td width="30" valign="top" style="padding:7px 0;font-size:16px;">📖</td>
                <td style="padding:7px 0;font-size:14px;color:#374151;">
                  Membership Guide —
                  <a href="${LINKS.guide}" style="color:#7C3AED;font-weight:bold;text-decoration:none;">Read the guide</a>
                </td>
              </tr>
              <tr>
                <td width="30" valign="top" style="padding:7px 0;font-size:16px;">📍</td>
                <td style="padding:7px 0;font-size:14px;color:#374151;">
                  Studio Location —
                  <a href="${LINKS.maps}" style="color:#7C3AED;font-weight:bold;text-decoration:none;">Open in Google Maps</a>
                </td>
              </tr>
            </table>

            <!-- Need help -->
            <p style="margin:0 0 10px;font-size:11px;letter-spacing:1px;color:#6b7280;font-weight:bold;">NEED HELP?</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;margin:0 0 20px;">
              <tr><td style="padding:18px 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="30" valign="top" style="padding:5px 0;font-size:15px;">📞</td>
                    <td style="padding:5px 0;font-size:14px;color:#374151;">
                      Contact us:
                      <a href="tel:${LINKS.phoneHref}" style="color:#111827;font-weight:bold;text-decoration:none;">${LINKS.phone}</a>
                    </td>
                  </tr>
                  <tr>
                    <td width="30" valign="top" style="padding:5px 0;font-size:15px;">🕘</td>
                    <td style="padding:5px 0;font-size:14px;color:#374151;">
                      Studio Timings: <strong style="color:#111827;">${LINKS.timings}</strong>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <p style="margin:0 0 20px;font-size:13px;color:#6b7280;line-height:1.6;">
              Please save this number so you don't miss important updates, session reminders, and community events.
            </p>

            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
              We look forward to learning, playing, and growing together. See you at The Nest! 🌿
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="background:#111827;padding:24px;">
            <p style="margin:0 0 6px;font-size:14px;color:#ffffff;font-weight:bold;">Vetaas Education Foundation</p>
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              <a href="https://www.vetaas.in" style="color:#9ca3af;text-decoration:none;">www.vetaas.in</a>
              &nbsp;·&nbsp;
              <a href="https://www.instagram.com/vetaaseducation/" style="color:#9ca3af;text-decoration:none;">@vetaaseducation</a>
              &nbsp;·&nbsp;
              <a href="mailto:kirti@vetaas.in" style="color:#9ca3af;text-decoration:none;">kirti@vetaas.in</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
