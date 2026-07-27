---
description: "Analyze an error/stack trace, find the root cause, propose a fix"
---

# Analyze Error

Analyze this error for: $ARGUMENTS

1. Read the error message/stack trace and locate the failing code path in
   `app/src`.
2. Identify the root cause — don't just describe the symptom.
3. Propose a fix that resolves the root cause without using `@ts-ignore`,
   `@ts-expect-error`, or `any` to silence the error.
4. Do not edit `app/src/store.ts` or `app/src/types.ts` unless the root cause
   genuinely requires a new `Action` variant there (in which case follow the
   `/add-action` flow) — prefer a fix in `reducer.ts`, `actions.ts`,
   `selectors.ts`, or the calling code.
5. Add or update a colocated test that reproduces the failure and confirms
   the fix.

Follow the project conventions in `.cursor/rules/` (custom store — NOT
Redux/Zustand; named exports; immutable updates; do not touch
`app/src/store.ts` or `app/src/types.ts` beyond agreed additions). Run
`cd app && npm test` after and confirm it's green.
