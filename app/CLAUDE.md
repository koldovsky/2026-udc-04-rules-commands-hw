# CLAUDE.md

Cross-tool baseline for this app. Identical guidance lives in `AGENTS.md` —
this file ensures Claude Code, Windsurf, and other tools that read `CLAUDE.md`
pick up the same rules.

## Commands

- `npm test` — run vitest (once)
- `npm run typecheck` — `tsc --noEmit`
- Lint is **not configured**; do not invent a lint command.

Run from the `app/` directory.

## Code style

- Named exports only (no `export default`).
- No `any` or `@ts-ignore`.
- Immutable state updates (spread, not mutate).
- kebab-case file names.
- Colocated `*.test.ts` files; vitest; AAA pattern.

## Architecture

Custom store in `store.ts` — dispatch/subscribe, NOT Redux/Zustand/MobX.

- State changes only via `store.dispatch(action)`.
- New actions: `types.ts` → `reducer.ts` → `actions.ts`.
- Read state through selectors in `selectors.ts`.
- `src/lib/text.ts` exports exactly: `slugify`, `truncate`, `normalizeSpaces`.

## Guardrails

- `store.ts` and `types.ts` are protected — ask before editing.
- No new npm dependencies without explicit approval.
- Do not add middleware/thunks/async wrappers to the store.
- Run `npm test` after every change; do not break existing tests.
