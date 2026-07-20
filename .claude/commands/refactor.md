---
description: "Refactor selected code to project conventions without changing behavior"
---

Refactor the following (selection, file, or description): $ARGUMENTS

Goal: improve clarity and alignment with project conventions **without** changing
runtime behavior. Follow `.cursor/rules/` (architecture, conventions,
do-not-touch, testing, custom-lib, no-new-deps).

1. Read the target code and nearby modules; understand current behavior before
   editing
2. Refactor to match project style:
   - named exports only
   - no `any` / `@ts-ignore`
   - immutable patterns where state is involved
   - prefer existing helpers (`app/src/actions.ts`, `app/src/selectors.ts`,
     `app/src/lib/text.ts` — only `slugify` / `truncate` / `normalizeSpaces`)
3. DO NOT change observable behavior (outputs, action payloads, reducer results)
4. DO NOT edit protected core `app/src/store.ts` or `app/src/types.ts`
5. DO NOT add npm packages or swap in Redux/Zustand/MobX
6. Keep existing tests green; add a test only if needed to lock current behavior
7. Run `cd app && npm test` after the refactor

Summarize what improved and confirm behavior is unchanged.
