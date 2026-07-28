---
description: Implement a feature using the project architecture, rules, and validation workflow
---

# Implement feature

Implement the following change:

$ARGUMENTS

Before editing:

1. Inspect the relevant files under `app/src/`.
2. Read the applicable rules in `.cursor/rules/`.
3. Identify whether the task requires changes to protected files:

   * `app/src/store.ts`
   * `app/src/types.ts`

Do not modify protected files without explicit user approval.

Implementation requirements:

* Preserve the custom state-store architecture.
* Route state changes through `store.dispatch(action)`.
* Use action creators from `app/src/actions.ts`.
* Handle state transitions in `app/src/reducer.ts`.
* Keep state updates immutable.
* Use named exports only.
* Do not use `any` or `@ts-ignore`.
* Do not add npm dependencies without approval.
* Use only the existing API from `app/src/lib/text.ts`.

Testing requirements:

* Add or update colocated `*.test.ts` files.
* Structure tests using Arrange–Act–Assert.
* Cover the expected behavior and relevant edge cases.

After implementation, run:

```bash
cd app
npm test
npm run typecheck
```

Report:

* files changed;
* what behavior was implemented;
* tests added or updated;
* commands executed and their actual results;
* any protected file that required modification.
