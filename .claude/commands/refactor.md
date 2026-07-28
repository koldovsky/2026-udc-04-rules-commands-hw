---
description: "Refactor selected/described code to match project conventions, no behavior change"
---

Refactor the following code/area: $ARGUMENTS

1. Identify the smallest change that brings the code in line with
   `.cursor/rules/conventions.mdc` (named exports, no `any`/`@ts-ignore`,
   immutable updates, kebab-case files) **without** altering observable
   behavior.
2. Do not touch `app/src/store.ts` or the existing shape of
   `app/src/types.ts` unless the refactor target explicitly requires it — if
   it seems to, stop and ask instead of editing them (see
   `.cursor/rules/do-not-touch.mdc`).
3. Do not introduce new npm dependencies or a state-management library.
4. Re-run `cd app && npm test` after the change. It must stay green with no
   test assertions changed — if an existing test had to change to keep
   passing, that's a signal the "refactor" changed behavior; stop and flag it
   instead of forcing it through.
5. Summarize what changed and why in 2-3 sentences.

Follow `.cursor/rules/` throughout, in particular `architecture.mdc` and
`do-not-touch.mdc`.
