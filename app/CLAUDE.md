# App — Agent Baseline (Claude Code)

Cross-tool baseline for Claude Code working in the `app/` directory.
See also `AGENTS.md` in this directory for the same content in AGENTS format.

## Project structure

```
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
cd app && npm test        # run all tests (Vitest)
```

Note: lint is not configured — do not invent an `npm run lint` command.

## Architecture

Uses a hand-rolled observable store — **NOT Redux, Zustand, MobX, or any
external state library.** The store is a ~40-line implementation in `store.ts`.

**Golden path for any new feature:**
1. Add Action variant to the `Action` union in `types.ts`
2. Handle it in `reducer.ts` (immutably — spread, map, filter; never push/splice)
3. Add action creator function in `actions.ts`
4. Add colocated test in `reducer.test.ts` (Vitest, AAA pattern)

## Code style

- **Named exports only** — no `export default` anywhere
- **No `any`, no `@ts-ignore`** — TypeScript strict mode is on
- **Immutable reducer** — never mutate `state`; always return new objects/arrays
- **Kebab-case filenames** — `my-feature.ts`, not `myFeature.ts`
- **Colocated tests** — `foo.ts` → `foo.test.ts` in the same directory
- **Action type format** — `"namespace/verb"` (e.g. `"task/added"`, `"filter/set"`)
- **Text helpers** — only `slugify(s)`, `truncate(s, n, suffix?)`,
  `normalizeSpaces(s)` from `lib/text.ts`; no lodash, no invented helpers

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
