# Agent Development Baseline & Project Context

This document serves as the cross-tool source of truth for all AI agents, code assistants, and LLM engines working on this repository. It defines the project architecture, operational boundaries, and system expectations.

## Project Structure & Architecture

The application is a minimal task board built around a strict, custom state management architecture.

*   `app/src/types.ts` — **Protected Core**. Contains `AppState`, `Task`, and the `Action` discriminated union.
*   `app/src/store.ts` — **Protected Core**. Custom in-house reactive store returning `{ getState, dispatch, subscribe }`.
*   `app/src/reducer.ts` — Pure state reducer `(state, action) => newState`.
*   `app/src/actions.ts` — Action creator functions for UI consumption.
*   `app/src/selectors.ts` — Pure read-helpers and data selectors.
*   `app/src/lib/text.ts` — In-house custom text utility library with a fixed API surface.

### Architecture Warning
This project uses a custom state store. It is **NOT** Redux, Zustand, MobX, or Jotai. Do not attempt to install, import, or refactor the app into any third-party state library.

## Available Commands

Execute all developer operations from the `app` directory:

```bash
cd app
npm test            # Run unit tests via vitest
npm run typecheck   # Run static type checking via tsc --noEmit
```

*Note on Linting:* Linter configurations (ESLint/Prettier) are **NOT configured** in this sample repository. Do not guess, invent, or execute any lint commands.

## Code Style & Conventions

Agents must strictly adhere to the following 5 development conventions:
1.  **Named Exports Only:** Use `export const ...`. Default exports (`export default`) are strictly prohibited.
2.  **Immutability:** Reducer updates must be 100% immutable using array/object spreads, `.map()`, or `.filter()`. Never mutate state arrays or properties in place.
3.  **Strict TypeScript:** The codebase enforces `noUncheckedIndexedAccess`. Usage of `any` or `@ts-ignore` comments is entirely banned.
4.  **Naming Patterns:** Files must use `kebab-case` (e.g., `text-utils.ts`). Types and interfaces must use `PascalCase`.
5.  **Test Colocation:** Unit tests must live immediately next to the implementation file using the `*.test.ts` naming convention.

## Guardrails & Constraints

*   **Protected Engine Core:** Do not modify `app/src/store.ts` or `app/src/types.ts` during normal feature workflows. New behaviors should be built by expanding `reducer.ts` and `actions.ts`.
*   **No New Dependencies:** Third-party npm packages must not be added to `package.json` without explicit developer instructions.
*   **Fixed Library Surface:** The custom utility `app/src/lib/text.ts` exposes exactly three functions: `slugify`, `truncate`, and `normalizeSpaces`. No other helpers (e.g., `capitalize`, `camelCase`) exist. Do not hallucinate them.
