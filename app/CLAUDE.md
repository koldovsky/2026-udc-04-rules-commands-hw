# CLAUDE.md — task board app (`app/`)

Follow [`AGENTS.md`](./AGENTS.md) in this folder — it is the tool-agnostic
baseline (stack, structure, commands, code style, architecture, guardrails)
for every agent working in `app/`.

Quick reminders:

- State changes only via `store.dispatch(action)` — custom store, **not**
  Redux/Zustand/MobX.
- Extend via `src/types.ts` (`Action` variant) → `src/reducer.ts` →
  `src/actions.ts` → colocated `*.test.ts`.
- `src/store.ts` and `src/types.ts` are protected — ask before editing.
- `cd app && npm test` and `npm run typecheck`; there is **no** lint script.

Repo-wide context lives in the root [`AGENTS.md`](../AGENTS.md); detailed rules
in `.cursor/rules/*.mdc`.

