# AGENTS.md

Baseline guidance for any Agentic IDE working in this **task-board app**
(`app/`). Tool-agnostic — Cursor, Claude Code, Copilot, etc.

## Stack

- TypeScript (strict, `noUncheckedIndexedAccess`)
- Vitest for tests
- Custom in-house state store (not Redux / Zustand / MobX / Jotai)

## Project structure

| Path | Role |
|---|---|
| `src/types.ts` | `AppState`, `Task`, `Action` union, `initialState` — **protected core** |
| `src/store.ts` | `createStore` (`getState` / `dispatch` / `subscribe`) — **protected core** |
| `src/reducer.ts` | Pure reducer — where new domain behavior is handled |
| `src/actions.ts` | Action creators (`addTask`, `toggleTask`, `removeTask`, `setFilter`) |
| `src/selectors.ts` | Read helpers (`visibleTasks`, `remainingCount`) |
| `src/lib/text.ts` | In-house text utils: `slugify`, `truncate`, `normalizeSpaces` only |
| `src/*.test.ts` | Colocated vitest tests |

## Commands

Run from `app/`:

```bash
npm test            # vitest run
npm run typecheck   # tsc --noEmit
```

Lint is **not** configured in this sample — do not invent a lint script.

## Code style

- Named exports only — no default exports
- No `any`, no `@ts-ignore` / `@ts-expect-error`
- Immutable state updates in the reducer (spread / `map` / `filter`)
- File names: kebab-case; types/interfaces: PascalCase
- Prefer selectors for reads; prefer action creators over hand-built actions

## Architecture

State changes **only** via `store.dispatch(action)`.

Golden path to extend the app:

1. Add an `Action` variant in `types.ts` (when explicitly allowed for the feature)
2. Handle it immutably in `reducer.ts`
3. Add an action creator in `actions.ts`
4. Add a colocated `*.test.ts`

Do **not** replace the custom store with Redux, Zustand, MobX, or similar.

## Guardrails

- Do not edit `src/store.ts` or `src/types.ts` without explicit approval
- Do not add/upgrade/remove npm packages without explicit approval
- Do not change public signatures of `createStore`, existing action creators, or
  `lib/text.ts` functions — only add to them when extending
- Keep `npm test` green
