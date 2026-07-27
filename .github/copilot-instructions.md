# Copilot repo instructions

Please read app/AGENTS.md for the full project context. The snippet below repeats essential guardrails so GitHub Copilot follows project conventions even when prompts are short.

Essential guardrails (excerpt from app/AGENTS.md):

- Named exports only — do not add default exports.
- Do not use `any`, `@ts-ignore` or `@ts-expect-error`.
- Immutable state updates only: never mutate objects/arrays; use spread/map/filter.
- Do not edit `src/store.ts` or change public signatures in `src/types.ts`.
- Do not add new npm dependencies unless explicitly requested.
- Filenames: kebab-case. Types/interfaces: PascalCase.
- Keep explicit `.js` extension in runtime imports from `.ts` files (e.g., `import {X} from "./types.js"`).
- Tests: use Vitest, colocate tests next to implementation files, import test helpers explicitly from "vitest".

If a task conflicts with these guardrails, ask for clarification rather than assuming.
