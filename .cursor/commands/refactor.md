---
description: "Refactor the given code to project conventions — behavior unchanged, tests untouched, protected core untouched"
---

# /refactor

Refactor to this project's conventions, without changing behavior: $ARGUMENTS

1. **Establish the baseline first:** `cd app && npm test` must be green before
   you start. If it is red, this is not a refactor — stop and use
   `/analyze-error` instead.
2. **Preserve every public signature.** `createStore`, the action creators in
   `app/src/actions.ts`, and the three functions in `app/src/lib/text.ts` keep
   their exact parameters and return types. You may add alongside them; you may
   not change or remove them.
3. **Apply the house style:** named exports only (never `export default`); no
   `any`/`@ts-ignore`/`@ts-expect-error`/non-null `!`; an explicit return type on
   every exported function; `import type { ... }` for type-only imports; `.js`
   extension on relative imports; kebab-case file names, PascalCase types,
   camelCase functions.
4. **Restore the state boundary.** Move any inline `state.tasks.filter/map/
   reduce` found outside `app/src/selectors.ts` and `app/src/reducer.ts` into a
   named selector in `selectors.ts`. Replace any hand-written action object
   literal with the matching creator from `app/src/actions.ts`. Keep reducer
   updates immutable — spread/`map`/`filter`, never `push`/`splice`/assignment.
5. **Do not:** edit `app/src/store.ts` or `app/src/types.ts`; edit existing
   tests; add or swap an npm dependency; introduce Redux/Zustand/MobX/Jotai;
   rename a file that others import without updating every import.
6. **Verify:** `cd app && npm test` — the same tests pass, none of them modified
   — plus `npm run typecheck`. Then check `git diff --stat`: it must not list
   `app/src/store.ts`, `app/src/types.ts`, `app/package.json`, or any `*.test.ts`
   you were not asked to touch.

Follow the project conventions in `.cursor/rules/` — `conventions.mdc`,
`state-access.mdc`, `architecture.mdc`, `do-not-touch.mdc`, `dependencies.mdc`,
`testing.mdc`.
