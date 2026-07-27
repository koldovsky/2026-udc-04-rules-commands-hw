# App — Agent Baseline

Cross-tool baseline for Cursor, Claude Code, JetBrains AI, and any other agent
working in the `app/` directory.

## Project structure

```text
app/src/
  types.ts       — domain types (Task, AppState, Filter, Action union) ⚠️ protected
  store.ts       — generic observable store (createStore) ⚠️ protected
  reducer.ts     — pure (state, action) → newState function
  actions.ts     — action creator functions
  selectors.ts   — pure state-derived views
  index.ts       — wires store + reducer + selectors together
  lib/text.ts    — custom text helpers: slugify, truncate, normalizeSpaces ONLY
```

## Commands

```bash
cd app && npm test             # run all tests (Vitest)
cd app && npm run typecheck    # type-check without emitting
```

Note: lint is not configured — do not run `npm run lint`.

## Architecture

Uses a hand-rolled observable store — **NOT Redux, Zustand, MobX, or any
external state library.** The store is a ~40-line implementation in `store.ts`.

**Golden path for any new feature:**
1. Add Action variant to the `Action` union in `types.ts`
2. Handle it in `reducer.ts` (immutably — spread, map, filter; never push/splice)
3. Add action creator function in `actions.ts`
4. Add colocated test in `reducer.test.ts` (Vitest, AAA pattern)

## Code style

- **TypeScript strict, named exports** — no `export default`, `any`, or `@ts-ignore`
- **Immutable reducer, kebab-case filenames** — never mutate state in place; `my-feature.ts` not `myFeature.ts`
- **Colocated Vitest tests** — one `*.test.ts` per module; AAA pattern
- **Action types & text helpers** — `"namespace/verb"` format; only functions from `lib/text.ts`

## Protected files

| File | What's protected |
|------|-----------------|
| `store.ts` | `createStore` signature and return type — do not change |
| `types.ts` | `Task`, `AppState`, `Filter` shapes — do not change; appending to `Action` union is allowed |

If a task seems to require changing `Task` or `createStore`, stop and ask for
human approval before making the change.

## Guardrails

- No secrets, API keys, or credentials in any file
- Do not install external state libraries (Redux, Zustand, etc.)
- Do not replace the custom store with a third-party solution
- No new npm dependencies without explicit approval
- Run `cd app && npm test` to verify changes before marking work complete
