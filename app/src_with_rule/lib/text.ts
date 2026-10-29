// In-house text helpers.
//
// This is a CUSTOM library, not lodash/underscore. Its supported surface is
// exactly the three functions below with exactly these signatures. Do not
// assume other helpers (e.g. `capitalize`, `camelCase`, `deburr`) exist — if
// you need one, add it here explicitly. A rule documenting this real API is
// the best defence against an agent hallucinating methods that don't exist.

/** Turn arbitrary text into a URL/anchor-safe slug: "Buy Milk!" -> "buy-milk". */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Shorten `input` to at most `maxLength` characters, INCLUDING the suffix.
 * If `input` already fits, it is returned unchanged.
 */
export function truncate(input: string, maxLength: number, suffix = "…"): string {
  if (input.length <= maxLength) {
    return input;
  }
  if (suffix.length >= maxLength) {
    return suffix.slice(0, maxLength);
  }
  return input.slice(0, maxLength - suffix.length) + suffix;
}

/** Collapse internal whitespace and trim the ends: "  a   b " -> "a b". */
export function normalizeSpaces(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}
