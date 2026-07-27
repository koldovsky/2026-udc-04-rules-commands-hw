---
description: "Refactor code to project conventions without changing observable behavior"
---

Refactor: $ARGUMENTS

This is a **behavior-preserving** change. The test suite must pass before and
after, with the same assertions — if you find yourself editing a test to make it
pass, you have changed behavior: stop and say so instead.

1. **Baseline first.** Run `cd app && npm test` and record the result. If it is
   already red, report that and stop — do not refactor on top of a broken suite.
2. **Read before editing.** Identify what the target code actually does and which
   files import it (`app/src/index.ts` and the `*.test.ts` files are the usual
   consumers).
3. **Apply the conventions** from `.cursor/rules/conventions.mdc`:
   - replace any `export default` with a named export
   - remove `any`, `@ts-ignore`, `@ts-expect-error` — narrow the type instead
   - add `.js` to relative imports; use `import type` for type-only imports
   - make state updates immutable (spread / `map` / `filter`)
   - respect `noUncheckedIndexedAccess`: guard `tasks[0]`, never assert with `!`
   - kebab-case files, PascalCase types, camelCase functions
4. **Apply the layering** from `.cursor/rules/state-access.mdc`: inline action
   object literals move into `app/src/actions.ts`; a `state.tasks.filter/map`
   that appears at more than one call site becomes a selector in
   `app/src/selectors.ts`.
5. **Keep public signatures frozen.** `createStore`, the action creators, and the
   `app/src/lib/text.ts` functions keep their exact parameter lists and return
   types (`.cursor/rules/do-not-touch.mdc`). Extend, never redefine.
6. **Verify.** `cd app && npm run typecheck && npm test` — both green, and the
   test count is unchanged or higher, never lower.
7. **Report** as a short before/after list: what moved where, and which
   convention each change satisfies.

Do NOT, as part of a refactor: touch `app/src/store.ts`, add a dependency,
introduce Redux/Zustand/MobX, rename exported symbols that other files import,
delete tests, or "improve" behavior you were not asked about. Out-of-scope
problems you notice get mentioned in the report, not fixed silently.

If $ARGUMENTS names no file or symbol, ask which code to refactor rather than
picking a target yourself.
