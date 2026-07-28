---
description: "Refactor selected code to project conventions without changing behavior"
---

Refactor: $ARGUMENTS

Improve the named code (file, function, or selection) **without changing its
observable behavior**. This is a cleanup, not a feature change.

1. **Understand** — read the target and its colocated `*.test.ts`. Note the
   current public surface (exported names/signatures) — it must not change.
2. **Refactor** — align to project conventions: named exports, no `any` /
   `@ts-ignore`, immutable updates (spread / `map` / `filter`), reads via
   `app/src/selectors.ts` rather than inline `state.tasks` filtering, and
   kebab-case files / PascalCase types.
3. **Do not** touch the protected core (`app/src/store.ts`, `app/src/types.ts`),
   add npm dependencies, or introduce a state library.
4. **Verify** — behavior is unchanged: `cd app && npm run typecheck && npm test`
   stay green. Add a test only if you uncover an untested branch.
5. Summarize what changed and why (structure/readability), confirming no
   behavioral or signature change.

Follow the project conventions in `.cursor/rules/` (custom store — NOT
Redux/Zustand; named exports; immutable updates; do not touch `app/src/store.ts`
or `app/src/types.ts` beyond agreed additions).
