---
description: "Refactor selected code to match project conventions without changing behavior or touching protected files"
---

# Refactor

Refactor: $ARGUMENTS

1. Preserve behavior exactly — no observable change in inputs/outputs. If you
   can't refactor without changing behavior, stop and say so instead of
   guessing.
2. Do not touch `app/src/store.ts`. Only touch `app/src/types.ts` for
   explicitly requested additive changes (new `Action` variants or fields) —
   never rename or remove existing exports (see
   `.cursor/rules/do-not-touch.mdc`).
3. Match `.cursor/rules/conventions.mdc`: named exports only, no
   `any`/`@ts-ignore`, immutable updates, kebab-case filenames, `.js`-
   extension relative imports, `import type` for type-only imports.
4. Keep existing tests green (`cd app && npm test`); update colocated tests
   only if the refactor changes a shape they assert on directly.
5. Touch only files needed for this refactor — no drive-by cleanup of
   unrelated code, even if you notice something else worth fixing.
6. Summarize what changed and why before finishing.

Follow `.cursor/rules/` for anything not covered above.
