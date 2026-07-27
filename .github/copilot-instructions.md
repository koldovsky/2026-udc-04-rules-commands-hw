# Copilot instructions — task-board app (`app/`)

Cross-tool mirror of `.cursor/rules/*.mdc` so GitHub Copilot (VS Code) applies
the same rule-set. Source of truth for domain rules: `materials/architecture-brief.md`.
Keep changes small, typed, and on the golden path.

## Architecture — custom store, golden path

- `app/` uses a hand-written store, **not** a library. `app/src/store.ts`
  exposes `createStore()` → `{ getState, dispatch, subscribe }` and is the ONLY
  sanctioned way state changes.
- Change state ONLY via `store.dispatch(action)`; never assign to `state` or
  task fields directly.
- Extend along the golden path: add an `Action` variant in `app/src/types.ts` →
  handle it in `app/src/reducer.ts` → add an action creator in
  `app/src/actions.ts` → add a colocated `*.test.ts`.
- Read derived state through selectors in `app/src/selectors.ts`, not
  `state.tasks` directly.
- NEVER introduce Redux, Zustand, MobX, Jotai, or Recoil. NEVER replace the
  custom store with `useState`/hooks or a global mutable object.

## Protected core — do not touch

- Treat `app/src/store.ts` and `app/src/types.ts` as DO-NOT-TOUCH by default.
- NEVER edit the `createStore` dispatch/subscribe engine.
- The ONLY sanctioned edit to `app/src/types.ts` is ADDING a new `Action`
  variant (and, when a feature requires it, adding a field to an existing
  interface such as `Task`) — never remove or rename existing members.
- Do NOT change the public signatures of `createStore` or the action creators.
- If a task seems to require deeper changes, STOP and ask for approval first.

## TypeScript conventions

- Use NAMED exports only. NEVER use `export default`.
- NEVER use `any`, `as any`, `@ts-ignore`, or `@ts-expect-error`. Fix the types.
- Update state IMMUTABLY (spread / `map` / `filter`); never mutate in place.
- Source files kebab-case; types/interfaces PascalCase; functions/variables
  camelCase.
- Import types with `import type { ... }`; keep the `.js` extension in relative
  ESM import specifiers.

## Actions & selectors

- Every dispatchable action gets a typed creator in `app/src/actions.ts`; never
  build `{ type, payload }` objects inline at call sites.
- Action creators contain NO logic beyond assembling the payload.
- Derived reads go in `app/src/selectors.ts` as PURE functions of `AppState`.

## Custom text lib — `app/src/lib/text.ts`

- This is a CUSTOM lib, NOT lodash/underscore. The ONLY functions that exist:
  - `slugify(input: string): string`
  - `truncate(input: string, maxLength: number, suffix?: string): string`
  - `normalizeSpaces(input: string): string`
- NEVER call/import helpers that do not exist here (e.g. `capitalize`,
  `camelCase`, `kebabCase`, `startCase`). If a new helper is genuinely needed,
  ADD it as a named export with a colocated test — do not invent an import.

## Dependencies

- Do NOT add npm packages (runtime or dev). Prefer the standard library and the
  existing in-house code.
- NEVER edit `app/package.json` dependencies without explicit approval. If a
  package seems necessary, STOP and ask first.

## Testing

- Colocate every test as `<name>.test.ts` beside the file under test.
- Import from vitest: `import { describe, expect, it } from "vitest";`.
- Structure Arrange → Act → Assert; one behavior per `it`.
- Assert on returned NEW state and immutability (`next !== prev`).
- Keep seeded tests green — never weaken an assertion to make code pass.
- Verify with `cd app && npm test` and `cd app && npm run typecheck`.

