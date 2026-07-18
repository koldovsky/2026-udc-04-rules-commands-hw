---
description: "Refactor a file to project conventions without changing behavior; tests must stay green"
---

Refactor the following file(s) to project conventions, WITHOUT changing
behavior: $ARGUMENTS

1. Read the target file(s) and the rules in `.cursor/rules/` first.
2. Apply only convention-level fixes:
   - convert default exports to named exports;
   - remove `any` / `@ts-ignore` by fixing the actual types;
   - replace in-place mutation with immutable spread / `map` / `filter`;
   - route direct `state.tasks` reads through `app/src/selectors.ts`;
   - replace hand-built action objects with creators from `app/src/actions.ts`;
   - replace hand-rolled string munging with `slugify` / `truncate` /
     `normalizeSpaces` from `app/src/lib/text.ts` where they fit exactly.
3. Do NOT change public signatures, behavior, or tests; do NOT touch
   `app/src/store.ts` or `app/src/types.ts`; do NOT add dependencies.
4. Run `cd app && npm test` and `npm run typecheck` — both green, no test
   edits.
5. Summarize each change as "what → why (which rule)".

If a requested refactor would require touching a protected file or changing
behavior, stop and report instead of doing it.
