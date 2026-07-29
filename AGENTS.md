# AGENTS.md

Baseline guidance for an Agentic IDE working in **this homework repo**.

> UDC Workshop 4 homework — rules & commands. Participants build a rule-set
> (≥6 rules) and commands (≥2) for the seeded task-board app, generalize the
> thin `app/AGENTS.md` into a cross-tool baseline, and prove the rules work with
> an A/B test. See `docs/walkthrough.md`.

## Context

- `app/` is a tiny TS "task board" with a **custom state store** (deliberately
  NOT Redux/Zustand). It is the code participants write rules for. Key files:
  - `app/src/types.ts` — `AppState`, `Task`, `Action` union (PROTECTED core).
  - `app/src/store.ts` — `createStore` with `dispatch`/`subscribe` (PROTECTED).
  - `app/src/reducer.ts` — pure reducer; where the domain grows.
  - `app/src/actions.ts` — action creators. `app/src/selectors.ts` — read helpers.
  - `app/src/lib/text.ts` — in-house util lib with a fixed API (slugify,
    truncate, normalizeSpaces).
  - Tests are colocated `*.test.ts` (vitest); `cd app && npm test` is green.
- `app/AGENTS.md` (a DIFFERENT file, nested inside `app/`) was the Task B
  target: a thin, single-tool stub, now generalized into a tool-neutral baseline
  (stack, structure, commands, code style, architecture, guardrails). Treat it
  as authoritative for work inside `app/`; `app/CLAUDE.md` is a pointer to it.
- `materials/architecture-brief.md` is the source of truth for the rules the
  participant should write; `materials/ab-task.md` is the change request used
  for the A/B validation (Task D).
- The homework is graded by CodeRabbit (`.coderabbit.yaml`) against the
  Definition of Done in `docs/walkthrough.md`.

## Conventions

- Documentation language: Ukrainian or English (participant's choice).
- Keep deliverables at the agreed paths so auto-review can find them:
  - `.cursor/rules/*.mdc` — Task A rule-set (≥6)
  - `.cursor/commands/*.md` — Task C commands (≥2)
  - `.claude/commands/*.md` — optional cross-tool mirror of the same commands
    (same Markdown + `$ARGUMENTS` format; bonus, pairs well with Task E)
  - `app/AGENTS.md` — generalized in place (Task B)
  - `docs/ab-validation.md` — Task D A/B write-up
  - `docs/cross-tool-check.md` — Task E (bonus)
- The seeded app follows: named exports only, no `any`/`@ts-ignore`, immutable
  state updates, state changes only via `store.dispatch(action)`.

## Guardrails

- **NEVER** commit secrets, API keys, or `.env` files. They are gitignored —
  keep it that way.
- **NEVER** add real client/NDA-protected business details — `app/` and
  `materials/` contain only synthetic, generic sample data on purpose.
- Do not "modernize" the custom store into Redux/Zustand/MobX — that store is
  the architecture the exercise is about.
- Do not change the public signatures of `createStore`, the action creators, or
  the `lib/text.ts` functions when extending the app — only add to them.
- **Windows + Git Bash:** never use `2>nul` / `>nul` (creates a literal `nul`
  file). Use `2>/dev/null` / `>/dev/null`. `nul` is gitignored as a net.

## How to verify

Before opening a PR: `cd app && npm test` is green, `.cursor/rules/` has ≥6
rules each with a "How to verify" section, `.cursor/commands/` has ≥2 commands,
`app/AGENTS.md` is generalized, and `docs/ab-validation.md` shows a real,
specific ON-vs-OFF difference (not placeholders).
