# Claude Code Project Configuration

## Build & Test Commands
- Navigate to workspace: `cd app`
- Run tests: `npm test`
- Typecheck project: `npm run typecheck`
- Linting: NOT configured in this project. Do not run any linting tools.

## Architectural Integrity
- State Management: Custom store in `app/src/store.ts`. Do NOT add Redux, Zustand, or other state libraries.
- Golden Path for expansion: Modify `types.ts` (Action Union) -> Implement in `reducer.ts` -> Expose via `actions.ts` -> Add colocated test.
- Protected files: Do not edit `app/src/store.ts` or `app/src/types.ts` unless explicitly instructed.

## Code Style & Rules
- Use named exports only. No default exports.
- Enforce strict TypeScript (`noUncheckedIndexedAccess`). No `any`, no `@ts-ignore`.
- Ensure pure immutability inside the reducer.
- Keep tests colocated as `*.test.ts` using vitest and the AAA (Arrange-Act-Assert) pattern.
- The utility `lib/text.ts` only supports: `slugify`, `truncate`, and `normalizeSpaces`.
