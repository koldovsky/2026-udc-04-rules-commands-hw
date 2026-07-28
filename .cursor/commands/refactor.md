---
description: "Refactor selected/described code to project conventions without changing behavior"
---

# Refactor

Refactor the following, without changing behavior: $ARGUMENTS

1. Identify the exact code to refactor (selection, file, or function named in
   the arguments above). Confirm current behavior first — read any colocated
   test for it.
2. Apply the refactor: improve naming, structure, or duplication while
   preserving inputs/outputs exactly. No behavior change, no new features.
3. Keep it aligned with project conventions: named exports only, no
   `any`/`@ts-ignore`, immutable state updates (spread/`map`/`filter`, never
   mutate), kebab-case file names.
4. Do NOT touch `app/src/store.ts` or `app/src/types.ts` unless the refactor
   was explicitly scoped to them.
5. Do NOT introduce a state-management library or a new npm dependency as
   part of a "cleanup."
6. Run `cd app && npm test && npm run typecheck` — existing tests must still
   pass unchanged (if a test needs to change, that's a sign behavior changed —
   stop and flag it instead of editing the test to match).

Follow `.cursor/rules/` — especially `conventions.mdc`, `do-not-touch.mdc`,
and `dependencies.mdc`.
