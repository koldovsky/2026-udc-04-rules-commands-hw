---
description: "Diagnose a build/test error and propose a fix without @ts-ignore/any or protected-file edits"
---

# Diagnose a build/test error

Diagnose this error and propose a fix:

$ARGUMENTS

1. Find the root cause, not just the symptom — trace it to the actual
   file/line using `cd app && npm run typecheck` / `cd app && npm test` output.
2. Propose a fix for the root cause. Do NOT use `@ts-ignore`/
   `@ts-expect-error`/`any` to silence it (`.cursor/rules/conventions.mdc`).
3. Do not edit `app/src/store.ts`; `app/src/types.ts` may only be extended,
   never renamed/removed (`.cursor/rules/do-not-touch.mdc`).
4. If the fix needs a new npm dependency, stop and ask instead of adding one
   (`.cursor/rules/dependencies.mdc`).
5. Fix only what's needed to resolve this error — no unrelated cleanup in
   the same pass.
6. Apply the fix, then confirm `cd app && npm test && npm run typecheck`
   both pass.

Follow `.cursor/rules/` throughout.
