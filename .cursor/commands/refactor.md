---
description: "Refactor selected code to follow project conventions"
---

Do the following for: $ARGUMENTS

1. Refactor the selected code to match project conventions (named exports,
   kebab-case filenames, TypeScript strictness, immutable updates).
2. Do not change behavior or edit protected core files (`app/src/store.ts`,
   `app/src/types.ts`) unless explicitly requested.
3. Add or update tests if the refactor touches behaviour.

Constraints:
- Preserve immutability and avoid `any`/`@ts-ignore`.
- Keep changes small and explain why each change was made.