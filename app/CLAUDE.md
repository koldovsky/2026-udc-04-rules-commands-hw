# CLAUDE.md

This app follows a single cross-tool baseline. See [AGENTS.md](./AGENTS.md) for
the project structure, commands, code style, architecture (custom store — **not**
Redux/Zustand), and guardrails.

Claude Code should treat `AGENTS.md` as the source of truth and follow the same
golden path: add an `Action` variant in `src/types.ts` → handle it immutably in
`src/reducer.ts` → add an action creator in `src/actions.ts` → add a colocated
`*.test.ts`. Do not edit the protected core (`src/store.ts`, `src/types.ts`)
beyond additive changes, and do not add dependencies without approval.

