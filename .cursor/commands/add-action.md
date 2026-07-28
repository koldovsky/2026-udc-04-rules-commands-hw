---
description: Automatically extends the task board app with a new action following the Golden Path.
arguments:
  - name: actionName
    description: The name of the action variant in camelCase (e.g., setPriority, clearCompleted)
    required: true
  - name: payloadDetails
    description: Type definitions for the action payload (e.g., id: string, priority: 'high' | 'low')
    required: false
---

# Command: Add Action to State Store

You are asked to add a new action called `$actionName` to the application state. You must strictly follow the project's Golden Path and respect all architectural guardrails.

## Steps to Execute:

1.  **Read and Review Rules:** Keep `.cursor/rules/architecture.mdc` and `.cursor/rules/conventions.mdc` active.
2.  **Extend Core Types:**
    *   Temporarily access `app/src/types.ts` only to append the new variant to the `Action` discriminated union.
    *   The type property must match the kebab-case or uppercase conversion of `$actionName` (e.g., `type: "tasks/set-priority"` or `type: "SET_PRIORITY"` based on existing patterns in `types.ts`).
3.  **Handle in Reducer:**
    *   Open `app/src/reducer.ts`.
    *   Add a new `case` block for this action type.
    *   Ensure the state update is **100% immutable** (use spreads, `.map()`, or `.filter()`). Never mutate.
4.  **Create Action Creator:**
    *   Open `app/src/actions.ts`.
    *   Add a named export function for `$actionName` that returns the correct typed action object.
5.  **Write Colocated Test:**
    *   Open or create `app/src/reducer.test.ts`.
    *   Add a dedicated test block for this new action following the **AAA (Arrange-Act-Assert)** pattern.
6.  **Verify Integrity:**
    *   Run `cd app && npm run typecheck` and `npm test` to ensure everything is completely green.

Refuse to alter any other core features inside `store.ts`.
