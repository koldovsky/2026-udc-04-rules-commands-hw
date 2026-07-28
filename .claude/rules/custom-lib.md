---
paths:
  - "app/src/lib/**"
---

# Custom Library — text.ts

## Context

`app/src/lib/text.ts` is an in-house text utility library — NOT lodash or underscore. Agents often hallucinate helpers that do not exist. The supported surface is exactly three functions with fixed signatures.

## Rule

**Supported API only:**

- `slugify(input: string): string` — URL-safe slug (`"Buy Milk!"` → `"buy-milk"`)
- `truncate(input: string, maxLength: number, suffix?: string): string` — shorten with optional suffix (default `"…"`)
- `normalizeSpaces(input: string): string` — collapse whitespace and trim

**Does NOT exist:** `capitalize`, `camelCase`, `deburr`, or any lodash-style helper.

- Do not import lodash, underscore, or other text libraries.
- If a new helper is needed, add it explicitly to `text.ts` with a test in `text.test.ts`.

## How to verify

1. `rg 'capitalize|camelCase|deburr|lodash|underscore' app/src/` — zero usage of hallucinated helpers.
2. Imports from `./lib/text.js` reference only `slugify`, `truncate`, or `normalizeSpaces`.
3. Any new function in `text.ts` has a matching test in `text.test.ts`.
