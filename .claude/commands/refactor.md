---
description: "Refactor selected code to match project conventions without changing behavior"
---

Refactor the following code per project conventions: **$ARGUMENTS**

1. Read the target file(s) and nearby tests to understand current behavior.
2. Refactor for clarity and consistency — **no behavior change**.
3. Preserve all public APIs unless the user explicitly asked to change them.

Apply these conventions from `.cursor/rules/`:

- Named exports only; no default exports.
- Strict TypeScript — no `any`, no `@ts-ignore`.
- Immutable patterns where state is involved (spread / `map` / `filter`).
- kebab-case file names; PascalCase for types/interfaces.
- Use existing helpers (`actions.ts`, `selectors.ts`, `lib/text.ts`) instead of
  duplicating logic.

Guardrails:

- Do **not** modify `app/src/store.ts` or `app/src/types.ts`.
- Do **not** swap the custom store for a state library.
- Do **not** add npm dependencies.
- Do **not** invent helpers in `lib/text.ts` beyond `slugify`, `truncate`,
  `normalizeSpaces`.

When done, run `cd app && npm test && npm run typecheck` and confirm both pass.
Summarize what you refactored and why the behavior is unchanged.
