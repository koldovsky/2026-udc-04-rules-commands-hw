---
description: "Diagnose an error/stack trace from this app and propose a fix"
---

Diagnose and propose a fix for this error: $ARGUMENTS

1. Locate the failing code path — search `app/src` for the symbol, file, or
   line named in the error/stack trace.
2. Explain the root cause in 1-3 sentences before writing any fix.
3. Propose the smallest fix that resolves it **without** using `any` or
   `@ts-ignore`, and without editing `app/src/store.ts` or changing the
   existing shape of `app/src/types.ts` (only additive `types.ts` changes are
   allowed, and only if the root cause genuinely requires a new `Action`
   variant or field).
4. If the fix touches `app/src/reducer.ts`, keep it immutable
   (spread/`map`/`filter`, no in-place mutation).
5. Add or update a colocated test that reproduces the bug (fails without the
   fix, passes with it).
6. Run `cd app && npm test` and `cd app && npm run typecheck` to confirm.

Follow `.cursor/rules/` — do not silence the error with a type-system escape
hatch instead of fixing the underlying cause.
