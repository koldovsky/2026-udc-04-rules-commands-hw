---
description: "Analyze an error or stack trace — find root cause and propose a safe fix"
---

Analyze and fix this error: $ARGUMENTS

Follow these steps:

1. **Read the error** — Parse the error message and/or stack trace. Identify the
   file, line number, and type of error (type error, runtime exception, test
   failure, etc.).

2. **Find root cause** — Read the relevant source files. Trace the data flow to
   understand WHY the error occurs, not just WHERE.

3. **Propose a fix** — Suggest the minimal change that resolves the root cause.
   Explain your reasoning in one or two sentences.

4. **Apply the fix** following project conventions (from `.cursor/rules/`):
   - No `any` or `@ts-ignore` — fix the type properly.
   - No direct state mutation — use immutable patterns.
   - Named exports only.
   - If the fix requires a new action, follow the full flow:
     `types.ts` → `reducer.ts` → `actions.ts`.

5. **Respect guardrails**:
   - Do NOT modify `app/src/store.ts` or `app/src/types.ts` without explicit
     user approval.
   - Do NOT install new dependencies.
   - Do NOT suppress the error with `as any`, `@ts-ignore`, or `// @ts-expect-error`.

6. **Verify** — Run `npm run typecheck` and `npm test` from `app/`. Both must
   pass. Show the relevant passing output.
