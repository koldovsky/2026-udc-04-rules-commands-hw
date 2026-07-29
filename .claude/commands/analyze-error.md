---
description: "Diagnose a TypeScript or vitest error and fix the cause, not the symptom"
---

# Analyze Error

Analyze and fix this error: $ARGUMENTS

The goal is the **root cause**. Silencing the compiler is not a fix.

1. **Reproduce.** Run `cd app && npm run typecheck && npm test` — both scripts
   are defined in `app/package.json`, so run them from `app/`, not the repo
   root — and quote the actual message, file, and line. If it does not
   reproduce, say so and ask for the exact command and output — do not guess
   from the message alone.
2. **Locate.** Read the failing file and the modules it imports. Trace which
   layer the fault is in: `types.ts` (union/shape), `reducer.ts` (a missing
   `case` or a mutation), `actions.ts` (payload mismatch), `selectors.ts` (read
   logic), `lib/text.ts` (helper behavior), or the test's own expectation.
3. **Check the known traps in this project first** — most errors here are one of:
   - a call to a helper that does not exist (`capitalize`, `camelCase`, `deburr`
     are NOT in `app/src/lib/text.ts` — see `.cursor/rules/custom-lib.mdc`)
   - a new `Action` variant added to `types.ts` but never handled in
     `reducer.ts`, or dispatched but never added to the union
   - `noUncheckedIndexedAccess`: `tasks[0]` is `Task | undefined`
   - a relative import missing its `.js` extension
   - `describe is not defined` at runtime — bare vitest globals typecheck
     because of `"types": ["vitest/globals"]` in `tsconfig.json`, but no vitest
     config enables them; add the explicit `import ... from "vitest"`
   - a mutated state object, so `subscribe` listeners never see a change
4. **State the cause in one sentence** before proposing code. If the evidence
   supports more than one cause, list them and say which you are acting on.
5. **Fix the cause.** NEVER resolve it with `any`, `as unknown as`, a non-null
   `!`, `@ts-ignore`, `@ts-expect-error`, `.skip` on the test, or a loosened
   assertion. NEVER "fix" it by editing `app/src/store.ts` or by adding a
   dependency. If the only honest fix needs a change to the protected core
   (`.cursor/rules/do-not-touch.mdc`), stop and ask for approval, explaining why
   the reducer/actions layer cannot absorb it.
6. **Add a regression test** that fails without your fix and passes with it —
   colocated, explicit vitest imports, Arrange → Act → Assert.
7. **Verify.** `cd app && npm run typecheck && npm test`, both green. Report:
   the cause, the fix, the regression test, and anything still unexplained.

If $ARGUMENTS contains no error text, ask for the message or stack trace instead
of hunting for something that might be wrong.
