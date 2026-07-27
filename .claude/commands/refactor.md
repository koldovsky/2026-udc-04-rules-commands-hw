---
description: "Refactor selected code to project conventions without changing behavior"
---

Refactor: $ARGUMENTS

1. Read the target code and its colocated test(s) to capture current behavior.
2. Refactor for clarity and to match `.cursor/rules/` conventions: named exports,
   immutable updates, no `any`/`@ts-ignore`, kebab-case files, selectors for
   derived reads, action creators for dispatches.
3. Do NOT change observable behavior or public signatures (`createStore`, action
   creators, `lib/text.ts` functions).
4. Do NOT edit the protected core (`app/src/store.ts`, `app/src/types.ts`) beyond
   agreed additive changes, and add no new dependencies.
5. Run `cd app && npm test` and `npm run typecheck` — the existing tests must
   stay green, proving behavior is unchanged.

Follow the project conventions in `.cursor/rules/` (custom store — NOT
Redux/Zustand; named exports; immutable updates; protected core untouched).

