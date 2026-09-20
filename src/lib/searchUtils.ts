/**
 * Search input hardening utilities.
 *
 * Protects database queries from special characters that would otherwise
 * change query semantics or break PostgREST filter parsing:
 *  - `%` and `_` are SQL LIKE/ILIKE wildcards.
 *  - `,` `(` `)` `*` are PostgREST `or()` filter separators / wildcards.
 *
 * Bangla, English and other Unicode text pass through unchanged; only the
 * characters that have query meaning are neutralised.
 */

/** Max characters accepted from a raw search box (defense against abuse). */
export const MAX_SEARCH_LEN = 80;

/**
 * Sanitize a raw user search term for use inside a PostgREST ilike/or filter.
 * Returns a safe substring pattern token (without surrounding wildcards).
 */
export const sanitizeSearchTerm = (raw: string): string =>
  (raw || '')
    .slice(0, MAX_SEARCH_LEN)
    .replace(/[,()*%_\\]/g, ' ') // strip filter separators + LIKE wildcards
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Build a multi-column PostgREST `or()` ilike expression for the given term.
 * Term must already be sanitized. Returns null when nothing to search.
 */
export const buildProductSearchOr = (term: string, columns: string[]): string | null => {
  const safe = sanitizeSearchTerm(term);
  if (!safe) return null;
  return columns.map((c) => `${c}.ilike.*${safe}*`).join(',');
};
