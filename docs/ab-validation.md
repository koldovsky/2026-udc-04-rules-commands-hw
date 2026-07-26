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

```text
cd app && npm test        → 20 passed (було 15), 4 файли
cd app && npm run typecheck → tsc --noEmit, 0 помилок
5 creators = 5 Action-варіантів = 5 payloads = 5 reducer-cases
grep any / @ts-ignore / export default / push|splice|sort|reverse → clean
literal actions поза types.ts+actions.ts → clean
```

Жодної нової залежності, `package.json` не торкався, `store.ts` не торкався.

Повний diff запуску A: [`ab-evidence/run-a-rules-on.diff`](ab-evidence/run-a-rules-on.diff)
(7 файлів, +75/-7).

## Result B — rules OFF

Спочатку головне, бо це найцікавіше в цьому A/B: **B НЕ провалився так, як
передбачає `materials/ab-task.md`.** Жодного `zustand`, жодної нової залежності,
жодної мутації, жодного `any`, жодного default export, `store.ts` не торкався.
Він сам знайшов golden path: розширив `Action` union, обробив нову дію в
reducer через `.map()` + spread, додав creator `setPriority`, дописав тести.
Тести зелені: **18 passed**, typecheck чистий.

Чому так добре без правил — видно з самого репо. Стартовий кореневий `AGENTS.md`
містить рядок «named exports only, no `any`, immutable state updates, state
changes only via `store.dispatch(action)`», а коментарі в самому коді прямо
диктують шлях: `reducer.ts:3-4` — «to support a new action, add a variant to the
`Action` union in types.ts, then handle it here», `actions.ts:5` — «add its
creator here too». Тобто «rules OFF» тут не означає «без жодних підсказок».

Різниця виявилась в одному місці — і вона вирішальна:

**B зробив `priority` обов'язковим полем** (`priority: Priority`, без `?`) і
вписав `priority: "normal"` прямо в reducer. Це технічно найчистіше рішення…
якщо не існує наявних тестів. Але воно ламає два з них:

- `reducer.test.ts:9` — `toEqual` порівнює доданий task, а тепер там зайве поле;
- `reducer.test.ts:36` — літерал `Task` без `priority` перестає проходити typecheck.

**І B полагодив це, перевписавши обидва наявні тести.** Замінив assertion на
`toEqual([{ ..., priority: "normal" }])` і дописав `priority: "normal"` у
фікстуру `AppState`. Формально «existing tests green» — так, зелені. Фактично
це вже не ті тести, які були: змінено сам контракт, який вони охороняли.

Тверде числове свідчення — видалені рядки в наявному тест-файлі:

```text
git diff -U0 -- app/src/reducer.test.ts | grep -c '^-[^-]'
A (rules ON):  1   ← лише рядок import (механічно неминучий)
B (rules OFF): 3   ← import + assertion:9 + фікстура:36
```

Дрібніше, але в тому ж напрямку:

- **Не питав дозволу на protected core.** B відредагував `types.ts` одразу, без
  згадки, що це load-bearing файл. A назвав файл і підставу до редагування.
- **Немає read vocabulary.** B не торкнувся `selectors.ts`, тому споживачі
  читають `task.priority` напряму. Дефолт живе в reducer, а не в одному
  місці читання.
- **Демо не оновлено.** `index.ts` у B лишився без згадки про пріоритет —
  фіча є, але в приклад використання не потрапила.
- **Тестів менше і без окремого файлу:** 3 нові `it()` в одному файлі (18 разом)
  проти 5 у двох колокованих файлах у A (20 разом).

Повний diff запуску B: [`ab-evidence/run-b-rules-off.diff`](ab-evidence/run-b-rules-off.diff)
(4 файли, +50/-5).

## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| Шлях зміни стану | `dispatch(setTaskPriority(...))` → reducer | те саме: `dispatch(setPriority(...))` → reducer |
| Новий Action-варіант | `task/prioritized` у union | те саме |
| Іменування типу дії | lowercase `domain/event`, past tense | те саме |
| Імутабельність | `.map()` + spread | те саме |
| Додано state-бібліотеку | ні | ні |
| Export style | named | named |
| Типобезпека | `Priority` union, 0 `any` | `Priority` union, 0 `any` |
| `store.ts` | не торкався | не торкався |
| **Форма поля** | **`priority?: Priority` — опційне** | **`priority: Priority` — обов'язкове** |
| **Наявні тести** | **15/15 зелені, жодного не переписано** | **2 переписано, щоб пройшли** |
| Видалені рядки в `reducer.test.ts` | 1 (тільки import) | 3 (import + assertion + фікстура) |
| Дефолт `normal` | у селекторі `taskPriority` | вписаний у reducer при `task/added` |
| Питав дозвіл на `types.ts` | так, назвав файл і підставу | ні, відредагував одразу |
| `selectors.ts` (read vocabulary) | `taskPriority` доданий | не торкався, читання напряму |
| `index.ts` (демо) | оновлено | лишилось без пріоритету |
| Тести всього | 20 у 4 файлах (+5 нових) | 18 у 3 файлах (+3 нових) |

## Conclusion

Правила змінили поведінку, але **не там, де очікує `ab-task.md`**. Обидва
запуски пройшли golden path однаково добре — бо архітектурні підсказки вже
розсипані по стартовому `AGENTS.md` і по коментарях у самому коді, тому
«rules OFF» тут не був справжнім нулем. Уся різниця сконцентрувалась у
`do-not-touch.mdc`: без нього агент зробив поле обов'язковим і, наткнувшись
на два наявні тести, **переписав самі тести** замість того, щоб змінити
дизайн — 3 видалені рядки проти 1 у запуску A. Це саме той тип збитку, який
у код-ревʼю виглядає невинно («тести ж зелені»), а фактично тихо знімає
охорону з контракту.

Найкорисніше правило — `do-not-touch.mdc`, і конкретно два його рядки: «prefer
an optional field (`priority?`) so reducer.ts:17 and reducer.test.ts:36 still
typecheck» і «NEVER delete, weaken, or rewrite an existing test». Вони працюють
тому, що містять точні номери рядків, а не загальні побажання: агент у запуску A
передбачив конфлікт ДО запуску тестів, а не лікував падіння після.

Що здивувало: гіпотеза, записана до запуску B, справдилась дослівно —
обов'язкове поле + `priority: "normal"` у reducer + правка наявних тестів.
Другий сюрприз — наскільки сильно «rules OFF» підпирається прозою в
коментарях коду. Це аргумент за те, щоб конвенції жили в правилах з
verify-командами, а не тільки в комментарях: коментар підказує напрямок,
але не втримує агента на межі, де починається чужий контракт.

## Як відтворити (обидва запуски)

**Правила ON (запуск A):** робочий стан репо на коміті `07b3803` —
`.cursor/rules/*.mdc` на місці, `@`-імпорти в кореневому `CLAUDE.md` активні.

**Правила OFF (запуск B):** окремий git worktree на стартовому коміті
`e8a230b`, ДО того як правила з'явилися в репо:

```bash
REPO_ROOT="$(git rev-parse --show-toplevel)"
RUN_B_DIR="$REPO_ROOT/../ws04-run-b"

git worktree add --detach "$RUN_B_DIR" e8a230b
ln -s "$REPO_ROOT/app/node_modules" "$RUN_B_DIR/app/node_modules"   # щоб npm test працював
cd "$RUN_B_DIR/app" && npm test
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
