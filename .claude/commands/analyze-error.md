---
description: "Diagnose a TypeScript or test error and propose a proper fix — never @ts-ignore"
---

# /analyze-error

Analyze this error from the task-board app and propose a fix: $ARGUMENTS

1. Reproduce it: run `cd app && npm run typecheck` and `npm test`; quote the
   exact failing output.
2. Locate the root cause in `app/src/` — name the file and line, and explain
   WHY it fails (type mismatch, missing `Action` variant, missed reducer case,
   hallucinated `lib/text.ts` helper, mutation breaking a test, etc.).
3. Propose the smallest fix that respects `.cursor/rules/`:
   - fix the types — NEVER silence with `any`, `@ts-ignore`, or
     `@ts-expect-error`;
   - never "fix" by editing `app/src/store.ts`, deleting/weakening a test, or
     adding a dependency.
4. If the correct fix requires changing a protected file (`store.ts`, or
   `types.ts` beyond the sanctioned additions — a new `Action` union variant
   or a task-required domain field), stop and ask for approval with the exact
   diff you propose.
5. After applying an approved fix, re-run both commands and confirm green.
