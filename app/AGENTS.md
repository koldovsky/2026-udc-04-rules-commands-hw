# Project baseline — agent guidance

This file describes the project layout, commands, conventions, architecture, and guardrails in a tool-agnostic way so any assistant (Cursor, Claude Code, Copilot flows, etc.) can follow the same expectations.

## Project structure

- app/: the sample task-board TypeScript app. Key files:
  - app/src/types.ts — core domain types and Action union (protected core)
  - app/src/store.ts — createStore() (dispatch/subscribe) — protected core
  - app/src/reducer.ts — pure reducer where new behavior is implemented
  - app/src/actions.ts — action creators
  - app/src/selectors.ts — read helpers
  - app/src/lib/text.ts — small in-house text utilities (fixed API)
  - app/src/*.test.ts — colocated tests (vitest)

## Commands

Run inside the `app/` directory:

- npm test        # run vitest
- npm run typecheck   # run tsc --noEmit

Note: linting is NOT configured in this sample; do not invent or assume a lint command.

## Conventions / code style

- TypeScript, strict types — avoid `any` and `@ts-ignore`.
- Named exports only (no default exports).
- Prefer small, pure functions and functional style where sensible.
- Keep code readable and add short comments for non-obvious logic.
- Files use kebab-case; types and interfaces use PascalCase.

## Architecture / golden path

This project uses a tiny, custom state store (NOT Redux/Zustand/MobX). Follow this golden path when adding features:

1. Extend the `Action` discriminated union in `app/src/types.ts`.
2. Implement handling for the new action in `app/src/reducer.ts` — immutably.
3. Add a corresponding action creator in `app/src/actions.ts`.
4. Add a colocated test in `app/src/*.test.ts` that verifies behavior.

Do NOT swap the store for a library; the custom store (`app/src/store.ts`) is intentional.

## In-house library

`app/src/lib/text.ts` exposes exactly:

- slugify(input: string): string
- truncate(input: string, maxLength: number, suffix?: string): string
- normalizeSpaces(input: string): string

Do not assume other helpers exist unless explicitly added.

## Guardrails

- Do not change `app/src/store.ts` except with explicit approval (it's protected core).
- Treat `app/src/types.ts` as protected: small, additive type changes (new Action variants, optional fields) are allowed when following the golden path; do not rewrite types arbitrarily.
- No new npm dependencies without approval.
- Preserve named exports, immutability in reducer, and colocated tests.

## When you change code

- Explain what changed and why in a short commit message or code comment near non-obvious changes.
- Keep tests green: run `cd app && npm test` after non-trivial edits.

This file is the cross-tool baseline — keep language tool-agnostic and concise so multiple assistants can follow the same rules.
