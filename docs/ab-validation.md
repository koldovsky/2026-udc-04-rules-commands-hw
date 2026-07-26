# A/B validation (Task D)

**Правила під тестом:** `do-not-touch.mdc`, `architecture.mdc`,
`state-access.mdc`, `conventions.mdc`, `testing.mdc` (решта — `custom-lib.mdc`,
`dependencies.mdc` — у цьому завданні не активувалися: задача не торкається
`lib/text.ts` і не потребує залежностей).

**Промпт (однаковий для A і B):** change request з `materials/ab-task.md` —
додати поле `priority` до `Task` + спосіб його змінювати, типобезпечно,
наявні тести зелені.

**Інструмент:** Claude Code (Opus 5), новий чат на кожен запуск. Правила
підключені через `@`-імпорти `.cursor/rules/*.mdc` у кореневому `CLAUDE.md`.

## Result A — rules ON

Агент пішов golden path із `architecture.mdc` у правильному порядку, файл за файлом:

| Крок | Файл | Що зробив |
|---|---|---|
| 1 | `app/src/types.ts` | `Priority = "low" \| "normal" \| "high"`, поле `Task.priority?`, варіант `task/prioritized` у `Action` union |
| 2 | `app/src/reducer.ts` | `case "task/prioritized"` через `.map()` + spread — без мутації |
| 3 | `app/src/actions.ts` | creator `setTaskPriority(id, priority): Action` |
| 4 | `app/src/selectors.ts` | `taskPriority(task)` → `task.priority ?? "normal"` |
| 5 | `app/src/reducer.test.ts`, `app/src/selectors.test.ts` | +5 тестів (happy / immutability / unknown-id + 2 на селектор) |

Що правила змінили в поведінці — конкретні, спостережувані ефекти:

- **Зупинився на protected core.** `do-not-touch.mdc` вимагає явного дозволу на
  `types.ts`. Агент назвав файл, сказав, що промпт користувача = дозвіл на
  саме це поле, і лише тоді редагував. З `types.ts` **нічого не видалено** —
  `git diff HEAD -U0 -- app/src/types.ts | grep -c '^-[^-]'` → `0`.
- **`priority?` опційне, не обов'язкове.** Правило `do-not-touch.mdc` прямо
  каже: `prefer an optional field (priority?) so reducer.ts:17 and
  reducer.test.ts:36 still typecheck`. Обов'язкове поле зламало б typecheck
  наявного тесту — агент це передбачив до запуску тестів, а не після падіння.
- **Дефолт `"normal"` НЕ вписаний у reducer.** `reducer.test.ts:9` порівнює
  доданий task через `toEqual` — `priority: "normal"` там впав би. Замість
  правити тест (заборонено: `NEVER delete, weaken, or rewrite an existing test`)
  агент зробив «відсутнє = normal» і виніс дефолт у селектор `taskPriority`.
- **Іменування взято з сусідів.** `state-access.mdc` вимагає lowercase
  `domain/event`, past tense для task-подій → `task/prioritized` (не
  `SET_PRIORITY`, не `task/priority-set`). Payload вкладений: `payload: { id, priority }`.
- **Читання через селектор.** `index.ts` показує пріоритет через `taskPriority`,
  а не інлайн-`.map()` по `state.tasks` — цього вимагає `state-access.mdc`.
- **Тест колокований і за конвенцією.** `testing.mdc` вимагає три `it()` на
  новий reducer-case (happy / immutability / unknown-id) — агент дав саме три.
  Плюс окремий `selectors.test.ts` поруч з модулем, `describe("taskPriority")`,
  без `beforeEach` і снапшотів.

**Верифікація A** (команди з секцій «How to verify» самих правил):

```
cd app && npm test        → 20 passed (було 15), 4 файли
cd app && npm run typecheck → tsc --noEmit, 0 помилок
5 creators = 5 Action-варіантів = 5 payloads = 5 reducer-cases
grep any / @ts-ignore / export default / push|splice|sort|reverse → clean
literal actions поза types.ts+actions.ts → clean
```

Жодної нової залежності, `package.json` не торкався, `store.ts` не торкався.

Повний diff запуску A: `scratchpad/run-a-rules-on.diff` (7 файлів, +75/-7).

## Result B — rules OFF

> **TODO — ще не запущено.** Робити в НОВОМУ чаті, тим самим промптом, після
> вимкнення правил (інструкція нижче). Заповнити: які файли торкнув, чи
> мутував стан, чи додав бібліотеку/залежність, чи `any`, чи default export,
> чи редагував `store.ts`, чи впали наявні тести.

## Difference table

> Колонку B заповнити після запуску B.

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| Шлях зміни стану | `dispatch(setTaskPriority(...))` → reducer | TODO |
| Новий Action-варіант | `task/prioritized` у union | TODO |
| Іменування типу дії | lowercase `domain/event`, past tense | TODO |
| Імутабельність | `.map()` + spread | TODO |
| Додано state-бібліотеку | ні | TODO |
| Export style | named | TODO |
| Типобезпека | `Priority` union, 0 `any` | TODO |
| Чіпав protected core | лише дозволене додавання в `types.ts`, 0 видалених рядків | TODO |
| Наявні тести | 15/15 зелені без правок, +5 нових | TODO |
| Дефолт `normal` | у селекторі, щоб не ламати `reducer.test.ts:9` | TODO |

## Conclusion

> Заповнити після B (1–3 речення): чи правила реально змінили поведінку, яке
> правило дало найбільший ефект, що здивувало.

Гіпотеза до запуску B: найбільше важить `do-not-touch.mdc` — саме воно
змусило зробити `priority` опційним і не переписувати `reducer.test.ts:9`.
Без нього найімовірніший сценарій — обов'язкове поле `priority: Priority` +
`priority: "normal"` у reducer, що валить два наявні тести, і агент «лікує»
це правкою самих тестів.

## Як відтворити (обидва запуски)

**Правила ON (запуск A):** робочий стан репо на коміті `07b3803` —
`.cursor/rules/*.mdc` на місці, `@`-імпорти в кореневому `CLAUDE.md` активні.

**Правила OFF (запуск B):** окремий git worktree на стартовому коміті
`e8a230b`, ДО того як правила з'явилися в репо:

```bash
git worktree add --detach <шлях>/run-b e8a230b
ln -s <репо>/app/node_modules <шлях>/run-b/app/node_modules   # щоб npm test працював
```

Чому worktree, а не перейменування `.mdc` → `.mdc.off` у головному репо:
вимкнути довелося б ЧОТИРИ джерела, і пропустити одне легко —

1. `.cursor/rules/*.mdc` (шлях правил Cursor);
2. сім `@.cursor/rules/...` імпортів у кореневому `CLAUDE.md` — інакше Claude
   Code читає правила далі й порівняння безглузде;
3. `app/CLAUDE.md` — імпортує `app/AGENTS.md` з тими самими guardrails
   (PROTECTED files, no deps, named exports, immutability);
4. кореневий `AGENTS.md` — Claude Code читає `AGENTS.md` теж.

На коміті `e8a230b` нічого з цього не існує: `.cursor/` відсутній, а
`app/AGENTS.md` — розмиті чотири рядки («write clean, readable code», «follow
the style already in the file», «don't break the existing tests»), без жодної
згадки про dispatch, імутабельність чи protected files. Головне репо при
цьому не торкається, тому графовані файли не під ризиком і відкат не потрібен.

**Чесне застереження про baseline B.** Стартовий кореневий `AGENTS.md` усе ще
містить один рядок з конвенціями: «named exports only, no `any`/`@ts-ignore`,
immutable state updates, state changes only via `store.dispatch(action)`».
Я його НЕ вилучав — це справжній стан репо до домашки, тобто консервативний
тест. Якщо різниця ON/OFF видна навіть попри цю підсказку, правила тим
переконливіші; якщо B все одно порушить саме ці чотири пункти — це окремий
висновок про різницю між «згадкою в прозі» і «правилом з How to verify».
