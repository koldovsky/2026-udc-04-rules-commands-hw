---
description: "Diagnose a TS/vitest error or stack trace and fix the root cause — no any, no @ts-ignore, no protected-file edits"
---

Analyze and fix this error / failing test / stack trace: $ARGUMENTS

1. **Reproduce** — run the relevant command (`cd app && npm test` or
   `npm run typecheck`) and paste the exact failing output. Do not fix
   anything you have not reproduced.
2. **Locate** — map the message to a concrete file and line in `app/src`.
   Read that file plus its direct imports. For `noUncheckedIndexedAccess`
   errors, remember index access returns `T | undefined`.
3. **Explain the root cause in 2–3 sentences** before editing: what the code
   assumes vs. what actually happens. Distinguish a real bug from a wrong test
   expectation, and say which one it is.
4. **Propose the smallest correct fix**, then apply it. Typical shapes here:
   - missing `case` in `app/src/reducer.ts` for a new `Action` variant;
   - a hallucinated helper from `app/src/lib/text.ts` — only `slugify`,
     `truncate`, `normalizeSpaces` exist;
   - a mutation where an immutable update was required;
   - a missing `.js` in a relative import.
5. **Forbidden fixes**: `any`, `as any`, `@ts-ignore`, `@ts-expect-error`,
   non-null `!`, deleting/weakening an assertion, loosening
   `app/tsconfig.json`, adding an npm package, or editing
   `app/src/store.ts` / `app/src/types.ts` (beyond an additive `Action`
   variant, and only after asking).
6. **Regression test** — add or extend a colocated `*.test.ts` that fails
   before the fix and passes after it.
7. **Verify** — `cd app && npm run typecheck && npm test` green; report the
   root cause, the fix, the new test, and the changed files.

Follow the project conventions in `.cursor/rules/` (`architecture.mdc`,
`conventions.mdc`, `custom-lib.mdc`, `do-not-touch.mdc`, `testing.mdc`) and
`app/AGENTS.md`.

