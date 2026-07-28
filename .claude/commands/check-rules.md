---
description: "Audit current changes against .cursor/rules and report pass/fail per rule"
---

Audit against the project rule-set: $ARGUMENTS

If `$ARGUMENTS` is empty, audit the current working diff (`git diff` +
`git status`). Otherwise audit the named files/paths. This command is read-only —
report findings, do not fix unless asked.

Check each rule in `.cursor/rules/` and report **PASS / FAIL** with the offending
`file:line` and a one-line fix for any failure:

1. **architecture** — no state library:
   `grep -rniE "redux|zustand|mobx|jotai" app/src app/package.json` → zero.
   New behavior lives in `reducer.ts`/`actions.ts`, not `store.ts`.
2. **conventions** — `grep -rnE "export default|: any|@ts-(ignore|expect-error)"
   app/src` → zero; no in-place mutation (`.push(` / `.splice(` / `x.done =`).
3. **do-not-touch** — `git diff app/src/store.ts` empty; `app/src/types.ts`
   changes are additive only.
4. **custom-lib** — imports from `lib/text` are only `slugify` / `truncate` /
   `normalizeSpaces` (or real new exports) — no hallucinated helpers.
5. **no-new-dependencies** — `git diff app/package.json app/package-lock.json`
   empty unless explicitly approved.
6. **read-through-selectors** — no `state.tasks.filter/map` in consumer code
   outside `reducer.ts` / `selectors.ts`.

Finish with `cd app && npm run typecheck && npm test` and report the result.

Follow the project conventions in `.cursor/rules/` (custom store — NOT
Redux/Zustand; named exports; immutable updates; do not touch `app/src/store.ts`
or `app/src/types.ts` beyond agreed additions).
