---
description: "Diagnose a TypeScript or vitest failure and propose a root-cause fix — no any, no @ts-ignore, no protected-file edits"
---

# /analyze-error

Diagnose this error and fix its cause, not its symptom: $ARGUMENTS

1. **Read before guessing.** Pull the `file:line` out of the stack or `tsc`
   output and open that file. If the error names no location, reproduce first.
2. **Reproduce:** `cd app && npm test` for a vitest failure, `cd app && npm run
   typecheck` for a type error. Quote the real output — do not paraphrase it.
3. **State the root cause in one sentence**, then the fix. If the fix touches
   more than one file, say why each is needed.
4. **Check this repo's usual suspects first**, in order:
   - `noUncheckedIndexedAccess` is on, so `state.tasks[0]` is `Task | undefined`
     — guard with `?.` or an explicit check, never `!`.
   - A non-exhaustive `switch` in `app/src/reducer.ts` after a variant was added
     to the `Action` union in `app/src/types.ts`.
   - A relative import missing its `.js` extension — this is ESM
     (`"type": "module"`); see `app/src/reducer.ts:8`.
   - A call to a helper that does not exist: `app/src/lib/text.ts` exports
     exactly `slugify`, `truncate`, `normalizeSpaces`. `capitalize`, `camelCase`,
     `deburr` are NOT there.
   - `describe`/`it`/`expect` used without importing them — vitest globals are
     off at run time even though `tsc` accepts them.
   - State read or written outside the sanctioned path: an inline
     `state.tasks.filter(...)` outside `selectors.ts`/`reducer.ts`, or a
     hand-written action object instead of a creator from `app/src/actions.ts`.
5. **Forbidden "fixes"** — if one of these is the only way out, stop and explain
   the real problem instead: `any`, `as any`, `@ts-ignore`, `@ts-expect-error`,
   non-null `!`, loosening a type to silence the checker, editing an existing
   test so it matches the broken behavior, editing `app/src/store.ts` or
   `app/src/types.ts` without approval, or adding an npm package.
6. **Verify:** `cd app && npm test && npm run typecheck` both green, and
   `git diff` shows no suppressed types and no unrelated files touched.

Follow the project conventions in `.cursor/rules/` — `conventions.mdc` (no
`any`/`@ts-ignore`), `do-not-touch.mdc` (protected core), `custom-lib.mdc` (the
real `lib/text.ts` API), `testing.mdc`, `dependencies.mdc`.
