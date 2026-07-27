---
description: "Refactor selected code to project conventions without changing behavior or touching protected core"
---

Refactor the following: $ARGUMENTS

1. Identify the exact code to refactor (the selection, file, or function named
   in $ARGUMENTS). If it's ambiguous which code is in scope, ask before
   changing anything.
2. Apply the conventions in `.cursor/rules/conventions.mdc`: named exports
   only (no `export default`), no `any`/`@ts-ignore`, immutable state updates,
   kebab-case file names.
3. Preserve behavior exactly — no new features, no signature/API changes, no
   change to what existing tests assert. If making the refactor pass would
   require changing an existing test's assertions, stop: that's a behavior
   change, not a refactor.
4. Do not touch `app/src/store.ts` or `app/src/types.ts` (see
   `.cursor/rules/do-not-touch.mdc`) unless the user named one of those files
   explicitly in $ARGUMENTS.
5. Do not add a new dependency to shortcut the refactor
   (`.cursor/rules/dependencies.mdc`).
6. Run `cd app && npm test && npm run typecheck` and confirm both still pass
   with no test assertions changed.

Follow `.cursor/rules/` in full, in particular `architecture.mdc` (custom
store, never Redux/Zustand) and `custom-lib.mdc` (don't invent helpers on
`app/src/lib/text.ts` that don't exist).
