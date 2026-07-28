---
description: Validate the rule-set, commands, AGENTS.md, and homework deliverables
---

# Validate rules

Validate the repository rule-set and homework deliverables.

Optional focus:

$ARGUMENTS

## Rule-set checks

Inspect all files in:

```text
.cursor/rules/
```

Verify that:

* at least 6 `.mdc` files exist;
* every rule contains valid frontmatter;
* every rule contains:

  * `Context`
  * `Rule`
  * `How to verify`;
* rules reference real project files;
* instructions are specific and actionable;
* rules do not contradict each other.

Check the required rules:

* `architecture.mdc`
* `conventions.mdc`
* `do-not-touch.mdc`
* `testing.mdc`
* `custom-lib.mdc`
* at least one additional custom rule

## Required content checks

Confirm that the rules enforce:

* the custom store architecture;
* state changes only through `store.dispatch(action)`;
* new actions through the `Action` union and reducer;
* no Redux, Zustand, MobX, or similar replacement;
* named exports only;
* no `any` or `@ts-ignore`;
* immutable state updates;
* kebab-case filenames;
* colocated Vitest tests;
* Arrange–Act–Assert test structure;
* protected `app/src/store.ts` and `app/src/types.ts`;
* only the real API from `app/src/lib/text.ts`;
* no new npm dependencies without approval.

## Frontmatter checks

Confirm that the required configuration matches the homework:

* `architecture.mdc` uses `app/**`;
* `conventions.mdc` uses `app/**/*.ts`;
* `do-not-touch.mdc` has `alwaysApply: true`;
* `testing.mdc` uses `app/**/*.test.ts`;
* `custom-lib.mdc` uses `app/src/lib/**`.

## Other deliverables

Verify that:

* `.cursor/commands/` contains at least 2 command files;
* command files use `$ARGUMENTS` where appropriate;
* `app/AGENTS.md` is tool-neutral and not Cursor-specific;
* `docs/ab-validation.md` contains a real ON-versus-OFF comparison if it exists.

## Application validation

Run:

```bash
cd app
npm test
npm run typecheck
```

Do not invent lint results because no lint command is configured.

## Output format

Return:

1. Missing requirements
2. Rule conflicts
3. Frontmatter issues
4. Validation command results
5. Final checklist with PASS or FAIL for each homework requirement

For every failure, include the exact file and a concrete correction.
