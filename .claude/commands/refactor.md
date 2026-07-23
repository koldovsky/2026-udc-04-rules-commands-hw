---
description: "Refactor selected code following project conventions — no behavior change"
---

Refactor the following code/area: $ARGUMENTS

Follow these steps:

1. **Identify scope** — Determine which files are affected. Read them fully
   before making changes.

2. **Preserve behavior** — The refactor MUST NOT change observable behavior.
   Existing tests must continue to pass without modification.

3. **Apply project conventions** (from `.cursor/rules/`):
   - Named exports only (no `export default`).
   - No `any` or `@ts-ignore` — use proper types or `unknown` with narrowing.
   - Immutable patterns in reducer/state code (spread, not mutate).
   - kebab-case file names.
   - Pure selectors: `(state: AppState) => T`, no side effects.

4. **Do NOT touch protected files** — `app/src/store.ts` and `app/src/types.ts`
   are off-limits unless the user explicitly approves.

5. **Do NOT add dependencies** — solve with existing project code and standard
   library only.

6. **Do NOT change the public API** — exported function signatures remain the
   same unless the user explicitly requests it.

7. **Verify** — Run `npm run typecheck` and `npm test` from `app/`. Both must
   pass. If a test needs updating to reflect a renamed internal, explain why
   before changing it.
