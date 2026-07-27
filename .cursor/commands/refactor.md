---
description: "Refactor selected code to match project conventions without changing behavior"
---

# Refactor

Refactor the following for: $ARGUMENTS

1. Identify the selected/targeted code and clarify its current behavior
   before changing anything.
2. Rewrite it to match project conventions: named exports only, no
   `any`/`@ts-ignore`, immutable state updates, kebab-case file names,
   explicit `.js` import extensions.
3. Preserve behavior exactly — this is a refactor, not a feature change. If
   existing tests cover it, they must still pass unmodified; if they don't,
   add a colocated test that pins current behavior before refactoring.
4. Do not touch `app/src/store.ts` or `app/src/types.ts`, and do not change
   the public signature of any existing action creator or `app/src/lib/text.ts`
   function.
5. Do not introduce new npm dependencies or a state-management library.

Follow the project conventions in `.cursor/rules/`. Run `cd app && npm test`
after and confirm it's green.
