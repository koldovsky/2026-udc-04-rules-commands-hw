---
description: "Refactor code to project conventions without changing behavior or touching the protected core"
---

Refactor: $ARGUMENTS

Behavior-preserving cleanup only — the public API and observable behavior must
stay identical.

1. **Baseline first**: run `cd app && npm test` and note it is green. If it is
   already red, report that and stop.
2. **Report before editing**: list the concrete smells you found and the
   planned change for each (e.g. "inline `state.tasks.filter` in `index.ts` →
   reuse `visibleTasks` selector"). No speculative rewrites.
3. **Apply the project conventions**:
   - named exports only, no `export default`;
   - no `any` / `as any` / `@ts-ignore` / `!` — fix types properly
     (`noUncheckedIndexedAccess` is on, so use `?.` / guards);
   - immutable updates (spread / `map` / `filter`), never `push`/`splice`/
     `sort` / property assignment on state;
   - relative imports end in `.js`; type-only imports use `import type`;
   - explicit parameter and return types on exported functions;
   - dispatch only via action creators; derived reads via `selectors.ts`.
4. **Do NOT**: change function signatures or exported names, add or remove
   features, add npm dependencies, reformat unrelated files, edit
   `app/src/store.ts` or `app/src/types.ts` (stop and ask if the refactor
   seems to require it).
5. **Prove behavior is unchanged**: `cd app && npm run typecheck && npm test`
   must be green **without modifying existing test expectations**. If a test
   had to change, that is a behavior change — revert and report instead.
6. **Summarize**: a short before/after table (file, smell, fix) and confirmation
   that no protected file appears in `git diff --name-only`.

Follow the project conventions in `.cursor/rules/` (`conventions.mdc`,
`state-access.mdc`, `do-not-touch.mdc`, `custom-lib.mdc`) and `app/AGENTS.md`.

