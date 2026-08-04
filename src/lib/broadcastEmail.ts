// Personalised bulk-email helpers. The admin writes one message with a
// {{name}} token; we render a per-recipient plain-text + branded HTML version.
// Delivery reuses the `mail` collection watched by the sendMail Cloud Function,
// which swaps this logo URL for an embedded (CID) circular logo.
const LOGO_URL = "https://www.vetaas.in/icon.png";

export function personalize(template: string, name: string): string {
  const safeName = name?.trim() || "there";
  return template.replace(/\{\{\s*name\s*\}\}/gi, safeName);
}

// Escape user-entered text before dropping it into HTML.
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Turn plain text (blank line = new paragraph, single newline = <br>) into HTML.
function textToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map(
      (para) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#374151;">${esc(
          para
        ).replace(/\n/g, "<br />")}</p>`
    )
    .join("");
}

export function buildBroadcastText(body: string, name: string): string {
  return `${personalize(body, name)}\n\n—\nVetaas Education Foundation\nwww.vetaas.in`;
}

export function buildBroadcastHtml(body: string, name: string): string {
  const inner = textToHtml(personalize(body, name));
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr>
          <td align="center" style="background-color:#111827;padding:26px 24px;">
            <img src="${LOGO_URL}" width="52" height="52" alt="Vetaas" style="border-radius:50%;display:block;margin:0 auto;background:#ffffff;" />
          </td>
        </tr>
        <tr>
          <td style="padding:30px 34px 26px;">
            ${inner}
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
}
