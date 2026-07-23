# App — Agent Baseline

Cross-tool instructions for AI assistants working inside `app/`.

## Structure

```
app/
├── src/
│   ├── types.ts          # Domain types, Action union, AppState
│   ├── store.ts          # Custom dispatch/subscribe store engine
│   ├── reducer.ts        # Pure reducer: (state, action) → new state
│   ├── actions.ts        # Action creator helpers
│   ├── selectors.ts      # Pure read-derived functions from AppState
│   ├── index.ts          # App entry point
│   ├── lib/
│   │   ├── text.ts       # In-house text utils (slugify, truncate, normalizeSpaces)
│   │   └── text.test.ts
│   ├── reducer.test.ts
│   └── store.test.ts
├── package.json
└── tsconfig.json
```

## Commands

| Task | Command | Notes |
|------|---------|-------|
| Run tests | `npm test` | vitest, runs once |
| Watch tests | `npm run test:watch` | vitest in watch mode |
| Type-check | `npm run typecheck` | `tsc --noEmit` |
| Lint | — | **Not configured.** Do not invent a lint command. |

Run from the `app/` directory.

## Code style

1. **Named exports only** — no `export default`.
2. **No `any` or `@ts-ignore`** — use proper types or `unknown` with narrowing.
3. **Immutable state updates** — spread into new objects/arrays; never `.push()`,
   `.splice()`, or assign to `state.x` directly.
4. **kebab-case file names** — `my-feature.ts`, not `myFeature.ts`.
5. **Colocated tests** — `foo.ts` → `foo.test.ts` in the same directory; use
   vitest and the AAA pattern (Arrange / Act / Assert).

## Architecture

This app uses a **custom minimal store** (`store.ts`): dispatch + subscribe.

- State changes ONLY via `store.dispatch(action)`.
- New behavior: add variant to `Action` union in `types.ts` → handle in
  `reducer.ts` → add creator in `actions.ts`.
- UI reads state through selectors (`selectors.ts`), not by poking at
  `state.tasks` directly.
- This is deliberately NOT Redux, Zustand, MobX, or Jotai. Do not replace it
  with a library.

### Custom library (`src/lib/text.ts`)

Only these three functions exist:

- `slugify(input: string): string`
- `truncate(input: string, maxLength: number, suffix?: string): string`
- `normalizeSpaces(input: string): string`

Do NOT assume `capitalize`, `camelCase`, `deburr`, or any other helper exists.

## Guardrails

- **Do not modify `store.ts` or `types.ts`** without explicit user approval.
  These are protected core files.
- **No new dependencies** — do not `npm install` anything without asking first.
  The only devDependencies are `typescript` and `vitest`.
- **Do not add middleware, thunks, or async wrappers** to the store.
- **Do not break existing tests** — run `npm test` after every change.
