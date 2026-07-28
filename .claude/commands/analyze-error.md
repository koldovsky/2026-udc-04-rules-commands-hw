---
description: "Diagnose an error/stack trace and propose a fix without any/@ts-ignore or protected-file edits"
---

Diagnose and propose a fix for this error: $ARGUMENTS

1. Read the error/stack trace carefully; locate the exact file(s) and line(s)
   it points to in `app/src`.
2. Find the root cause — trace it back through `store.ts` → `reducer.ts` →
   `actions.ts`/`selectors.ts` as needed, don't just patch the symptom at the
   call site.
3. Propose a fix that:
   - does not use `any` or `@ts-ignore` to silence the error,
   - does not mutate state directly (immutable updates only),
   - does not touch `app/src/store.ts` or `app/src/types.ts` unless the root
     cause is genuinely there — if so, stop and confirm before editing.
4. Add or update a colocated test that reproduces the bug and passes with the
   fix applied.
5. Run `cd app && npm test` and `npm run typecheck` to confirm the fix and
   that no other test broke.

Follow `.cursor/rules/` — especially `conventions.mdc` (no `any`/`@ts-ignore`),
`do-not-touch.mdc`, and `custom-lib.mdc` (don't assume `lib/text.ts` helpers
that don't exist).
