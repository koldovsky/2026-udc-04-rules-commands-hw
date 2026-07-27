---
description: "Analyze an error/stack trace and propose a type-safe fix"
---

# Analyze error

Analyze and fix this error: $ARGUMENTS

Use project rules in `.cursor/rules/` (`conventions.mdc`, `do-not-touch.mdc`,
`architecture.mdc`, `testing.mdc`, `custom-lib.mdc`). Custom store — NOT
Redux/Zustand; respect the fixed `lib/text.ts` API.

1. Read `$ARGUMENTS` (message, stack, failing test, or typecheck output). If a
   path/line is named, open that file and nearby callers.
2. Identify the root cause (wrong types, missing Action/reducer case, misuse of
   `text.ts`, mutation, bad import, etc.) — not just the first symptom.
3. Propose the smallest fix that matches existing patterns. Prefer:
   - proper types / narrowing over casts
   - action creator + reducer path for state issues
   - real `lib/text.ts` helpers (`slugify`, `truncate`, `normalizeSpaces`) —
     do not invent `capitalize` / `camelCase`
4. **Constraints:** no `any`, no `@ts-ignore` / `@ts-expect-error`; do **not**
   edit `app/src/store.ts`; do **not** modify `app/src/types.ts` by default —
   even if the error appears to need a new `Action` or field, **stop and ask
   for explicit user approval** before any `types.ts` change; no new npm
   dependencies.
5. Implement the fix if safe and scoped; add or adjust a colocated vitest test
   when behavior changes.
6. Verify with `cd app && npm test` and/or `npm run typecheck`.

Report: root cause, files changed, and how to confirm the fix.
