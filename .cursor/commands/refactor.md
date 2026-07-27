---
description: "Refactor selected code to project conventions without behavior change"
---

# Refactor

Refactor the following to match project conventions: $ARGUMENTS

Follow `.cursor/rules/` (`conventions.mdc`, `architecture.mdc`,
`do-not-touch.mdc`, `actions-selectors.mdc`, `custom-lib.mdc`).

1. Scope the target from `$ARGUMENTS` (file, symbol, or selection). Read
   neighboring code and match its style.
2. Improve structure/readability **without** changing observable behavior:
   - named exports only; no `any` / `@ts-ignore`
   - immutable updates if touching reducer-like logic
   - prefer action creators / selectors over hand-built actions or raw state
     poking
   - use only real `lib/text.ts` APIs
3. **Do not** edit `app/src/store.ts` or expand `app/src/types.ts` during a
   pure refactor. Do not swap the custom store for Redux/Zustand/MobX. Do not
   add dependencies.
4. Keep public signatures of existing creators and `lib/text.ts` functions
   stable unless `$ARGUMENTS` explicitly asks otherwise.
5. Run relevant colocated tests: `cd app && npm test`. Behavior must stay the
   same (tests still pass; no new failing cases).

Summarize: what changed stylistically and what was deliberately left alone.
