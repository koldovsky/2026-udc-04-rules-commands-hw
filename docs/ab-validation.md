# A/B validation (Task D)

## Goal

Verify whether the project rule-set in `.cursor/rules/` changes the AI's implementation approach when given the same development task.

## Prompt

The following prompt was used without any modifications in both runs:

> Add a task **priority** to the task board:
>
> * Add a `priority` field to `Task`: `"low" | "normal" | "high"` (default `"normal"` for newly added tasks).
> * Add a way to change a task's priority through the normal state flow.
> * Keep everything type-safe and the existing tests green.

Two independent chats were used:

* **Run A** — rules enabled (`.cursor/rules/*.mdc`)
* **Run B** — rules disabled (`.cursor/rules/*.mdc` renamed to `.mdc.off`)

---

# Run A — Rules ON

### Files modified

* `app/src/types.ts`
* `app/src/actions.ts`
* `app/src/reducer.ts`
* `app/src/reducer.test.ts`

### Observations

The implementation followed the expected project architecture:

* `Task` was extended with a typed `priority` field.
* Priority changes were implemented through the existing action → reducer flow.
* The solution remained type-safe.
* Only the files required for the feature were modified.
* Existing architecture and project conventions were preserved.

### Verification

Executed:

```bash
cd app
npm test
```

Result:

* 3 test files passed
* 16 / 16 tests passed

---

# Run B — Rules OFF

### Files modified

* `app/src/types.ts`
* `app/src/actions.ts`
* `app/src/reducer.ts`
* `app/src/reducer.test.ts`
* `app/src/store.test.ts`
* `app/src/index.ts`

### Observations

The generated implementation was also technically correct:

* `priority` was added to `Task`.
* Priority updates used the existing dispatch/reducer flow.
* The solution remained type-safe.

However, the scope of the changes was broader than necessary:

* additional regression tests were added in `store.test.ts`;
* demonstration code in `index.ts` was modified;
* more project files were changed than required to implement the requested feature.

### Verification

Executed:

```bash
cd app
npm test
```

Result:

* 3 test files passed
* 17 / 17 tests passed

---

# Difference table

| Aspect                   | Rules ON | Rules OFF                         |
| ------------------------ | -------- | --------------------------------- |
| Modified files           | 4        | 6                                 |
| Architecture preserved   | ✅        | ✅                                 |
| Used reducer/action flow | ✅        | ✅                                 |
| Type-safe implementation | ✅        | ✅                                 |
| New dependencies         | None     | None                              |
| Minimal implementation   | ✅        | ❌                                 |
| Extra project changes    | No       | Yes (`index.ts`, `store.test.ts`) |

---

# Conclusion

Both runs produced a correct implementation and respected the application's custom state-management architecture.

The primary difference was **implementation scope**.

With the project rules enabled, the AI produced a focused implementation that modified only the files directly required for the feature.

Without the rules, the AI still solved the task correctly but expanded the scope by modifying additional files (`index.ts` and `store.test.ts`) that were not strictly necessary.

Although the rules did not change the overall architecture chosen by the AI, they resulted in a more targeted and predictable implementation with a smaller, easier-to-review change set.
