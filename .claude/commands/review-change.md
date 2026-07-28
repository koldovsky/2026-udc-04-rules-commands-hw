---
description: Review the current changes against project rules, architecture, conventions, and tests
---

# Review change

Review the current implementation for the following task or concern:

$ARGUMENTS

Inspect the current git diff and relevant files.

Read the applicable rules in `.cursor/rules/` before reviewing the changes.

Check architecture:

* State changes go through `store.dispatch(action)`.
* Actions are represented by the `Action` union.
* State transitions are handled in `app/src/reducer.ts`.
* Action creators are used instead of constructing action objects in consumers.
* Selectors are reused instead of duplicating derived-state logic.
* The custom store has not been replaced with Redux, Zustand, MobX, Jotai, or another state library.

Check guardrails:

* `app/src/store.ts` was not modified without explicit approval.
* `app/src/types.ts` was not modified without explicit approval.
* No npm dependency was added, removed, or upgraded without approval.
* No unsupported function was imported from `app/src/lib/text.ts`.

Check conventions:

* Named exports only.
* No `any`.
* No `@ts-ignore`.
* Immutable state updates.
* New filenames use kebab-case.
* Tests are colocated as `*.test.ts`.

Check testing:

* Behavior changes have corresponding Vitest coverage.
* Tests follow Arrange–Act–Assert.
* Relevant edge cases are covered.
* Test results are not claimed unless commands were actually run.

Run when possible:

```bash
cd app
npm test
npm run typecheck
```

Return the review in this order:

1. Blocking issues
2. Non-blocking issues
3. Validation results
4. Final verdict

For every issue, include:

* file path;
* specific problem;
* why it violates a project rule;
* concrete recommended fix.

Do not invent lint results because this project has no lint command.
