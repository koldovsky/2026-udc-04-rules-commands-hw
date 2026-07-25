---
description: "Diagnose a TypeScript or test error and propose a fix without shortcuts"
---

Analyze this error and propose a fix: **$ARGUMENTS**

1. Read the full error message and stack trace. Identify the root cause file and
   line — not just the symptom.
2. Inspect related code (`reducer.ts`, `actions.ts`, `selectors.ts`, tests) to
   understand why the error occurs.
3. Propose a **minimal, type-safe fix** that follows project architecture.

Constraints from `.cursor/rules/`:

- No `@ts-ignore`, no `any`, no suppressing errors.
- Do **not** modify `app/src/store.ts` or `app/src/types.ts` unless the fix
  genuinely requires a new `Action` variant (then follow the golden path).
- State changes only via `store.dispatch(action)` — never direct mutation.
- Do **not** add npm dependencies.

Output format:

1. **Root cause** — one or two sentences.
2. **Fix** — specific file(s) and change(s) to make.
3. **Verification** — run `cd app && npm test && npm run typecheck` after applying.

Apply the fix unless the user only asked for analysis.
