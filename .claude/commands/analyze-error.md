---
description: "Diagnose a test/typecheck/runtime error and propose a fix without any, @ts-ignore, or protected-file edits"
---

Analyze this error and propose a fix for: $ARGUMENTS

1. Read the full error/stack trace and reproduce it (`cd app && npm test` and/or `cd app && npm run typecheck`) before proposing anything.
2. Trace the root cause through the actual code path — `reducer.ts`/`actions.ts`/`selectors.ts`/`lib/text.ts` — not guesswork.
3. Propose a fix that resolves the root cause, not a suppression: no `@ts-ignore`, no `any`, no skipping or deleting the failing test.
4. If the fix would require touching `app/src/store.ts` or restructuring `app/src/types.ts`, stop and ask the user first instead of making the edit.
5. Apply the fix, add or adjust a colocated test if the bug wasn't already covered, and confirm `cd app && npm test && npm run typecheck` pass.

Follow the project conventions in `.cursor/rules/` (custom store — NOT
Redux/Zustand; named exports; immutable updates; do not touch app/src/store.ts
or app/src/types.ts beyond agreed additions).
