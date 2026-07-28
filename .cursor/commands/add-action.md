---
description: "Add a new Action end-to-end via the golden path (types -> reducer -> actions -> test)"
---

Add a new Action variant for: $ARGUMENTS

1. Add the new variant to the `Action` discriminated union in `app/src/types.ts`, alongside the existing `task/added`, `task/toggled`, `task/removed`, and `filter/set` variants — this is the one sanctioned addition to that protected file.
2. Handle the new action in `app/src/reducer.ts`: return a new state immutably (spread/`map`/`filter`), never mutate `state` in place.
3. Add a matching action creator in `app/src/actions.ts`, next to `addTask`/`toggleTask`/`removeTask`/`setFilter`, using named exports only.
4. Add a colocated test in `app/src/reducer.test.ts` (Arrange-Act-Assert, vitest) covering the new behavior.
5. Run `cd app && npm test && npm run typecheck` and confirm both pass.

Follow the project conventions in `.cursor/rules/` (custom store — NOT
Redux/Zustand; named exports; immutable updates; do not touch app/src/store.ts
or app/src/types.ts beyond agreed additions).
