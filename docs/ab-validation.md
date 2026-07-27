# A/B validation (Task D)

**Rule(s) under test:** architecture.mdc + conventions.mdc + protected-files.mdc +
action-pattern.mdc + testing.mdc
**Prompt (same for A and B):**
> Add a task priority to the task board:
> - Add a `priority` field to `Task`: "low" | "normal" | "high" (default "normal" for newly added tasks).
> - Add a way to change a task's priority through the normal state flow.
> - Keep everything type-safe and the existing tests green.

**Tool used:** Claude Code (this session, with `app/AGENTS.md` + `app/CLAUDE.md` loaded)

---

## Result A — rules ON

AI (Claude Code з завантаженим AGENTS.md/CLAUDE.md) виконав такі зміни:

**Перед реалізацією** AI явно зазначив:
> ⚠️ Зміна захищеного типу Task. Відповідно до protected-files.mdc, додавання поля до Task потребує явного підтвердження. Завдання materials/ab-task.md авторизує цю зміну — продовжую.

**Змінені файли:**

`app/src/types.ts`:
- Додано `export type Priority = "low" | "normal" | "high"`
- Додано поле `priority: Priority` до інтерфейсу `Task`
- Додано новий variant до `Action` union: `{ type: "task/prioritized"; payload: { id: TaskId; priority: Priority } }`

`app/src/reducer.ts`:
- Оновлено `case "task/added"` — тепер включає `priority: "normal"` у новий об'єкт задачі
- Додано новий `case "task/prioritized"` з іммутабельним оновленням через `.map()` і spread

`app/src/actions.ts`:
- Оновлено import (`Priority` додано)
- Додано `export function setPriority(id: TaskId, priority: Priority): Action`

`app/src/reducer.test.ts`:
- Оновлено існуючий тест "adds a task as not done" → включає `priority: "normal"` в toEqual
- Оновлено inline `AppState` в тесті "unknown id toggle" → додано `priority: "normal"`
- Додано 2 нових тести в AAA-форматі:
  - "sets a task priority immutably" — перевіряє зміну priority і незмінність попереднього стану
  - "ignores setPriority for an unknown task id" — edge case

**Результат:** `cd app && npm test` — 17/17 tests passed ✅

**Дотримані правила:**
- ✅ Золотий шлях: Action union → reducer case → action creator → тест
- ✅ Іммутабельне оновлення (`state.tasks.map(...)` зі spread)
- ✅ Named exports (немає `export default`)
- ✅ TypeScript strict (без `any`, без `@ts-ignore`)
- ✅ Action type format: `"task/prioritized"` (`"namespace/verb"`)
- ✅ Colocated тест в `reducer.test.ts` (не в окремій папці)
- ✅ Нові залежності відсутні
- ✅ `store.ts` не змінено

---

## Result B — rules OFF

**Умови тесту:** чистий код (Result A відкочено через `git restore`),
новий чат Claude Code БЕЗ `app/AGENTS.md` і `app/CLAUDE.md`.

**Результат з `docs/ab-result-b.md` + `git diff`:**

- `types.ts`: `Priority` type, `priority: Priority` в `Task`,
  нова дія **`"task/priority-set"`** в `Action` union
- `reducer.ts`: `case "task/priority-set"` з `.map()` і spread,
  `priority: "normal"` у `task/added`
- `actions.ts`: `setPriority(id, priority)` — named export
- `reducer.test.ts`: 2 нових тести ("sets a task's priority",
  "preserves other task properties when changing priority"), Vitest

**npm test:** 17/17 green ✅

**Що відрізняється від Result A:**
1. ❌ **Назва action type:** `"task/priority-set"` замість `"task/prioritized"` —
   не дотримано past-participle конвенції task-дій, закріпленої в `action-pattern.mdc`
   (`task/added`, `task/toggled`, `task/removed`, `task/prioritized`).
2. ❌ **Жодного попередження про protected-файл** — змінив `Task` без `⚠️`.
3. ❌ **Тест на edge case відсутній** — Result A написав "ignores setPriority
   for unknown id"; Result B написав тест на збереження властивостей (інший фокус).

---

## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| Action type name | ✅ `"task/prioritized"` (past-participle — відповідає конвенції task-дій) | ⚠️ `"task/priority-set"` (compound noun-verb — не відповідає past-participle патерну) |
| Попередження про protected type | ✅ Явне `⚠️` перед зміною `Task` | ❌ Без попередження |
| Golden path усвідомлено | ✅ Явно названо кожен крок архітектури | ❌ Просто виконав |
| Edge case тест | ✅ "ignores unknown id" | ❌ Відсутній |
| Immutability | ✅ `.map()` зі spread | ✅ `.map()` зі spread |
| Export style | ✅ Named export | ✅ Named export |
| Type safety | ✅ `Priority` type | ✅ `Priority` type |
| Dependencies | ✅ Нових немає | ✅ Нових немає |
| npm test | ✅ 17/17 | ✅ 17/17 |

---

## Conclusion

Тест з чистою базою виявив конкретну розбіжність: без `action-pattern.mdc` AI
обрав назву `"task/priority-set"` замість `"task/prioritized"`, не дотримавшись
past-participle конвенції task-дій, закріпленої в правилі. Також відсутнє
попередження про зміну захищеного типу (`protected-files.mdc`) і edge case тест
на невідомий id. Великі конвенції (immutability, Vitest, named exports, typed union)
збіглися — бо вони очевидні з існуючого коду. Правила найбільше важать там де
конвенція тонка і не самоочевидна: точний формат імен і явне попередження перед
зміною публічного контракту.
