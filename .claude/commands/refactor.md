---
description: "Refactor code to match project conventions without changing behavior or touching protected core"
---

Refactor the following for: $ARGUMENTS

1. Identify the code to refactor (a file, function, or the area described in the argument) and confirm current tests pass before starting: `cd app && npm test`.
2. Refactor for clarity and convention only — no behavior change, no new dependencies, no new files unless genuinely necessary.
3. Bring the code in line with project conventions: named exports only, no `any`/`@ts-ignore`, immutable updates for any reducer-adjacent state handling, kebab-case filenames, `.js` extensions in relative imports.
4. Do NOT modify `app/src/store.ts` or restructure `app/src/types.ts` as part of this refactor — if the refactor seems to require touching either, stop and ask first instead.
5. Re-run `cd app && npm test && npm run typecheck` and confirm they still pass with no behavior change.

Follow the project conventions in `.cursor/rules/` (custom store — NOT
Redux/Zustand; named exports; immutable updates; do not touch app/src/store.ts
or app/src/types.ts beyond agreed additions).
