---
description: "Refactor selected code to project conventions without changing behavior"
---

# Refactor

Refactor: $ARGUMENTS

1. Keep behavior identical — no observable change in output/tests.
2. Apply project conventions: named exports only, no `any`/`@ts-ignore`,
   immutable state updates, kebab-case filenames.
3. Do not touch `app/src/store.ts` or change existing signatures in
   `app/src/types.ts` or `app/src/lib/text.ts`.
4. Do not add new npm dependencies.
5. Run `cd app && npm test` and `npm run typecheck` and confirm both still
   pass after the refactor.

Follow the conventions in `.cursor/rules/` throughout.
