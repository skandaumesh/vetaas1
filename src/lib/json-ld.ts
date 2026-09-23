/**
 * Serialises structured data for a <script type="application/ld+json"> tag.
 *
 * JSON.stringify leaves "<" alone, so a "</script>" inside any value — an
 * event title typed in the admin panel, for instance — would end the tag early
 * and let the rest be parsed as markup. Escaping it as \u003c keeps the JSON
 * identical to a parser while making that impossible.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\u003c");
}
