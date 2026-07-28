---
description: "Diagnose an error/stack trace, find root cause, and propose a safe fix"
---

Analyze this error: $ARGUMENTS

Paste of an error message, stack trace, or failing test output goes in
`$ARGUMENTS`. Diagnose, then fix within the project's guardrails.

1. **Read** the error and map every referenced frame to a real location in
   `app/src/` (or the test file). Reproduce with `cd app && npm run typecheck`
   and/or `npm test` if it is a type/test error.
2. **Root cause** — explain *why* it happens (e.g. an unhandled `Action` variant,
   a `noUncheckedIndexedAccess` violation, a wrong reducer branch), not just the
   symptom.
3. **Fix** — propose the minimal change. NEVER silence it with `any`,
   `@ts-ignore`, or `@ts-expect-error`. Do not touch `app/src/store.ts` or
   `app/src/types.ts` beyond an agreed additive `Action`/`Task` change. No new
   npm dependencies.
4. **Confirm** — re-run `cd app && npm run typecheck && npm test`; both green.
5. Report the root cause, the fix, and the verification result.

Follow the project conventions in `.cursor/rules/` (custom store — NOT
Redux/Zustand; named exports; immutable updates; do not touch `app/src/store.ts`
or `app/src/types.ts` beyond agreed additions).
